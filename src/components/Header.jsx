import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

//로그인 안내 페이지로 보냄
function Header() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const currentQ = new URLSearchParams(location.search).get("q") || "";
  const [searchTerm, setSearchTerm] = useState(currentQ);

  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  const {
    loggedIn,
    status,
    error,
    refreshAuth,
    logout,
  } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      setLogoutError("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header id="site_header" className="header">
      <form
        className="search-area"
        onSubmit={(event) => {
          event.preventDefault();
          const q = searchTerm.trim();
          if (q) navigate(`/games/search?${new URLSearchParams({ q })}`);
        }}
      >
        <label htmlFor="game_search_input">{t("Search")}:</label>
        <input
          id="game_search_input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={t("게임 검색")}
        />
        <button type="submit">{t("Search")}</button>
      </form>

      <div className="auth-buttons">
        {status === "loading" ? (
          <span role="status">{t("로그인 확인 중…")}</span>
        ) : status === "error" ? (
          <>
            <p className="auth-error" role="alert">
              {t(error)}
            </p>

            <button type="button" onClick={refreshAuth}>
              {t("다시 확인")}
            </button>
          </>
        ) : loggedIn ? (
          <>
            <button
              id="steam_logout_button"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? t("로그아웃 중…") : t("로그아웃")}
            </button>

            {logoutError && (
              <p className="auth-error" role="alert">
                {t(logoutError)}
              </p>
            )}
          </>
        ) : (
          <button
            id="steam_login_button"
            type="button"
            onClick={() => navigate("/login")}
          >
            {t("Steam Login")}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
