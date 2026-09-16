import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardWrite from "./pages/BoardWrite";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board/write" element={<BoardWrite />} />
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
