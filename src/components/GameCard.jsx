import { useNavigate } from "react-router-dom";

function GameCard({ game, featured }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`game-card ${featured ? "featured" : ""}`}
      onClick={() => navigate(`/games/detail/${game.appId}`)}
      aria-label={`${game.title} 상세 페이지로 이동`}
    >
      <img src={game.image} alt={game.title || "Game"} />
    </button>
  );
}

export default GameCard;
