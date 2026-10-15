import { useLanguage } from "../contexts/LanguageContext";

const CATEGORY_LABELS = {
  NOTICE: "공지",
  CHAT: "잡담",
  NEWS: "소식",
};

function formatDate(value) {
  return value ? value.replace("T", " ").slice(0, 16) : "";
}

function BoardTable({ posts = [], onPostClick }) {
  const { t, formatNumber } = useLanguage();
  return (
    <div className="board-table">
      <div className="board-table-header">
        <div className="board-title-column">{t("게시글 제목")}</div>
        <div className="board-nickname-column">{t("닉네임")}</div>
        <div className="board-views-column">{t("조회수")}</div>
        <div className="board-date-column">{t("날짜")}</div>
        <div className="board-likes-column">{t("추천")}</div>
      </div>

      <div className="board-table-body">
        {posts.length === 0 && <p className="board-empty">{t("아직 게시글이 없습니다.")}</p>}

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
                [{t(CATEGORY_LABELS[post.category] ?? post.category)}]{" "}
                {post.title} [{formatNumber(post.commentCount)}]
              </span>
            </div>

            <div className="board-nickname-column">
              {post.authorName}
            </div>

            <div className="board-views-column">
              {formatNumber(post.viewCount)}
            </div>

            <div className="board-date-column">
              {formatDate(post.createdAt)}
            </div>

            <div className="board-likes-column">
              {Number.isInteger(post.likeCount) ? formatNumber(post.likeCount) : "-"}
            </div>

          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardTable;
