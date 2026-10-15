import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

import SteamApiKeyPanel from "../components/SteamApiKeyPanel";
import SteamProfileCard from "../components/SteamProfileCard";
import SteamFriendsList from "../components/SteamFriendsList";

import "../styles/Social.css";

function Social() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loggedIn, status, steamId } = useAuth();

  return (
    <div className="social-page">
      <Sidebar />

      <div className="social-main-area">
        <Header />

        <main id="social_content" className="social-content">
          <div className="social-heading">
            <div>
              <h1>{t("Social")}</h1>
              <p>{t("내 Steam 프로필과 친구의 접속 상태를 확인하세요.")}</p>
            </div>
          </div>

          {status === "loading" ? (
            <p className="social-loading" role="status">
              {t("로그인 상태를 확인하는 중입니다.")}
            </p>
          ) : loggedIn && status === "ready" ? (
            <SteamApiKeyPanel key={steamId}>
              <SteamProfileCard />
              <SteamFriendsList />
            </SteamApiKeyPanel>
          ) : (
            <section
              id="social_login_notice"
              className="social-login-notice"
              aria-labelledby="social_login_title"
            >
              <div className="social-login-message">
                <span className="social-login-icon" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="17" r="7" />
                    <path d="M9 38c2-9 8-14 15-14s13 5 15 14" />
                  </svg>
                </span>

                <h2 id="social_login_title">
                  {t("친구의 활동을 보려면 로그인이 필요합니다")}
                </h2>

                <p>
                  {t("Steam 계정으로 로그인하고 API 키를 등록하면 내 프로필과 친구 목록을 볼 수 있습니다.")}
                </p>

                {status === "error" && (
                  <p className="social-auth-error" role="alert">
                    {t("로그인 상태를 확인하지 못했습니다. 서버 연결을 확인해 주세요.")}
                  </p>
                )}

                <button
                  id="social_login_button"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  {t("Steam으로 로그인")}
                </button>
              </div>

              <p className="social-login-footer">
                {t("내 프로필과 친구 목록은 로그인 및 API 키 등록 후 표시됩니다.")}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Social;
