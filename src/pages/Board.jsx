import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BoardTable from "../components/BoardTable";
import Pagination from "../components/Pagination";

import { mockBoardPosts } from "../mocks/boardMockData";

import { getLikeDates } from "../mocks/boardLikeMock";
import { getCreatedPosts } from "../mocks/boardPostMock";
import { getViewCount } from "../mocks/boardViewMock";

import "../styles/Board.css";

function Board() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 1;
  const posts = [
    ...mockBoardPosts.filter((post) => post.pinned),
    ...getCreatedPosts(),
    ...mockBoardPosts.filter((post) => !post.pinned),
  ];

  const handlePostClick = (post) => {
    // 선택한 게시글의 상세 페이지로 이동
    navigate(`/board/${post.id}`);
  };

  const handleWriteClick = () => {
    navigate("/board/write");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // 향후 Backend 페이지 요청 처리 구역
    console.log("페이지 이동:", page);
  };

  return (
    <div className="board-page">
      <Sidebar />

      <div className="board-main-area">
        <Header />

        <main className="board-content">
          <div className="board-top">
            <h1>
              Community Board
            </h1>

            <button
              className="board-write-button"
              onClick={handleWriteClick}
            >
              글 쓰기
            </button>
          </div>

          <BoardTable
            posts={posts.map((post) => ({
              ...post,
              views: getViewCount(post.id, post.views),
              likes: post.likes + getLikeDates(post.id).length,
            }))}
            onPostClick={handlePostClick}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}

export default Board;
