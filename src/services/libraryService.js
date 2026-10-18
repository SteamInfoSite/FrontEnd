export async function getMyLibrary({ signal, accessToken } = {}) {
  const response = await fetch("/api/library/me", {
    method: "GET",
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    //오류 응답이 HTML인 경우에도 처리
    const body = await response.json().catch(() => null);

    const messages = {
      401: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
      403: "Steam 정보에 접근할 수 없습니다. 공개 설정과 API 키 상태를 확인해 주세요.",
      422: "유효한 Steam API 키를 등록해 주세요.",
      429: "Steam 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.",
      503: "Steam에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };

    const message =
      body?.code === "STEAM_LIBRARY_UNAVAILABLE"
        ? "보유 게임 정보를 받지 못했습니다. Steam의 게임 세부 정보 공개 설정을 확인해 주세요."
        : messages[response.status] ||
          "보유 게임 목록을 불러오지 못했습니다.";

    const error = new Error(message);
    error.status = response.status;
    error.retryAfter = response.headers.get("Retry-After");

    throw error;
  }

  const data = await response.json();

  if (
    !data ||
    !Array.isArray(data.games) ||
    !Array.isArray(data.unclassifiedGames)
  ) {
    throw new Error("보유 게임 목록 응답 형식이 올바르지 않습니다.");
  }

  return data;
}