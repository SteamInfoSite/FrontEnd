function GameCard({ game, featured }) {
  return (
    <div 
    // 카드 변화 감지
      key={game.id} 
      className={`game-card ${featured ? "featured" : ""}`}
    >
      <img src={game.image} alt={game.title} />
    </div>
  );
}

export default GameCard;