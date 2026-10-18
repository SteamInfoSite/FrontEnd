const API_KEY_URL = "/api/users/me/steam-api-key";

function createApiKeyError(status, fallbackMessage) {
  const messages = {
    400: "Steam API 키 형식을 확인해 주세요.",
    401: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
    422: "유효하지 않은 Steam API 키입니다. 다시 확인해 주세요.",
    429: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
    503: "Steam에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  };

  const error = new Error(messages[status] || fallbackMessage);
  error.status = status;

  return error;
}

//현재 로그인한 사용자의 API 키 등록 상태 조회
export async function getSteamApiKeyStatus({ signal, accessToken } = {}) {
  const response = await fetch(API_KEY_URL, {
    method: "GET",
    credentials: "omit",
    cache: "no-store",
    signal,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  });

  if (!response.ok) {
    throw createApiKeyError(
      response.status,
      "API 키 등록 상태를 확인하지 못했습니다."
    );
  }

  return response.json();
}

//입력한 API 키를 백엔드에서 검증하고 암호화하여 저장
export async function registerSteamApiKey(
  steamApiKey,
  { signal, accessToken } = {}
) {
  const trimmedKey =
    typeof steamApiKey === "string" ? steamApiKey.trim() : "";

  if (!/^[0-9A-Fa-f]{32}$/.test(trimmedKey)) {
    throw new Error(
      "Steam API 키는 32자리 영문 A~F와 숫자 조합이어야 합니다."
    );
  }

  const response = await fetch(API_KEY_URL, {
    method: "PUT",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      steamApiKey: trimmedKey,
    }),
    signal,
  });

  if (!response.ok) {
    throw createApiKeyError(
      response.status,
      "API 키를 등록하지 못했습니다."
    );
  }

  return response.json();
}