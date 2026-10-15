import { useEffect, useState } from "react";
import { getGameDetail } from "../services/gameService";
import { Link, useLocation, useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { mockGameDetails } from "../mocks/gameDetailMockData";
import GameMovieCard from "../components/GameMovieCard";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t, formatNumber } = useLanguage();
  const { hash } = useLocation();
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
                {t(result.status === "loading"
                  ? "게임 정보를 불러오는 중입니다."
                  : result.status === "missing"
                    ? "게임 정보를 찾을 수 없습니다."
                    : "게임 정보를 불러오지 못했습니다.")}
              </h1>

              {result.status === "error" && (
                <button
                  type="button"
                  onClick={() =>
                    setRetry((value) => value + 1)
                  }
                >
                  {t("다시 시도")}
                </button>
              )}

              {result.status !== "loading" && (
                <p>
                  <Link to="/">{t("홈으로 돌아가기")}</Link>
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
  const shortDescription = isExample ? t(game.shortDescription) : game.shortDescription;
  const description = isExample
    ? t(game.description || game.shortDescription)
    : game.description || game.shortDescription;
  const genres = isExample ? game.genres.map((genre) => t(genre)) : game.genres;

  const priceText = game.isFree
    ? t("무료 플레이")
    : game.priceText ? t(game.priceText) : t("스팀에서 가격 확인");
  const developerText = game.developers.length
    ? game.developers.join(", ")
    : t("개발사 정보 없음");
  const publisherText = game.publishers.length
    ? game.publishers.join(", ")
    : t("배급사 정보 없음");
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

  return (
    <div className="game-detail-page">
      <Sidebar />

      <div className="game-detail-main-area">
        <Header />

        <main id="game_detail_content" className="game-detail-content">

          <div className="game-detail-heading">
            <div>
              <h1>{game.title}</h1>
              <p>{shortDescription}</p>
            </div>
            <span>{platformNames.join(" · ")} · {priceText}</span>
          </div>

          <section className="game-detail-summary">
            <div className="game-detail-media">
              {images.length > 0 ? (
                <img
                  className="game-main-image"
                  src={images[selectedImage]}
                  alt={t("{{title}} 대표 이미지", { title: game.title })}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ) : (
                <p>{t("등록된 게임 이미지가 없습니다.")}</p>
              )}

              <div className="game-media-list">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`game-media-item ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={t("{{title}} 이미지 {{number}} 보기", { title: game.title, number: index + 1 })}
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
                {genres.length ? genres.join(" · ") : t("장르 정보 없음")}
              </p>
              <p className="game-short-description">{shortDescription}</p>

              <dl className="game-basic-info">
                <div><dt>{t("개발사")}</dt><dd>{developerText}</dd></div>
                <div><dt>{t("배급사")}</dt><dd>{publisherText}</dd></div>
                <div><dt>{t("출시일")}</dt><dd>{game.comingSoon ? t("출시 예정") : t(game.relDate)}</dd></div>
                <div><dt>{t("이용 연령")}</dt><dd>{game.requiredAge == null ? t("연령 정보 없음") : game.requiredAge ? t("{{age}}세 이상", { age: game.requiredAge }) : t("전체 이용가")}</dd></div>
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
                {t(game.appId ? "Steam 스토어에서 보기" : "Steam 스토어에서 검색")}
              </a>
            </div>
          </section>

          <nav className="game-detail-tabs" aria-label={t("게임 상세 메뉴")}>
            {detailMenus.map((menu) => (
              <a
                key={menu.id}
                href={`#${menu.id}`}
                aria-current={(hash || "#game_introduction") === `#${menu.id}` ? "location" : undefined}
              >
                {t(menu.label)}
              </a>
            ))}
          </nav>

          <div className="game-detail-sections">
            <section id="game_introduction" className="game-detail-section">
              <h2>{t("게임 소개")}</h2>
              <p>{description}</p>

              {game.categories.length > 0 && (
                <div className="game-category-list">
                  {[...new Set(game.categories)].map((category) => (
                    <span key={category}>{category}</span>
                  ))}
                </div>
              )}
            </section>

            <section id="game_information" className="game-detail-section">
              <h2>{t("게임 정보")}</h2>
              <dl className="game-detail-info-list">
                <div><dt>{t("플랫폼")}</dt><dd>{platformNames.join(", ") || t("플랫폼 정보 없음")}</dd></div>
                <div><dt>{t("지원 언어")}</dt><dd>{t(game.supportedLanguages)}</dd></div>
              </dl>
            </section>
          </div>

          <section id="game_reviews" className="game-detail-section game-extra-section">
            <h2>{t("유저 평가")}</h2>
            <p>{game.recommendationsTotal == null
              ? t("아직 제공된 평가 정보가 없습니다. Steam 스토어에서 최신 평가를 확인해 주세요.")
              : t("Steam 추천 {{count}}개", { count: formatNumber(game.recommendationsTotal) })}</p>
          </section>

          <section id="game_video_section" className="game-detail-section game-video-section">
            <h2>{t("영상")}</h2>
            {game.movie.length > 0 ? (
              <div className="game-video-list">
                {game.movie.map((movie, index) => (
                  <GameMovieCard
                    key={`${movie.movieId ?? index}-${movie.hlsH264}`}
                    movie={movie}
                    index={index}
                    appId={game.appId}
                  />
                ))}
              </div>
            ) : (
              <p>{t("{{title}}의 제공된 영상 정보가 없습니다.", { title: game.title })}</p>
            )}
          </section>

          <p className="game-detail-source">
            {t(isExample
              ? "현재 게임 정보는 예시 데이터입니다."
              : "Steam에서 수집한 게임 정보입니다.")}
            {t(" · 이미지 출처: Steam")}
          </p>
        </main>
      </div>
    </div>
  );
}

export default GameDetail;
