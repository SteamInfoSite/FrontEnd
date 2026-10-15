import { useEffect, useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import GameCarousel from "../components/GameCarousel";
import { getHotGames, getNewGames } from "../services/gameService";
import { useLanguage } from "../contexts/LanguageContext";

import "../styles/Home.css";

const PAGE_SIZE = 10;

function HomeGameSection({ title, result, onRetry }) {
  const { t } = useLanguage();
  if (result.status === "success" && result.items.length > 0) {
    return <GameCarousel title={title} games={result.items} />;
  }

  const message = result.status === "loading"
    ? t("게임을 불러오는 중입니다.")
    : result.status === "error"
      ? t("게임 목록을 불러오지 못했습니다.")
      : t("표시할 게임이 없습니다.");

  return (
    <section className="game-section">
      <h2>{title}</h2>
      <div className="game-section-message" role={result.status === "error" ? "alert" : "status"}>
        <p>{message}</p>
        {result.status === "error" && (
          <button type="button" onClick={onRetry}>{t("다시 시도")}</button>
        )}
      </div>
    </section>
  );
}

function Home() {
  const { t } = useLanguage();
  const [newGames, setNewGames] = useState({ status: "loading", items: [] });
  const [popularGames, setPopularGames] = useState({ status: "loading", items: [] });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setNewGames({ status: "loading", items: [] });
    setPopularGames({ status: "loading", items: [] });

    getNewGames({
      platform: "all",
      sort: "released_desc",
      page: 1,
      pageSize: PAGE_SIZE,
      signal: controller.signal,
    })
      .then(({ items }) => {
        if (!controller.signal.aborted) {
          setNewGames({ status: "success", items });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setNewGames({ status: "error", items: [] });
        }
      });

    getHotGames({
      platform: "all",
      page: 1,
      pageSize: PAGE_SIZE,
      signal: controller.signal,
    })
      .then(({ items }) => {
        if (!controller.signal.aborted) {
          setPopularGames({ status: "success", items });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPopularGames({ status: "error", items: [] });
        }
      });

    return () => controller.abort();
  }, [retry]);

  const handleRetry = () => setRetry((previous) => previous + 1);

  return (
    <div className="home">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="content">
          <HomeGameSection
            title={t("신규 게임들")}
            result={newGames}
            onRetry={handleRetry}
          />

          <HomeGameSection
            title={t("역대 인기 게임들")}
            result={popularGames}
            onRetry={handleRetry}
          />
        </main>
      </div>
    </div>
  );
}

export default Home;
