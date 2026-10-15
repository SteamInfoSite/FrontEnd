import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function GameCard({ game, featured }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className={`game-card ${featured ? "featured" : ""}`}
      onClick={() => navigate("/games/detail/" + game.appId)}
      aria-label={t("{{title}} 상세 페이지로 이동", { title: game.title })}
    >
      <img src={game.image} alt={game.title || "Game"} />
    </button>
  );
}

export default GameCard;
