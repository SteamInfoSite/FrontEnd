import {
  mockNewGames,
  mockPopularGames,
} from "./gameMockData";
import { mockHotGames } from "./hotGameMockData";
import { mockUpcomingGames } from "./upcomingGameMockData";
import placeholderImage from "../assets/logo0.png";

const allMockGames = [
  ...mockNewGames,
  ...mockPopularGames,
  ...mockHotGames.filter((game) => ![...mockNewGames, ...mockPopularGames].some((item) => item.id === game.id)),
  ...mockUpcomingGames,
];

export const mockGameDetails = allMockGames.map((game) => {
  const hotGame = mockHotGames.find((item) => item.id === game.id);
  const upcomingGame = mockUpcomingGames.find((item) => item.id === game.id);
  return {
    ...game,
    image: game.image || placeholderImage,
    // 홈 카드의 임시 ID는 실제 Steam 앱 ID와 구분합니다.
    appId: null,
    requiredAge: null,
    isFree: game.id !== 4,
    shortDescription: "백엔드 API 연결 후 게임 소개가 표시됩니다.",
    comingSoon: game.id <= 3 || Boolean(upcomingGame),
    relDate: "출시일 정보 없음",
    developers: [],
    publishers: [],
    genres: hotGame?.genres || [],
    categories: [],
    supportedLanguages: "지원 언어 정보 없음",
    recommendationsTotal: hotGame?.recommendationsTotal ?? null,
    platforms: hotGame?.platforms || {
      windows: true,
      mac: false,
      linux: false,
    },
    movie: [],
  };
});
