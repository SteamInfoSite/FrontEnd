import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";
import GameDetail from "./pages/GameDetail";
import HotGames from "./pages/HotGames";
import NewGames from "./pages/NewGames";
import UpcomingGames from "./pages/UpcomingGames";
import GenreGames from "./pages/GenreGames";
import PriceGames from "./pages/PriceGames";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/games/hot" element={<HotGames />} />
        <Route path="/games/new" element={<NewGames />} />
        <Route path="/games/upcoming" element={<UpcomingGames />} />
        <Route path="/games/paid" element={<PriceGames mode="paid" />} />
        <Route path="/games/free" element={<PriceGames mode="free" />} />
        <Route path="/games/discount" element={<PriceGames mode="discount" />} />
        <Route path="/games/genre" element={<GenreGames />} />
        <Route path="/games/:appId" element={<GameDetail />} />
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/board"
          element={<Board />}
        />

        <Route
          path="/board/:id"
          element={<BoardDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
