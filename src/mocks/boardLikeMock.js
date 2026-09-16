// 화면 동작 확인용 추천 기록입니다. 새로고침하면 초기화됩니다.
// 실제 사용자별 하루 1회 제한과 추천수는 백엔드에서 관리합니다.
const likeDatesByPost = new Map();

export function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getLikeDates(postId) {
  return [...(likeDatesByPost.get(String(postId)) || [])];
}

export function addDailyLike(postId) {
  // 백엔드 연결 시 서버에서 사용자별 하루 1회 추천 여부를 검증합니다.
  const dates = getLikeDates(postId);
  const today = getToday();
  if (dates.includes(today)) return false;
  likeDatesByPost.set(String(postId), [...dates, today]);
  return true;
}
