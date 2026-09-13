function CommentList({ comments = [] }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="comment-item"
        >
          <div className="comment-nickname">
            {comment.nickname}
          </div>

          <div className="comment-content">
            {comment.content}
          </div>

          <div className="comment-date">
            {comment.date}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;