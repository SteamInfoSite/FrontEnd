import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { mockGameDetails } from "../mocks/gameDetailMockData";

import "../styles/GameDetail.css";

function GameDetail() {
  const { appId } = useParams();
  return <GameDetailContent key={appId} appId={appId} />;
}

function GameDetailContent({ appId }) {
  const { hash } = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const game = mockGameDetails.find(
    (item) => item.id === Number(appId)
  );

  if (!game) {
    return (
      <div className="game-detail-page">
        <Sidebar />
        <div className="game-detail-main-area">
          <Header />
          <main className="game-detail-content">
            <div className="game-detail-not-found">
              <h1>게임 정보를 찾을 수 없습니다.</h1>
              <p>주소를 확인하거나 홈에서 게임을 다시 선택해 주세요.</p>
              <Link to="/">홈으로 돌아가기</Link>
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

  const priceText = game.isFree ? "무료 플레이" : "유료 게임";
  const developerText = game.developers.length
    ? game.developers.join(", ")
    : "개발사 정보 없음";
  const publisherText = game.publishers.length
    ? game.publishers.join(", ")
    : "배급사 정보 없음";
  const images = [...new Set([game.image, ...(game.screenshots || [])])];
  const detailMenus = [
    { id: "game_introduction", label: "게임 소개" },
    { id: "game_reviews", label: "유저 평가" },
    { id: "game_requirements", label: "시스템 요구사항" },
    { id: "game_video_section", label: "영상" },
  ];

  const handleWishlist = () => {
    window.alert("찜 목록은 로그인 후 이용할 수 있습니다. Steam 로그인 화면으로 이동합니다.");
    // 인증 API 연결 전에는 Steam 공식 로그인 화면으로 이동합니다.
    window.location.assign("https://store.steampowered.com/login/");
  };

  return (
    <div className="game-detail-page">
      <Sidebar />

      <div className="game-detail-main-area">
        <Header />

        <main id="game_detail_content" className="game-detail-content">
          <div className="game-detail-path"><Link to="/">Home</Link> / Game / 게임 상세</div>

          <div className="game-detail-heading">
            <div>
              <h1>{game.title}</h1>
              <p>{game.shortDescription}</p>
            </div>
            <span>{platformNames.join(" · ")} · {priceText}</span>
          </div>

          <section className="game-detail-summary">
            <div className="game-detail-media">
              <img
                className="game-main-image"
                src={images[selectedImage]}
                alt={`${game.title} 대표 이미지`}
              />

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
                aria-describedby="game_wishlist_note"
                onClick={handleWishlist}
              >
                ♡ 찜 목록에 추가
              </button>
              <p id="game_wishlist_note" className="game-wishlist-note">찜 기능은 로그인 후 이용할 수 있습니다. 클릭하면 Steam 로그인 화면으로 이동합니다.</p>
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
                <div>
                  <dt>Steam 추천</dt>
                  <dd>{game.recommendationsTotal === null ? "추천 수 정보 없음" : `${game.recommendationsTotal.toLocaleString()}개`}</dd>
                </div>
              </dl>
            </section>
          </div>

          <section id="game_reviews" className="game-detail-section game-extra-section">
            <h2>유저 평가</h2>
            <p>{game.recommendationsTotal == null
              ? "아직 제공된 평가 정보가 없습니다. Steam 스토어에서 최신 평가를 확인해 주세요."
              : `Steam 추천 ${game.recommendationsTotal.toLocaleString()}개`}</p>
          </section>

          <section id="game_requirements" className="game-detail-section game-extra-section">
            <h2>시스템 요구사항</h2>
            <div className="game-requirements-grid">
              <div><h3>최소 사양</h3><p>{game.requirements?.minimum || "최소 사양 정보가 제공되지 않았습니다."}</p></div>
              <div><h3>권장 사양</h3><p>{game.requirements?.recommended || "권장 사양 정보가 제공되지 않았습니다."}</p></div>
            </div>
            <p className="game-requirements-note">구매 또는 설치 전 Steam 스토어에서 시스템 요구사항을 확인해 주세요.</p>
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
            ) : <p>등록된 게임 영상이 없습니다.</p>}
          </section>

          <p className="game-detail-source">현재 게임 정보는 목업 데이터입니다. 이미지 출처: Steam</p>
        </main>
      </div>
    </div>
  );
}

export default GameDetail;
