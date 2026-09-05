import { useState } from "react";
import GameCard from "./GameCard";

function GameCarousel({ title, games = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!games || games.length === 0) return null;

  // 이전 버튼 (왼쪽)
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? games.length - 1 : prevIndex - 1
    );
  };

  // 다음 버튼 (오른쪽)
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === games.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 이전, 현재, 다음 카드 순환하면서 배치되도록 계산산
  const getVisibleGames = () => {
    if (games.length < 3) return games;
    
    const prev = (currentIndex - 1 + games.length) % games.length;
    const curr = currentIndex;
    const next = (currentIndex + 1) % games.length;

    return [
      { ...games[prev], isFeatured: false },
      { ...games[curr], isFeatured: true },
      { ...games[next], isFeatured: false }
    ];
  };

  const visibleGames = getVisibleGames();

  return (
    <section className="game-section">
      <h2>{title}</h2>

      <div className="game-carousel">
        <button className="carousel-button prev" onClick={handlePrev}>
          ‹
        </button>

        <div className="game-list">
          {visibleGames.map((game, index) => (
            <GameCard
              key={`${game.id}-${index}`}
              game={game}
              featured={game.isFeatured}
            />
          ))}
        </div>

        <button className="carousel-button next" onClick={handleNext}>
          ›
        </button>
      </div>
    </section>
  );
}

export default GameCarousel;