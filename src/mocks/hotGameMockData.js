// 화면 동작 확인용 예시 데이터입니다. 추천 수·장르·플랫폼은 실제 통계가 아닙니다.
// id는 프론트엔드 목업 식별자이며 Steam appId와 구분합니다.
export const mockHotGames = [
  { id: 5, title: "Counter Strike 2", image: new URL("../assets/P_02.jpg", import.meta.url).href, genres: ["액션"], platforms: { windows: true, mac: false, linux: true }, recommendationsTotal: 125000, isFree: false, priceText: "₩22,000", discountPercent: 20 },
  { id: 7, title: "Eternal Return", image: null, genres: ["전략", "액션"], platforms: { windows: true, mac: false, linux: false }, recommendationsTotal: 87000, isFree: true, priceText: "무료" },
  { id: 8, title: "Stardew Valley", image: null, genres: ["시뮬레이션"], platforms: { windows: true, mac: true, linux: true }, recommendationsTotal: 64000, isFree: false, priceText: "₩16,000", discountPercent: 10 },
  { id: 9, title: "Hollow Knight", image: null, genres: ["액션", "어드벤처"], platforms: { windows: true, mac: true, linux: true }, recommendationsTotal: 42000, isFree: false, priceText: "₩16,500", discountPercent: 25 },
  { id: 4, title: "Grand Theft Auto V 레거시", image: new URL("../assets/P_01.jpg", import.meta.url).href, genres: ["액션", "어드벤처"], platforms: { windows: true, mac: false, linux: false }, recommendationsTotal: 38000, isFree: false, priceText: "₩44,000", discountPercent: 50 },
  { id: 6, title: "DOTA 2", image: new URL("../assets/P_03.jpg", import.meta.url).href, genres: ["전략"], platforms: { windows: true, mac: true, linux: true }, recommendationsTotal: 32000, isFree: true, priceText: "무료" },
  { id: 10, title: "Celeste", image: null, genres: ["액션"], platforms: { windows: true, mac: true, linux: true }, recommendationsTotal: 24000, isFree: false, priceText: "₩21,500", discountPercent: 15 },
  { id: 11, title: "Portal 2", image: null, genres: ["퍼즐"], platforms: { windows: true, mac: false, linux: true }, recommendationsTotal: 18000, isFree: false, priceText: "₩10,500", discountPercent: 75 },
  { id: 12, title: "Terraria", image: null, genres: ["어드벤처"], platforms: { windows: true, mac: true, linux: true }, recommendationsTotal: 12000, isFree: false, priceText: "₩11,000", discountPercent: 30 },
  { id: 1, title: "HB Inc.", image: new URL("../assets/N_01.jpg", import.meta.url).href, genres: ["시뮬레이션"], platforms: { windows: true, mac: false, linux: false }, recommendationsTotal: 9000, isFree: true, priceText: "무료" },
  { id: 2, title: "Valdivia AllStars", image: new URL("../assets/N_02.jpg", import.meta.url).href, genres: ["스포츠"], platforms: { windows: true, mac: false, linux: false }, recommendationsTotal: 6000, isFree: true, priceText: "무료" },
  { id: 3, title: "RAKHEM", image: new URL("../assets/N_03.jpg", import.meta.url).href, genres: ["어드벤처"], platforms: { windows: true, mac: false, linux: false }, recommendationsTotal: 3000, isFree: true, priceText: "무료" },
];
