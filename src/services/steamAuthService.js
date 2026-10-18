export function startSteamLogin() {
  window.location.assign("/api/auth/steam/login");
}

async function withSteamAuthLock(task) {
  if (navigator.locks?.request) {
    return navigator.locks.request("steam-auth-cookie", task);
  }

  return task();
}

export async function logoutSteam() {
  return withSteamAuthLock(async () => {
    const csrfResponse = await fetch("/api/auth/steam/csrf", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!csrfResponse.ok) {
      throw new Error("로그아웃을 준비하지 못했습니다. 다시 시도해 주세요.");
    }

    const { token, headerName } = await csrfResponse.json();

    const response = await fetch("/api/auth/steam/logout", {
      method: "POST",
      credentials: "include",
      headers: { [headerName]: token },
    });

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    }
  });
}

let refreshPromise = null;

async function requestSteamAccessToken() {
  const csrfResponse = await fetch("/api/auth/steam/csrf", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!csrfResponse.ok) {
    throw new Error("로그인 확인을 준비하지 못했습니다.");
  }

  const { token, headerName } = await csrfResponse.json();

  const response = await fetch("/api/auth/steam/refresh", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { [headerName]: token },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("로그인 상태를 확인하지 못했습니다.");
  }

  const result = await response.json();

  if (
    result.tokenType !== "Bearer" ||
    !result.accessToken ||
    !result.steamId
  ) {
    throw new Error("토큰 응답 형식이 올바르지 않습니다.");
  }

  return result;
}

export function refreshSteamAccessToken() {
  if (!refreshPromise) {
    refreshPromise = withSteamAuthLock(requestSteamAccessToken).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}