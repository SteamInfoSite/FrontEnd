import { mockBoardPosts } from "./boardMockData";

// 백엔드 연결 전까지 페이지 방문으로 증가하는 화면용 조회수입니다.
// 백엔드 연결 시 조회수 증가 API와 게시글 조회 API로 교체합니다.
const viewsByPost = new Map(
  mockBoardPosts.map((post) => [String(post.id), post.views])
);

export function getViewCount(postId, initialViews = 0) {
  const key = String(postId);
  if (!viewsByPost.has(key)) viewsByPost.set(key, initialViews);
  return viewsByPost.get(key);
}

export function recordView(postId, initialViews = 0) {
  const key = String(postId);
  const nextViews = getViewCount(postId, initialViews) + 1;
  viewsByPost.set(key, nextViews);
  return nextViews;
}
