import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

import { mockBoardPosts } from "../mocks/boardMockData";
import { mockBoardDetails } from "../mocks/boardDetailMockData";

import "../styles/BoardDetail.css";

function BoardDetail() {
  const { id } = useParams();

  const post = mockBoardPosts.find(
    (post) => post.id === Number(id)
  );

  const detail = mockBoardDetails.find(
    (detail) => detail.id === Number(id)
  );

  const [comments, setComments] = useState(
    detail?.comments || []
  );

  const handleLikeClick = () => {
    // 향후 Backend 추천 API 요청 처리 구역
    console.log("게시글 추천:", id);
  };

  const handleCommentSubmit = (content) => {
    // 향후 Backend 댓글 등록 API 요청 처리 구역
    console.log("댓글 등록:", content);

    const newComment = {
      id: comments.length + 1,
      nickname: "User",
      content: content,
      date: "방금 전",
    };

    setComments((prev) => [
      ...prev,
      newComment,
    ]);
  };

  if (!post || !detail) {
    return (
      <div className="board-detail-page">
        <Sidebar />

        <div className="board-detail-main-area">
          <Header />

          <main className="board-detail-content">
            <div className="post-not-found">
              게시글을 찾을 수 없습니다.
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="board-detail-page">
      <Sidebar />

      <div className="board-detail-main-area">
        <Header />

        <main className="board-detail-content">
          <section className="post-detail">
            <div className="post-detail-header">
              <h1>
                [{post.category}] {post.title}
              </h1>

              <div className="post-info">
                <span>
                  작성자: {post.nickname}
                </span>

                <span>
                  {detail.fullDate}
                </span>
              </div>
            </div>

            <div className="post-detail-body">
              <p>
                {detail.content}
              </p>

              <button
                className="like-button"
                onClick={handleLikeClick}
              >
                ⭐
              </button>
            </div>

            <div className="post-detail-bottom">
              <span>
                댓글 {comments.length}개
              </span>

              <span>
                추천 {post.likes}
              </span>
            </div>
          </section>

          <section className="comment-section">
            <div className="comment-section-title">
              댓글 {comments.length}개
            </div>

            <CommentList
              comments={comments}
            />

            <CommentForm
              onCommentSubmit={handleCommentSubmit}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default BoardDetail;