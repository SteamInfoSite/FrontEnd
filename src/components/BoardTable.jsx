const CATEGORY_LABELS = {
  NOTICE: "공지",
  CHAT: "잡담",
  NEWS: "소식",
};

function formatDate(value) {
  return value ? value.replace("T", " ").slice(0, 16) : "";
}

function BoardTable({ posts = [], onPostClick }) {
  return (
    <div className="board-table">
      <div className="board-table-header">
        <div className="board-title-column">게시글 제목</div>
        <div className="board-nickname-column">닉네임</div>
        <div className="board-views-column">조회수</div>
        <div className="board-date-column">날짜</div>
        <div className="board-likes-column">추천</div>
      </div>

      <div className="board-table-body">
        {posts.length === 0 && <p className="board-empty">아직 게시글이 없습니다.</p>}

        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            id={`board_post_${post.id}`}
            className="board-row"
            onClick={() => onPostClick(post)}
          >
            <div className="board-title-column board-post-title">
              <span className="board-post-title-text">
                [{CATEGORY_LABELS[post.category] ?? post.category}]{" "}
                {post.title} [{post.commentCount}]
              </span>
            </div>

            <div className="board-nickname-column">
              {post.authorName}
            </div>

            <div className="board-views-column">
              {post.viewCount}
            </div>

            <div className="board-date-column">
              {formatDate(post.createdAt)}
            </div>

            <div className="board-likes-column">
              {Number.isInteger(post.likeCount) ? post.likeCount : "-"}
            </div>

          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardTable;
