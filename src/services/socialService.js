export async function getMySteamProfile({ signal, accessToken } = {}) {
  const response = await fetch("/api/social/me", {
    method: "GET",
    credentials: "omit",
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
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

export async function getMySteamFriends({ signal, accessToken } = {}) {
  const response = await fetch("/api/social/friends", {
    method: "GET",
    credentials: "omit",
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    const messages = {
      401: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
      403: "Steam 정보에 접근할 수 없습니다. 친구 목록 공개 설정과 API 키 상태를 확인해 주세요.",
      422: "유효한 Steam API 키를 등록해 주세요.",
      429: "Steam 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.",
      503: "Steam에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };

    const error = new Error(
      messages[response.status] || "친구 목록을 불러오지 못했습니다."
    );

    error.status = response.status;
    error.retryAfter = response.headers.get("Retry-After");

    throw error;
  }

  const data = await response.json();

  if (!Array.isArray(data.friends)) {
    throw new Error("친구 목록 응답 형식이 올바르지 않습니다.");
  }

  return data;
}