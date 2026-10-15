import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import Pagination from "../components/Pagination";

import {
  getPost,
  getComments,
  createComment,
  deletePost,
  likePost,
} from "../services/boardService";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { cleanBoardContent } from "../mocks/boardContent";

import "../styles/BoardDetail.css";

const COMMENT_PAGE_SIZE = 20;

const CATEGORY_LABELS = {
  NOTICE: "공지",
  CHAT: "잡담",
  NEWS: "소식",
};

function formatDate(value) {
  return value ? value.replace("T", " ").slice(0, 16) : "";
}

function BoardDetail() {
  const { t, formatNumber } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, status: authStatus } = useAuth();
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [liking, setLiking] = useState(false);
  const [likeMessage, setLikeMessage] = useState("");

  const [commentPage, setCommentPage] = useState(1);
  const [commentData, setCommentData] = useState({
    items: [],
    totalElements: 0,
    totalPages: 0,
  });
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);

  const postErrorMessage = postError?.status === 404
    ? "게시글을 찾을 수 없습니다."
    : postError?.status === 503
      ? "게시글을 일시적으로 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
      : postError?.message;

  const commentErrorMessage = commentError?.status === 404
    ? "댓글을 불러올 게시글을 찾을 수 없습니다."
    : commentError?.status === 503
      ? "댓글을 일시적으로 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
      : commentError?.message;

  const likesAvailable = Number.isInteger(post?.likeCount)
    && typeof post?.likedByMe === "boolean";

  useEffect(() => {
    let active = true;
    setPost(null);
    setPostLoading(true);
    setPostError(null);
    setDeleteError("");
    setLikeMessage("");
    setCommentPage(1);
    setCommentData({ items: [], totalElements: 0, totalPages: 0 });
    setCommentError(null);
    setCommentLoading(true);

    if (!Number.isSafeInteger(Number(id)) || Number(id) < 1) {
      setPostError(new Error("게시글 번호가 올바르지 않습니다."));
      setPostLoading(false);
      return () => {
        active = false;
      };
    }

    getPost(id)
      .then((data) => {
        if (active) setPost(data);
      })
      .catch((requestError) => {
        if (active) setPostError(requestError);
      })
      .finally(() => {
        if (active) setPostLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!post || String(post.id) !== id) return;

    let active = true;
    setCommentLoading(true);
    setCommentError(null);

    getComments(id, commentPage, COMMENT_PAGE_SIZE)
      .then((data) => {
        if (!active) return;
        setCommentData(data);
        setCommentError(null);
      })
      .catch((requestError) => {
        if (active) setCommentError(requestError);
      })
      .finally(() => {
        if (active) setCommentLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, post, commentPage]);

  async function handleCommentSubmit(content) {
    await createComment(id, content);

    // 댓글은 오래된 순서부터 나오므로 새 댓글이 있는 마지막 페이지로 이동합니다.
    const firstPage = await getComments(id, 1, COMMENT_PAGE_SIZE);
    const lastPage = Math.max(1, firstPage.totalPages);
    const latestPage = lastPage === 1
      ? firstPage
      : await getComments(id, lastPage, COMMENT_PAGE_SIZE);

    setCommentData(latestPage);
    setCommentPage(lastPage);
    setCommentError(null);
  }

  async function handleDelete() {
    if (deleting || authStatus !== "ready" || !loggedIn) return;
    if (!window.confirm(t("게시글을 삭제할까요? 삭제한 글은 복구할 수 없습니다."))) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deletePost(id);
      navigate("/board", { replace: true });
    } catch (error) {
      setDeleteError(
        error.status === 403
          ? "작성자만 게시글을 삭제할 수 있습니다."
          : error.status === 401
            ? "로그인이 필요합니다. 로그인 상태를 다시 확인해 주세요."
            : error.status === 404
              ? "이미 삭제되었거나 존재하지 않는 게시글입니다."
              : error.message
      );
      setDeleting(false);
    }
  }

  async function handleLike() {
    if (!post || !likesAvailable || liking || post.likedByMe) return;
    if (authStatus !== "ready") {
      setLikeMessage("로그인 상태를 확인한 뒤 다시 시도해 주세요.");
      return;
    }
    if (!loggedIn) {
      setLikeMessage("로그인 후 추천할 수 있습니다.");
      return;
    }

    setLiking(true);
    setLikeMessage("");

    try {
      const result = await likePost(id);
      setPost((current) => current && String(current.id) === id
        ? { ...current, likeCount: result.likeCount, likedByMe: result.likedByMe }
        : current);
      setLikeMessage("추천했습니다.");
    } catch (error) {
      if (error.status === 409) {
        setPost((current) => current && String(current.id) === id
          ? { ...current, likedByMe: true }
          : current);
        setLikeMessage("이미 추천한 게시글입니다.");
      } else {
        setLikeMessage(error.message);
      }
    } finally {
      setLiking(false);
    }
  }

  if (postLoading || postError || !post) {
    return (
      <div className="board-detail-page">
        <Sidebar />

        <div className="board-detail-main-area">
          <Header />

          <main className="board-detail-content">
            <div className="post-not-found">
              {t(postLoading
                ? "게시글을 불러오는 중입니다."
                : postErrorMessage || "게시글을 찾을 수 없습니다.")}
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
                [{t(CATEGORY_LABELS[post.category] ?? post.category)}]{" "}
                {post.title}
              </h1>

              <div className="post-info">
                <span>{t("작성자: {{name}}", { name: post.authorName })}</span>
                <span>{formatDate(post.createdAt)}</span>
                {authStatus === "ready" && loggedIn && post.isMine && (
                  <button
                    type="button"
                    className="post-delete-button"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {t(deleting ? "삭제 중..." : "삭제")}
                  </button>
                )}
              </div>
              {deleteError && (
                <p className="post-delete-error" role="alert">{t(deleteError)}</p>
              )}
            </div>

            <div className="post-detail-body">
              <div
                className="post-rich-content"
                dangerouslySetInnerHTML={{
                  __html: cleanBoardContent(post.contentHtml),
                }}
              />

              <div className="like-area">
                <button
                  type="button"
                  className="like-button"
                  onClick={handleLike}
                  disabled={!likesAvailable || liking || post.likedByMe}
                  aria-pressed={likesAvailable && post.likedByMe}
                  aria-label={t(!likesAvailable
                    ? "추천 기능 준비 중"
                    : post.likedByMe ? "이미 추천한 게시글" : "게시글 추천")}
                >
                  <span aria-hidden="true">⭐</span>
                </button>
                <span className="like-label">
                  {t(!likesAvailable
                    ? "추천 준비 중"
                    : post.likedByMe ? "추천 완료" : "추천하기")}
                </span>
                <span className="like-message" role="status">
                  {t(likesAvailable
                    ? likeMessage
                    : "서버에 추천 기능이 반영되면 사용할 수 있습니다.")}
                </span>
              </div>

            </div>

            <div className="post-detail-bottom">
              <span>{commentLoading ? t("댓글 확인 중") : t("댓글 {{count}}개", { count: formatNumber(commentData.totalElements) })}</span>
              <span>{t("추천 {{count}}", { count: likesAvailable ? formatNumber(post.likeCount) : "-" })}</span>
              <span>{t("조회 {{count}}", { count: formatNumber(post.viewCount) })}</span>
            </div>
          </section>

          <section className="comment-section">
            <div className="comment-section-title">
              {commentLoading ? t("댓글 확인 중") : t("댓글 {{count}}개", { count: formatNumber(commentData.totalElements) })}
            </div>

            {commentLoading && (
              <p className="comment-state" role="status">{t("댓글을 불러오는 중입니다.")}</p>
            )}
            {commentError && (
              <p className="comment-state" role="alert">{t(commentErrorMessage)}</p>
            )}

            {!commentLoading && !commentError && (
              <>
                <CommentList comments={commentData.items} />
                <Pagination
                  currentPage={commentPage}
                  totalPages={commentData.totalPages}
                  onPageChange={setCommentPage}
                />
              </>
            )}

            <CommentForm onCommentSubmit={handleCommentSubmit} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default BoardDetail;
