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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/games/hot" element={<HotGames />} />
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
