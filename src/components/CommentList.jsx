import { useLanguage } from "../contexts/LanguageContext";

function formatDate(value) {
  return value ? value.replace("T", " ").slice(0, 16) : "";
}

function CommentList({ comments = [] }) {
  const { t } = useLanguage();
  return (
    <div className="comment-list">
      {comments.length === 0 && (
        <p className="comment-empty">{t("아직 댓글이 없습니다.")}</p>
      )}
      {comments.map((comment) => (
        <div
          id={`comment_item_${comment.id}`}
          key={comment.id}
          className="comment-item"
        >
          <div className="comment-nickname">
            {comment.authorName}
          </div>

          <div className="comment-content">
            {comment.content}
          </div>

          <div className="comment-date">
            {formatDate(comment.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
