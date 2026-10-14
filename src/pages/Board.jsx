import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BoardTable from "../components/BoardTable";
import Pagination from "../components/Pagination";
import { getPosts } from "../services/boardService";

import "../styles/Board.css";

function Board() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState({
    items: [],
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const errorMessage = error?.status === 404
    ? "게시판 API를 찾을 수 없습니다. 서버에 게시판 기능이 반영됐는지 확인해 주세요."
    : error?.status === 503
      ? "게시판을 일시적으로 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
      : error?.message;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getPosts(currentPage)
      .then((data) => {
        if (!active) return;
        setPageData(data);
        setError(null);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage]);

  return (
    <div className="board-page">
      <Sidebar />

      <div className="board-main-area">
        <Header />

        <main className="board-content">
          <div className="board-top">
            <h1>Community Board</h1>

            <button
              type="button"
              className="board-write-button"
              onClick={() => navigate("/board/write")}
            >
              글 쓰기
            </button>
          </div>

          {loading && <p className="board-state" role="status">게시글을 불러오는 중입니다.</p>}
          {error && <p className="board-state" role="alert">{errorMessage}</p>}

          {!loading && !error && (
            <>
              <BoardTable
                posts={pageData.items}
                onPostClick={(post) => navigate(`/board/${post.id}`)}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={pageData.totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Board;
