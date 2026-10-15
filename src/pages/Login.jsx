import { Link } from "react-router-dom";
import logo from "../assets/logo0.png";
import { startSteamLogin } from "../services/steamAuthService";
import { useLanguage } from "../contexts/LanguageContext";

import "../styles/Login.css";

function Login() {
  const { t } = useLanguage();
  return (
    <div className="login-page">
      <div className="login-logo-area">
        <img src={logo} alt={t("SteamInfoSite Logo")} />
        <h1>SteamInfoSite</h1>
      </div>

      <section className="login-box">
        <h2>{t("Steam 계정으로 로그인")}</h2>

        <p>
          {t("Steam 공식 인증 화면에서 로그인합니다.")}
        </p>
        {/* SteamInfoSite에서는 스팀 계정의 비밀번호를 입력받거나 저장하지 않음 */}

        <button
          id="steam_openid_login_button"
          type="button"
          className="steam-login-button"
          onClick={startSteamLogin}
        >
          {t("Steam으로 로그인")}
        </button>

        <Link to="/">{t("홈으로 돌아가기")}</Link>
      </section>
    </div>
  );
}

export default Login;
