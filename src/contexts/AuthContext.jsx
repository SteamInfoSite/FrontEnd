import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  refreshSteamAccessToken,
  logoutSteam,
} from "../services/steamAuthService";

const AuthContext = createContext(null);

const EMPTY_AUTH = {
  loggedIn: false,
  steamId: null,
  accessToken: null,
};

function getRefreshDelay(accessToken) {
  try {
    const encodedPayload = accessToken.split(".")[1];
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const { exp } = JSON.parse(atob(paddedBase64));

    if (Number.isFinite(exp)) {
      return Math.max(1000, exp * 1000 - Date.now() - 60_000);
    }
  } catch {
    // 만료 시각을 읽지 못해도 주기적으로 갱신을 시도한다.
  }

  return 14 * 60 * 1000;
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(EMPTY_AUTH);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshAuth = useCallback(() => {
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAuth() {
      setStatus((currentStatus) =>
        currentStatus === "ready" ? "ready" : "loading"
      );
      setError("");

      try {
        const result = await refreshSteamAccessToken();
        if (!active) return;

        setAuth(
          result === null
            ? EMPTY_AUTH
            : {
                loggedIn: true,
                steamId: result.steamId,
                accessToken: result.accessToken,
              }
        );
        setStatus("ready");
      } catch {
        if (!active) return;

        setAuth(EMPTY_AUTH);
        setError("로그인 상태를 확인하지 못했습니다.");
        setStatus("error");
      }
    }

    loadAuth();

    return () => {
      active = false;
    };
  }, [refreshCount]);

  useEffect(() => {
    if (status !== "ready" || !auth.accessToken) return;

    const timer = window.setTimeout(
      refreshAuth,
      getRefreshDelay(auth.accessToken)
    );

    function refreshIfNeeded() {
      if (getRefreshDelay(auth.accessToken) <= 1000) {
        refreshAuth();
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshIfNeeded();
      }
    }

    window.addEventListener("focus", refreshIfNeeded);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", refreshIfNeeded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [auth.accessToken, status, refreshAuth]);

  const logout = useCallback(async () => {
    await logoutSteam();
    setAuth(EMPTY_AUTH);
    setError("");
    setStatus("ready");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn: auth.loggedIn,
        steamId: auth.steamId,
        accessToken: auth.accessToken,
        status,
        error,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth는 AuthProvider안에서 사용해야 합니다");
  }

  return context;
}