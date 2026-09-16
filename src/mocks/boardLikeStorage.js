// 백엔드 연결 전까지 브라우저에 게시글별 추천 날짜를 저장합니다.
const storageKey = "steamInfoSite.boardLikes.";

export function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getLikeDates(postId) {
  try {
    const dates = JSON.parse(localStorage.getItem(storageKey + postId) || "[]");
    return Array.isArray(dates)
      ? [...new Set(dates.filter((date) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)))]
      : [];
  } catch {
    return [];
  }
}

export function addDailyLike(postId) {
  const dates = getLikeDates(postId);
  const today = getToday();
  if (dates.includes(today)) return false;
  localStorage.setItem(storageKey + postId, JSON.stringify([...dates, today]));
  return true;
}
