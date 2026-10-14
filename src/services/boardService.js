async function request(path, { json, ...options } = {}) {
  const response = await fetch(`/api/community${path}`, {
    ...options,
    credentials: "include",
    headers: json === undefined
      ? options.headers
      : { "Content-Type": "application/json", ...options.headers },
    body: json === undefined ? undefined : JSON.stringify(json),
  });

  if (!response.ok) {
    const message = {
      400: "입력 내용을 확인해 주세요.",
      401: "로그인이 필요합니다.",
      403: "변경할 권한이 없습니다.",
      404: "대상을 찾을 수 없습니다.",
      503: "서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    }[response.status] || "요청을 처리하지 못했습니다.";

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response;
}

export async function getPosts(page = 1, size = 20) {
  const response = await request(`/posts?page=${page}&size=${size}`);
  return response.json();
}

// 개발 모드 StrictMode에서 같은 상세 요청이 겹치면 한 번만 보냅니다.
const pendingDetails = new Map();

export function getPost(postId) {
  const key = String(postId);
  if (!pendingDetails.has(key)) {
    const pending = request(`/posts/${encodeURIComponent(key)}`)
      .then((response) => response.json())
      .finally(() => pendingDetails.delete(key));

    pendingDetails.set(key, pending);
  }
  return pendingDetails.get(key);
}

export async function createPost({ category, title, contentHtml }) {
  const response = await request("/posts", {
    method: "POST",
    json: { category, title, contentHtml },
  });

  // 백엔드는 게시글 JSON 대신 Location 헤더를 반환합니다.
  const location = response.headers.get("Location");
  const postId = location?.match(/\/posts\/(\d+)$/)?.[1];
  if (!postId) throw new Error("새 게시글 번호를 확인하지 못했습니다.");
  return postId;
}

export async function deletePost(postId) {
  await request(`/posts/${encodeURIComponent(postId)}`, {
    method: "DELETE",
  });
}

export async function likePost(postId) {
  const response = await request(`/posts/${encodeURIComponent(postId)}/likes`, {
    method: "POST",
  });
  return response.json();
}

export async function getComments(postId, page = 1, size = 20) {
  const response = await request(
    `/posts/${postId}/comments?page=${page}&size=${size}`
  );
  return response.json();
}

export async function createComment(postId, content) {
  await request(`/posts/${postId}/comments`, {
    method: "POST",
    json: { content },
  });
}

export async function getMyDisplayName() {
  const response = await request("/me/display-name");
  return response.json();
}
