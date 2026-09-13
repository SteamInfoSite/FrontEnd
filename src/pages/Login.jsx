import { useState } from "react";
import logo from "../assets/logo0.png";

import "../styles/Login.css";

function Login() {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      accountName,
      password,
      rememberMe,
    });
  };

  return (
    <div className="login-page">
      <div className="login-logo-area">
        <img src={logo} alt="SteamInfoSite Logo" />
        <h1>SteamInfoSite</h1>
      </div>

      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Log in to your Steam account</h2>

        <div className="login-input-group">
          <label htmlFor="accountName">
            계정 이름으로 로그인
          </label>

          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password">
            비밀번호
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="remember-area">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <span>Remember me</span>
        </label>

        <button
          type="submit"
          className="steam-login-button"
        >
          Steam Login
        </button>
      </form>
    </div>
  );
}

export default Login;