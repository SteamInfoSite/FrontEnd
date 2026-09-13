function GameCard({ game, featured }) {
  return (
    <div className={`game-card ${featured ? "featured" : ""}`}>
      <img src={game.image} alt={game.title || "Game"} />
    </div>
  );
}

export default GameCard;