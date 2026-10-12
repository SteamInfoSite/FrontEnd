import { useEffect, useState } from "react";
import { getGameDetail } from "../services/gameService";
import { Link, useLocation, useParams } from "react-router-dom";
import { useRequireLogin } from "../hooks/useRequireLogin";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { mockGameDetails } from "../mocks/gameDetailMockData";

import "../styles/GameDetail.css";

function GameDetail({ isExample = false }) {
  const { appId } = useParams();

  return (
    <GameDetailContent
      key={`${isExample}-${appId}`}
      appId={appId}
      isExample={isExample}
    />
  );
}

function GameDetailContent({ appId, isExample }) {
  const { hash } = useLocation();
  const requireLogin = useRequireLogin();
  const [selectedImage, setSelectedImage] = useState(0);

  const [result, setResult] = useState({
    status: "loading",
    game: null,
  });

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setResult({
      status: "loading",
      game: null,
    });

    const request = isExample
      ? Promise.resolve(
          mockGameDetails.find(
            (item) => item.id === Number(appId)
          )
        )
      : getGameDetail(appId, {
          signal: controller.signal,
        });

    request
      .then((game) => {
        if (controller.signal.aborted) return;

        setResult({
          status: game ? "success" : "missing",
          game: game || null,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;

        setResult({
          status: error.status === 404 ? "missing" : "error",
          game: null,
        });
      });

    return () => controller.abort();
  }, [appId, isExample, retry]);

  const game = result.game;

  if (!game) {
    return (
      <div className="game-detail-page">
        <Sidebar />

        <div className="game-detail-main-area">
          <Header />

          <main className="game-detail-content">
            <div
              className="game-detail-not-found"
              role={
                result.status === "error" ? "alert" : "status"
              }
            >
              <h1>
                {result.status === "loading"
                  ? "게임 정보를 불러오는 중입니다."
                  : result.status === "missing"
                    ? "게임 정보를 찾을 수 없습니다."
                    : "게임 정보를 불러오지 못했습니다."}
              </h1>

              {result.status === "error" && (
                <button
                  type="button"
                  onClick={() =>
                    setRetry((value) => value + 1)
                  }
                >
                  다시 시도
                </button>
              )}

              {result.status !== "loading" && (
                <p>
                  <Link to="/">홈으로 돌아가기</Link>
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const platformNames = [];
  if (game.platforms.windows) platformNames.push("Windows");
  if (game.platforms.mac) platformNames.push("macOS");
  if (game.platforms.linux) platformNames.push("Linux");

  const priceText = game.isFree
    ? "무료 플레이"
    : game.priceText || "스팀에서 가격 확인";
  const developerText = game.developers.length
    ? game.developers.join(", ")
    : "개발사 정보 없음";
  const publisherText = game.publishers.length
    ? game.publishers.join(", ")
    : "배급사 정보 없음";
  const images = [
    ...new Set(
      [game.image, ...(game.screenshots || [])].filter(Boolean)
    ),
  ];
  const detailMenus = [
    { id: "game_introduction", label: "게임 소개" },
    { id: "game_reviews", label: "유저 평가" },
    { id: "game_video_section", label: "영상" },
  ];

  const handleWishlist = () => {
    if (!requireLogin()) {
      return;
    }
    window.alert("찜 목록 기능은 준비 중입니다");
  };

  return (
    <div className="game-detail-page">
      <Sidebar />

      <div className="game-detail-main-area">
        <Header />

        <main id="game_detail_content" className="game-detail-content">

          <div className="game-detail-heading">
            <div>
              <h1>{game.title}</h1>
              <p>{game.shortDescription}</p>
            </div>
            <span>{platformNames.join(" · ")} · {priceText}</span>
          </div>

          <section className="game-detail-summary">
            <div className="game-detail-media">
              {images.length > 0 ? (
                <img
                  className="game-main-image"
                  src={images[selectedImage]}
                  alt={`${game.title} 대표 이미지`}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ) : (
                <p>등록된 게임 이미지가 없습니다.</p>
              )}

              <div className="game-media-list">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`game-media-item ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`${game.title} 이미지 ${index + 1} 보기`}
                    aria-pressed={selectedImage === index}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="game-info-card">
              <h2>{priceText}</h2>
              <p className="game-genre-list">
                {game.genres.length ? game.genres.join(" · ") : "장르 정보 없음"}
              </p>
              <p className="game-short-description">{game.shortDescription}</p>

              <dl className="game-basic-info">
                <div><dt>개발사</dt><dd>{developerText}</dd></div>
                <div><dt>배급사</dt><dd>{publisherText}</dd></div>
                <div><dt>출시일</dt><dd>{game.comingSoon ? "출시 예정" : game.relDate}</dd></div>
                <div><dt>이용 연령</dt><dd>{game.requiredAge == null ? "연령 정보 없음" : game.requiredAge ? `${game.requiredAge}세 이상` : "전체 이용가"}</dd></div>
              </dl>

              <a
                id="steam_store_link"
                className="steam-store-link"
                href={game.appId
                  ? `https://store.steampowered.com/app/${game.appId}`
                  : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`}
                target="_blank"
                rel="noreferrer"
              >
                {game.appId ? "Steam 스토어에서 보기" : "Steam 스토어에서 검색"}
              </a>
              <button
                id="game_wishlist_button"
                className="game-wishlist-button"
                type="button"
                onClick={handleWishlist}
              >
                ♡ 찜 목록에 추가
              </button>
            </div>
          </section>

          <nav className="game-detail-tabs" aria-label="게임 상세 메뉴">
            {detailMenus.map((menu) => (
              <a
                key={menu.id}
                href={`#${menu.id}`}
                aria-current={(hash || "#game_introduction") === `#${menu.id}` ? "location" : undefined}
              >
                {menu.label}
              </a>
            ))}
          </nav>

          <div className="game-detail-sections">
            <section id="game_introduction" className="game-detail-section">
              <h2>게임 소개</h2>
              <p>{game.description || game.shortDescription}</p>

              {game.categories.length > 0 && (
                <div className="game-category-list">
                  {game.categories.map((category) => (
                    <span key={category}>{category}</span>
                  ))}
                </div>
              )}
            </section>

            <section id="game_information" className="game-detail-section">
              <h2>게임 정보</h2>
              <dl className="game-detail-info-list">
                <div><dt>플랫폼</dt><dd>{platformNames.join(", ") || "플랫폼 정보 없음"}</dd></div>
                <div><dt>지원 언어</dt><dd>{game.supportedLanguages}</dd></div>
              </dl>
            </section>
          </div>

          <section id="game_reviews" className="game-detail-section game-extra-section">
            <h2>유저 평가</h2>
            <p>{game.recommendationsTotal == null
              ? "아직 제공된 평가 정보가 없습니다. Steam 스토어에서 최신 평가를 확인해 주세요."
              : `Steam 추천 ${game.recommendationsTotal.toLocaleString()}개`}</p>
          </section>

          <section id="game_video_section" className="game-detail-section game-video-section">
            <h2>영상</h2>
            {game.movie.length > 0 ? (
              <div className="game-video-list">
                {game.movie.map((movieUrl, index) => (
                  <a key={movieUrl} href={movieUrl} target="_blank" rel="noreferrer">
                    게임 영상 {index + 1}
                  </a>
                ))}
              </div>
            ) : (
              <p>{game.title}의 제공된 영상 정보가 없습니다.</p>
            )}
          </section>

          <p className="game-detail-source">
            {isExample
              ? "현재 게임 정보는 예시 데이터입니다."
              : "Steam에서 수집한 게임 정보입니다."}
            {" · 이미지 출처: Steam"}
          </p>
        </main>
      </div>
    </div>
  );
}

export default GameDetail;
