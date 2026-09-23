import { mockHotGames } from "../mocks/hotGameMockData.js";
import { mockNewGames } from "../mocks/newGameMockData.js";

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

export async function getGamesByPrice({
  isFree,
  genre = "all",
  platform = "all",
  sort = "recommendations_desc",
  page = 1,
  pageSize = 10,
  signal,
} = {}) {
  signal?.throwIfAborted();

  const filteredGames = mockHotGames
    .filter((game) => game.isFree === isFree)
    .filter((game) => genre === "all" || game.genres.includes(genre))
    .filter((game) => platform === "all" || game.platforms[platform])
    .sort((first, second) => {
      if (sort === "title_asc") return first.title.localeCompare(second.title);
      return second.recommendationsTotal - first.recommendationsTotal || first.id - second.id;
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
