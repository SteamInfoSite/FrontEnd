function BoardTable({ posts = [], onPostClick }) {
  return (
    <div className="board-table">
      <div className="board-table-header">
        <div className="board-title-column">
          게시글 제목
        </div>

        <div className="board-nickname-column">
          닉네임
        </div>

        <div className="board-views-column">
          조회수
        </div>

        <div className="board-date-column">
          날짜
        </div>

        <div className="board-likes-column">
          추천
        </div>
      </div>

      <div className="board-table-body">
        {posts.map((post) => (
          <button
            key={post.id}
            className="board-row"
            onClick={() => onPostClick(post)}
          >
            <div className="board-title-column board-post-title">
              {post.pinned && (
                <span className="board-pin">
                  📌
                </span>
              )}

              <span className="board-post-title-text">
                [{post.category}] {post.title}
              </span>
            </div>

            <div className="board-nickname-column">
              {post.nickname}
            </div>

            <div className="board-views-column">
              {post.views}
            </div>

            <div className="board-date-column">
              {post.date}
            </div>

            <div className="board-likes-column">
              {post.likes}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardTable;