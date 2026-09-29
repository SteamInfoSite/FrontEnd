import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getLoginStatus,
  logoutSteam,
} from "../services/steamAuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    loggedIn: false,
    steamId: null,
  });

  //loading: 조회 중, ready: 조회 완료, error: 조회 실패
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshAuth = useCallback(() => {
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAuth() {
      setStatus("loading");
      setError("");

      try {
        const result = await getLoginStatus({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setAuth({
          loggedIn: result.loggedIn,
          steamId: result.steamId,
        });

        setStatus("ready");
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setError("로그인 상태를 확인하지 못했습니다.");
        setStatus("error");
      }
    }

    loadAuth();

    return () => {
      controller.abort();
    };
  }, [refreshCount]);

  const logout = useCallback(async () => {
    //서버의 로그아웃이 성공한뒤 화면 상태를 변경
    await logoutSteam();

    setAuth({
      loggedIn: false,
      steamId: null,
    });

    setError("");
    setStatus("ready");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn: auth.loggedIn,
        steamId: auth.steamId,
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