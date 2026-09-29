import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "../styles/Login.css";

function SteamLoginComplete() {
  const navigate = useNavigate();

  const {
    loggedIn,
    status,
    error,
    refreshAuth,
  } = useAuth();

  useEffect(() => {
    if (status === "ready" && loggedIn) {
      navigate("/", { replace: true });
    }
  }, [status, loggedIn, navigate]);

  let message = "";

  if (status === "error") {
    message = error;
  } else if (status === "ready" && !loggedIn) {
    message = "로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요";
  }

  return (
    <main className="login-page">
      <section className="login-box">
        <h2>Steam 로그인 확인</h2>

        {message ? (
          <>
            <p role="alert">{message}</p>

            <button
              type="button"
              className="steam-login-button"
              onClick={refreshAuth}
            >
              다시 확인
            </button>

            <Link to="/login">로그인 화면으로 돌아가기</Link>
          </>
        ) : (
          <p role="status">로그인 상태를 확인하고 있습니다.</p>
        )}
      </section>
    </main>
  );
}

export default SteamLoginComplete;