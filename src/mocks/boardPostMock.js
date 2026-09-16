// 화면 동작 확인용 데이터입니다. 새로고침하면 초기화됩니다.
// 백엔드 연결 시 아래 조회·등록 함수를 API 요청으로 교체합니다.
const createdPosts = [];

export function getCreatedPosts() {
  return [...createdPosts];
}

export function createPost({ category, nickname, title, content, contentHtml = "" }) {
  // 백엔드 연결 시 이 Mock 함수는 게시글 등록 API 호출로 교체합니다.
  const hasImage = /<img\s[^>]*src="data:image\/(png|jpeg|webp);base64,/.test(contentHtml);
  if (!["잡담", "소식"].includes(category) || !title.trim() || (!content.trim() && !hasImage)) {
    throw new Error("말머리, 제목과 내용을 확인해 주세요.");
  }

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const post = {
    id: Math.max(Date.now(), ...createdPosts.map((item) => item.id + 1)),
    category,
    title: title.trim(),
    content: content.trim(),
    contentHtml,
    nickname: nickname.trim() || "User",
    date: `${month}/${day}`,
    fullDate: now.toLocaleString("ko-KR"),
    views: 0,
    likes: 0,
    comments: [],
  };

  createdPosts.unshift(post);
  return post;
}
