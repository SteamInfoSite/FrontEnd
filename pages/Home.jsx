import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import GameCarousel from "../components/GameCarousel";
import { mockNewGames, mockPopularGames } from "../mocks/gameMockData";

import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="content">
          <GameCarousel
            title="신규 게임들"
            games={mockNewGames}
          />

          <GameCarousel
            title="역대 인기 게임들"
            games={mockPopularGames}
          />
        </main>
      </div>
    </div>
  );
}

export default Home;