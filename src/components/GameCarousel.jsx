import { useState } from "react";
import GameCard from "./GameCard";
import { useLanguage } from "../contexts/LanguageContext";

function GameCarousel({ title, games = [] }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!games || games.length === 0) return null;

  // 이전 버튼
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? games.length - 1 : prevIndex - 1
    );
  };

  // 다음 버튼
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === games.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 게임이 적을 때는 기존의 3장 배치를 유지합니다.
  const getVisibleGames = () => {
    if (games.length < 3) return games.map((game, index) => ({ ...game, isFeatured: index === currentIndex }));
    
    const prev = (currentIndex - 1 + games.length) % games.length;
    const curr = currentIndex;
    const next = (currentIndex + 1) % games.length;

    return [
      { ...games[prev], isFeatured: false },
      { ...games[curr], isFeatured: true },
      { ...games[next], isFeatured: false }
    ];
  };

  // 같은 카드를 유지하면서 위치만 바꿔야 CSS가 이동 과정을 보여줄 수 있습니다.
  const getOffset = (index) => {
    const distance = (index - currentIndex + games.length) % games.length;
    return distance > games.length / 2 ? distance - games.length : distance;
  };

  const useSlidingLayout = games.length >= 5;
  const visibleGames = useSlidingLayout ? [] : getVisibleGames();

  return (
    <section className="game-section">
      <h2>{title}</h2>

      <div className="game-carousel">
        <button type="button" className="carousel-button prev" onClick={handlePrev} aria-label={t("{{title}} 이전 게임", { title })}>
          ‹
        </button>

        <div className={`game-list${useSlidingLayout ? "" : " game-list--static"}`}>
          {useSlidingLayout
            ? games.map((game, index) => {
                const offset = getOffset(index);
                const hidden = Math.abs(offset) > 1;

                return (
                  <div
                    key={game.id}
                    className="game-carousel-item"
                    style={{ "--offset": offset }}
                    data-hidden={hidden}
                    aria-hidden={hidden}
                    inert={hidden}
                  >
                    <GameCard game={game} featured={offset === 0} />
                  </div>
                );
              })
            : visibleGames.map((game, index) => (
                <GameCard
                  key={`${game.id}-${index}`}
                  game={game}
                  featured={game.isFeatured}
                />
              ))}
        </div>

        <button type="button" className="carousel-button next" onClick={handleNext} aria-label={t("{{title}} 다음 게임", { title })}>
          ›
        </button>
      </div>
    </section>
  );
}

export default GameCarousel;
