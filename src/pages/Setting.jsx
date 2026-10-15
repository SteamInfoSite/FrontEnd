import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/Setting.css";

function Setting() {
  const { language, saveLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage(saveLanguage(selectedLanguage)
      ? "언어 설정을 저장했습니다."
      : "언어 설정을 저장하지 못했습니다.");
  };

  return (
    <div className="setting-page">
      <Sidebar />

      <div className="setting-main-area">
        <Header />

        <main id="setting_content" className="setting-content">
          <header className="setting-heading">
            <h1>{t("Setting")}</h1>
            <p>{t("서비스에서 사용할 언어를 선택하세요.")}</p>
          </header>

          <section
            id="setting_language_section"
            className="setting-language-section"
            aria-labelledby="setting_language_title"
          >
            <h2 id="setting_language_title">{t("언어 설정")}</h2>
            <p>{t("메뉴와 안내 문구에 적용할 언어를 설정합니다.")}</p>

            <div className="setting-language-card">
              <label htmlFor="setting_language_select">{t("표시 언어")}</label>

              <select
                id="setting_language_select"
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value);
                  setMessage("");
                }}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>

              <p className="setting-language-hint">{t("한국어 · English · 日本語 중 선택할 수 있습니다.")}</p>

              <div className="setting-card-footer">
                <button
                  id="setting_save_button"
                  type="button"
                  onClick={handleSave}
                >
                  {t("변경 사항 저장")}
                </button>
              </div>

              <p
                id="setting_status_message"
                className="setting-status-message"
                role="status"
              >
                {message && t(message)}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Setting;
