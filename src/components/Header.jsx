import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Search } from "lucide-react";
import { getGameSuggestions } from "../services/gameService";

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

const [suggestions, setSuggestions] = useState([]);
const [suggestionsOpen, setSuggestionsOpen] = useState(false);
const [activeIndex, setActiveIndex] = useState(-1);

useEffect(() => {
  const keyword = searchTerm.trim();
  setSuggestions([]);
  setActiveIndex(-1);

  if (!suggestionsOpen || keyword.length < 2) return;

  const controller = new AbortController();
  const timer = setTimeout(() => {
    getGameSuggestions({ q: keyword, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setSuggestions(Array.isArray(items) ? items : []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSuggestions([]);
      });
  }, 300);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [searchTerm, suggestionsOpen]);

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

const showSuggestions = suggestionsOpen && suggestions.length > 0;

  return (
    <header id="site_header" className="header">
      <form
        className="search-area"
        onSubmit={(event) => {
          event.preventDefault();
          const q = searchTerm.trim();
          setSuggestionsOpen(false);
          setActiveIndex(-1);
          if (q) navigate(`/games/search?${new URLSearchParams({ q })}`);
        }}
      >
        <div
          className="search-field"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setSuggestionsOpen(false);
              setActiveIndex(-1);
            }
          }}
        >
          <input
            id="game_search_input"
            type="search"
            value={searchTerm}
            onFocus={() => setSuggestionsOpen(true)}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setSuggestionsOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setSuggestionsOpen(false);
                setActiveIndex(-1);
              } else if (
                suggestionsOpen && suggestions.length > 0 &&
                (event.key === "ArrowDown" || event.key === "ArrowUp")
              ) {
                event.preventDefault();
                setActiveIndex((index) => event.key === "ArrowDown"
                  ? (index + 1) % suggestions.length
                  : index <= 0 ? suggestions.length - 1 : index - 1);
              } else if (
                event.key === "Enter" && suggestionsOpen && activeIndex >= 0
              ) {
                event.preventDefault();
                setSuggestionsOpen(false);
                navigate(`/games/detail/${suggestions[activeIndex].appId}`);
              }
            }}
            placeholder={t("게임 검색")}
            aria-label={t("게임 검색")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls={showSuggestions ? "game-search-suggestions" : undefined}
            aria-activedescendant={
              showSuggestions && activeIndex >= 0
                ? `game-search-option-${activeIndex}` : undefined
            }
            maxLength={100}
          />
          <button className="search-submit" type="submit"
            aria-label={t("Search")} title={t("Search")}>
            <Search size={20} aria-hidden="true" />
          </button>

          {showSuggestions && (
            <div id="game-search-suggestions"
              className="search-suggestions" role="listbox"
              aria-label={t("게임 검색")}>
              {suggestions.map((item, index) => (
                <button
                  key={item.appId}
                  id={`game-search-option-${index}`}
                  className={`search-suggestion ${activeIndex === index ? "active" : ""}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  onClick={() => {
                    setSuggestionsOpen(false);
                    navigate(`/games/detail/${item.appId}`);
                  }}
                >
                  <span className="suggestion-image">
                    {item.image && <img src={item.image} alt="" />}
                  </span>
                  <span className="suggestion-title">{item.gameName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
