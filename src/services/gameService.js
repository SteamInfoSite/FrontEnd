import { mockHotGames } from "../mocks/hotGameMockData.js";
import { mockNewGames } from "../mocks/newGameMockData.js";
import { mockUpcomingGames } from "../mocks/upcomingGameMockData.js";

export const hotGameGenres = ["액션", "전략", "시뮬레이션", "어드벤처", "퍼즐", "스포츠"];
export const hotGamePlatforms = [
  { value: "windows", label: "Windows" },
  { value: "mac", label: "macOS" },
  { value: "linux", label: "Linux" },
];

// API 연결 시 이 함수 내부를 fetch 요청과 응답 변환으로 교체합니다.
// 반환 규약: { items: [{ id, title, image, genres, platforms, recommendationsTotal, rank }], totalCount }
// rank는 필터 결과 내 추천 수 내림차순 순위이며, 표시 순서/페이지와 무관하게 유지합니다.
// 실제 Steam appId 및 서버 필드명은 백엔드 명세에 맞춰 변환합니다.
export async function getHotGames({
  genre = "all",
  platform = "all",
  sort = "recommendations_desc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  signal?.throwIfAborted();

  const filteredGames = mockHotGames
    .filter((game) => genre === "all" || game.genres.includes(genre))
    .filter((game) => platform === "all" || game.platforms[platform])
    .sort((a, b) => b.recommendationsTotal - a.recommendationsTotal || a.id - b.id)
    .map((game, index) => ({
      ...game,
      genres: [...game.genres],
      platforms: { ...game.platforms },
      rank: index + 1,
    }));

  if (sort === "recommendations_asc") filteredGames.reverse();

  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const start = (currentPage - 1) * size;
  return {
    items: filteredGames.slice(start, start + size),
    totalCount: filteredGames.length,
  };
}

export async function getNewGames({
  genre = "all",
  platform = "all",
  sort = "released_desc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  signal?.throwIfAborted();

  const filteredGames = mockNewGames
    .filter((game) => genre === "all" || game.genres.includes(genre))
    .filter((game) => platform === "all" || game.platforms[platform])
    .sort((first, second) => {
      const dateOrder = second.releaseDate.localeCompare(first.releaseDate);
      return sort === "released_asc" ? -dateOrder : dateOrder;
    })
    .map((game, index) => ({
      ...game,
      genres: [...game.genres],
      platforms: { ...game.platforms },
      rank: index + 1,
    }));

  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const start = (currentPage - 1) * size;
  return {
    items: filteredGames.slice(start, start + size),
    totalCount: filteredGames.length,
  };
}

export async function getUpcomingGames({
  genre = "all",
  platform = "all",
  sort = "released_asc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  signal?.throwIfAborted();

  const filteredGames = mockUpcomingGames
    .filter((game) => genre === "all" || game.genres.includes(genre))
    .filter((game) => platform === "all" || game.platforms[platform])
    .sort((first, second) => {
      const dateOrder = first.releaseDate.localeCompare(second.releaseDate);
      return sort === "released_desc" ? -dateOrder : dateOrder;
    })
    .map((game, index) => ({
      ...game,
      genres: [...game.genres],
      platforms: { ...game.platforms },
      rank: index + 1,
    }));

  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const start = (currentPage - 1) * size;
  return {
    items: filteredGames.slice(start, start + size),
    totalCount: filteredGames.length,
  };
}

export async function getGamesByPrice({
  isFree,
  genre = "all",
  platform = "all",
  sort = "app_id_asc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  if (typeof isFree !== "boolean") {
    throw new Error("무료 여부를 지정해 주세요.");
  }

  const params = new URLSearchParams({
    isFree: String(isFree),
    genre,
    platform,
    sort,
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(`/api/games?${params}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error("게임 목록을 불러오지 못했습니다.");
  }

  const data = await response.json();

  return {
    items: data.items.map((game, index) => ({
      id: game.appId,
      appId: game.appId,
      title: game.gameName,
      image: game.headerImage || game.capsuleImage || null,
      genres: game.genres || [],
      platforms: game.platforms || {},
      recommendationsTotal: game.recommendationsTotal ?? null,
      isFree: game.isFree,
      priceText: game.isFree ? "무료" : "스팀에서 가격 확인",

      //현재 조회 조건과 정렬에서의 표시 번호
      rank: (data.page - 1) * data.pageSize + index + 1,
    })),
    totalCount: data.totalCount,
  };
}
// Steam 설명에 포함된 HTML 태그를 화면 표시용 텍스트로 변환
function toGameText(value) {
  const text = String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");

  const decoder = document.createElement("textarea");
  decoder.innerHTML = text;

  return decoder.value;
}

//실제 게임 상세 정보 조회
export async function getGameDetail(appId, { signal } = {}) {
  const response = await fetch(
    `/api/games/${encodeURIComponent(appId)}`,
    {
      method: "GET",
      signal,
    }
  );

  if (!response.ok) {
    const error = new Error("게임 상세 정보를 불러오지 못했습니다.");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  return {
    ...data,
    id: data.appId,
    title: data.gameName,
    image: data.headerImage || data.capsuleImage || null,

    shortDescription: toGameText(data.shortDescription),
    supportedLanguages:
      toGameText(data.supportedLanguages) || "지원 언어 정보 없음",

    developers: data.developers || [],
    publishers: data.publishers || [],
    genres: data.genres || [],
    categories: data.categories || [],
    platforms: data.platforms || {},
    movie: data.movie || [],

    recommendationsTotal: data.recommendationsTotal ?? null,
  };
}

//선택한 장르에 해당하는 실제 게임 목록
export async function getGenreGames({
  genre = "all",
  platform = "all",
  sort = "app_id_asc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
    const params = new URLSearchParams({
      genre,
      platform,
      sort,
      page: String(page),
      pageSize: String(pageSize),
    });

    //이 요청 부분이 빠져 있었어
    const response = await fetch(`/api/games/by-genre?${params}`, {
      method: "GET",
      signal,
    });

    if (!response.ok) {
      throw new Error("장르별 게임 목록을 불러오지 못했습니다.");
    }

    const data = await response.json();

  return {
    items: data.items.map((game, index) => ({
      id: game.appId,
      appId: game.appId,
      title: game.gameName,
      image: game.headerImage || game.capsuleImage || null,
      genres: game.genres || [],
      platforms: game.platforms || {},
      recommendationsTotal: game.recommendationsTotal ?? null,
      isFree: game.isFree,

      //현재 조회 조건과 정렬에서의 표시 번호
      rank: (data.page - 1) * data.pageSize + index + 1,
    })),
    totalCount: data.totalCount,
  };
}

export async function getDiscountGames({
  genre = "all",
  platform = "all",
  sort = "discount_desc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  signal?.throwIfAborted();

  const filteredGames = mockHotGames
    .filter((game) => !game.isFree && game.discountPercent > 0)
    .filter((game) => genre === "all" || game.genres.includes(genre))
    .filter((game) => platform === "all" || game.platforms[platform])
    .sort((first, second) => {
      if (sort === "title_asc") return first.title.localeCompare(second.title);
      return second.discountPercent - first.discountPercent || second.recommendationsTotal - first.recommendationsTotal;
    })
    .map((game, index) => ({
      ...game,
      genres: [...game.genres],
      platforms: { ...game.platforms },
      rank: index + 1,
    }));

  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const start = (currentPage - 1) * size;
  return {
    items: filteredGames.slice(start, start + size),
    totalCount: filteredGames.length,
  };
}
//장르 선택창에 표시할 영문 장르 목록
export async function getGameGenres({ signal } = {}) {
  const response = await fetch("/api/games/genres", {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    throw new Error("장르 목록을 불러오지 못했습니다");
  }

  return response.json();
}
