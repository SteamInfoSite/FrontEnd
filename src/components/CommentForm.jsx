import { useState } from "react";

function CommentForm({ onCommentSubmit }) {
  const [nickname, setNickname] = useState("User");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;

    onCommentSubmit({ nickname: nickname.trim() || "User", content: comment.trim() });

    setComment("");
  };

  return (
    <div className="comment-form">
      <input
        className="comment-nickname-input"
        placeholder="닉네임"
        maxLength={20}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
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
