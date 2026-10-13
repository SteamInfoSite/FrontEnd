export async function getMySteamProfile({ signal } = {}) {
  const response = await fetch("/api/social/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    const messages = {
      401: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
      422: "유효한 Steam API 키를 등록해 주세요.",
      429: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
      503: "Steam에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };

    throw new Error(
      messages[response.status] || "내 프로필을 불러오지 못했습니다."
    );
  }

  return response.json();
}