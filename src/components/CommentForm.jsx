import { useState } from "react";

function CommentForm({ onCommentSubmit }) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;

    onCommentSubmit(comment);

    setComment("");
  };

  return (
    <div className="comment-form">
      <textarea
        placeholder="댓글을 작성할 수 있습니다."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        className="comment-submit-button"
        onClick={handleSubmit}
      >
        등록
      </button>
    </div>
  );
}

export default CommentForm;