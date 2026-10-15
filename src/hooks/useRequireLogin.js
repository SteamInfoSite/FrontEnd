import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export function useRequireLogin() {
  const navigate = useNavigate();
  const { loggedIn, status } = useAuth();
  const { t } = useLanguage();

  function requireLogin() {
    if (status === "loading") {
      window.alert(t("로그인 상태를 확인하고 있으므로 잠시후 다시 눌러 주세요"));
      return false;
    }

    if (status === "error") {
      window.alert(
        t("로그인 상태를 확인하지 못했으므로 다시 확인 버튼을 눌러 주세요.")
      );
      return false;
    }

    if (!loggedIn) {
      window.alert(t("로그인이 필요한 기능입니다"));
      navigate("/login");
      return false;
    }

    return true;
  }

  return requireLogin;
}
