export function startSteamLogin() {
  //백엔드가 반환한 이동응답을 브라우저가 따라가 스팀 인증 화면을 보여줌
  window.location.assign("/api/auth/steam/login");
}