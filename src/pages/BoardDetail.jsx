import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

import { mockBoardPosts } from "../mocks/boardMockData";
import { mockBoardDetails } from "../mocks/boardDetailMockData";

import { getLikeDates, addDailyLike } from "../mocks/boardLikeMock";
import { getCreatedPosts } from "../mocks/boardPostMock";
import { cleanBoardContent } from "../mocks/boardContent";
import { addComment, getComments } from "../mocks/boardCommentMock";
import { getViewCount, recordView } from "../mocks/boardViewMock";

import "../styles/BoardDetail.css";

function BoardDetail() {
  const { id } = useParams();
  const createdPost = getCreatedPosts().find((post) => post.id === Number(id));

  const post = createdPost || mockBoardPosts.find(
    (post) => post.id === Number(id)
  );

  const detail = createdPost || mockBoardDetails.find(
    (detail) => detail.id === Number(id)
  );

  const [comments, setComments] = useState(() =>
    getComments(id, detail?.comments || [])
  );
  const [viewCount, setViewCount] = useState(() =>
    getViewCount(id, post?.views || 0)
  );
  const viewedIdRef = useRef(null);

  useEffect(() => {
    // 한 번의 상세 페이지 방문에서는 조회수가 한 번만 증가합니다.
    if (viewedIdRef.current === id || !post) return;
    viewedIdRef.current = id;
    setViewCount(recordView(id, post.views || 0));
  }, [id, post]);

  const [likeMessage, setLikeMessage] = useState({ postId: null, text: "" });
  const likeCount = (post?.likes || 0) + getLikeDates(id).length;

  const handleLikeClick = () => {
    // 백엔드 연결 후 추천 API에서 사용자별 하루 1회 제한을 처리합니다.
    try {
      const added = addDailyLike(id);
      setLikeMessage({
        postId: id,
        text: added ? "추천했습니다." : "이 게시글은 오늘 이미 추천했습니다.",
      });
    } catch {
      // API 연동 시 서버 오류 메시지 처리로 변경합니다.
      setLikeMessage({
        postId: id,
        text: "추천에 실패했습니다. 다시 시도해 주세요.",
      });
    }
  };

  const handleCommentSubmit = ({ nickname, content }) => {
    // 백엔드 연결 후 댓글 등록 API 호출로 교체합니다.
    console.log("댓글 등록:", content);
    setComments(addComment(id, { nickname, content }));
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
              {detail.contentHtml ? (
                <div className="post-rich-content" dangerouslySetInnerHTML={{ __html: cleanBoardContent(detail.contentHtml) }} />
              ) : <p>
                {detail.content}
              </p>}

              <div className="like-area">
                <button
                  type="button"
                  className="like-button"
                  onClick={handleLikeClick}
                  aria-label="게시글 추천, 하루 한 번 가능"
                >
                  <span aria-hidden="true">⭐</span>
                </button>
                <span className="like-label">추천</span>
                <span className="like-message" role="status">
                  {likeMessage.postId === id ? likeMessage.text : ""}
                </span>
              </div>
            </div>

            <div className="post-detail-bottom">
              <span>
                댓글 {comments.length}개
              </span>

              <span>
                추천 {likeCount}
              </span>
              <span>
                조회 {viewCount}
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
