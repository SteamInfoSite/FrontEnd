import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import GameCarousel from "../components/GameCarousel";
import { getNewGames, getHotGames } from "../services/gameService";

import "../styles/Home.css";

function HomeGameSection({ title, result }) {
  if (result.status === "success" && result.items.length > 0) {
    return <GameCarousel title={title} games={result.items} />;
  }

  const message =
    result.status === "loading"
      ? "게임을 불러오는 중입니다."
      : result.status === "error"
        ? "게임을 불러오지 못했습니다. 새로고침해 주세요."
        : "표시할 게임이 없습니다.";

  return (
    <section className="game-section">
      <h2>{title}</h2>
      <p role={result.status === "error" ? "alert" : "status"}>
        {message}
      </p>
    </section>
  );
}

function Home() {
  const [newResult, setNewResult] = useState({
    status: "loading",
    items: [],
  });
  const [popularResult, setPopularResult] = useState({
    status: "loading",
    items: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    getNewGames({ pageSize: 10, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setNewResult({ status: "success", items: data.items });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setNewResult({ status: "error", items: [] });
        }
      });

    getHotGames({ pageSize: 10, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setPopularResult({ status: "success", items: data.items });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPopularResult({ status: "error", items: [] });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="content">
          <HomeGameSection title="신규 게임들" result={newResult} />
          <HomeGameSection title="역대 인기 게임들" result={popularResult} />
        </main>
      </div>
    </div>
  );
}

export default Home;