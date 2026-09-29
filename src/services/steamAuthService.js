export function startSteamLogin() {
  //백엔드가 반환한 이동응답을 브라우저가 따라가 스팀 인증 화면을 보여줌
  window.location.assign("/api/auth/steam/login");
}
export async function getLoginStatus({ signal } = {}) {
  const response = await fetch("/api/auth/steam/status", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
  });
  if (!response.ok) {
    throw new Error("로그인 상태를 확인하지 못했습니다.");
  }

  return response.json();
}

export async function logoutSteam() {
  const response = await fetch("/api/auth/steam/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다. 다시 시도해 주세요.");
  }
}