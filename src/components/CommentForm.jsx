import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getMyDisplayName } from "../services/boardService";

function CommentForm({ onCommentSubmit }) {
  const { loggedIn, status } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loggedIn) {
      setDisplayName("");
      return;
    }

    let active = true;

    getMyDisplayName()
      .then((data) => {
        if (active) setDisplayName(data.displayName);
      })
      .catch(() => {
        if (active) setDisplayName("Steam 사용자");
      });

    return () => {
      active = false;
    };
  }, [loggedIn]);

  async function handleSubmit() {
    if (!comment.trim() || submitting || !loggedIn) return;

    setSubmitting(true);
    setError("");

    try {
      await onCommentSubmit(comment.trim());
      setComment("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="comment-form">
      <input
        id="comment_nickname_input"
        className="comment-nickname-input"
        aria-label="작성자 Steam 이름"
        value={loggedIn ? displayName : ""}
        placeholder={loggedIn ? "이름 확인 중" : "로그인이 필요합니다"}
        readOnly
      />

      <textarea
        id="comment_content_input"
        placeholder={
          loggedIn
            ? "댓글을 작성할 수 있습니다."
            : "로그인 후 댓글을 작성할 수 있습니다."
        }
        maxLength={2000}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        disabled={!loggedIn || submitting}
      />

      <button
        id="comment_submit_button"
        type="button"
        className="comment-submit-button"
        onClick={handleSubmit}
        disabled={status !== "ready" || !loggedIn || submitting}
      >
        {submitting ? "등록 중" : "등록"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default CommentForm;