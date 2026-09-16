import { mockBoardDetails } from "./boardDetailMockData";

// 백엔드 연결 전까지 페이지가 바뀌어도 유지되는 화면용 댓글 상태입니다.
// 백엔드 연결 시 조회·등록 함수를 댓글 API 호출로 교체합니다.
const commentsByPost = new Map(
  mockBoardDetails.map((detail) => [String(detail.id), [...detail.comments]])
);

export function getComments(postId, fallbackComments = []) {
  const key = String(postId);
  if (!commentsByPost.has(key)) commentsByPost.set(key, [...fallbackComments]);
  return [...commentsByPost.get(key)];
}

export function addComment(postId, { nickname, content }) {
  const key = String(postId);
  const comments = commentsByPost.get(key) || [];
  const newComment = {
    id: comments.length + 1,
    nickname: nickname.trim() || "User",
    content: content.trim(),
    date: "방금 전",
  };
  commentsByPost.set(key, [...comments, newComment]);
  return [...commentsByPost.get(key)];
}

export function getCommentCount(postId, fallbackComments = []) {
  return getComments(postId, fallbackComments).length;
}
