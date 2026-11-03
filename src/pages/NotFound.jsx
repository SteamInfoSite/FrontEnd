import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="not-found-page">
      <Sidebar />

      <div className="not-found-main-area">
        <Header />

        <main className="not-found-content">
          <div className="not-found-message">
            <p className="not-found-code">404</p>
            <h1>{t("페이지를 찾을 수 없습니다.")}</h1>
            <p>{t("주소를 다시 확인하거나 이전 페이지로 돌아가 주세요.")}</p>

            <div className="not-found-actions">
              <button type="button" onClick={goBack}>
                {t("이전 페이지로 돌아가기")}
              </button>
              <Link to="/">{t("홈으로 돌아가기")}</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NotFound;