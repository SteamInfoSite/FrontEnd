import {
  mockNewGames,
  mockPopularGames,
} from "./gameMockData";

const allMockGames = [
  ...mockNewGames,
  ...mockPopularGames,
];

export const mockGameDetails = allMockGames.map((game) => ({
  ...game,
  // 홈 카드의 임시 ID는 실제 Steam 앱 ID와 구분합니다.
  appId: null,
  requiredAge: null,
  isFree: game.id !== 4,
  shortDescription: "백엔드 API 연결 후 게임 소개가 표시됩니다.",
  comingSoon: game.id <= 3,
  relDate: "출시일 정보 없음",
  developers: [],
  publishers: [],
  genres: [],
  categories: [],
  supportedLanguages: "지원 언어 정보 없음",
  recommendationsTotal: null,
  platforms: {
    windows: true,
    mac: false,
    linux: false,
  },
  movie: [],
}));
