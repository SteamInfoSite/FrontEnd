const image1 = new URL("../assets/N_01.jpg", import.meta.url).href;
const image2 = new URL("../assets/N_02.jpg", import.meta.url).href;
const image3 = new URL("../assets/N_03.jpg", import.meta.url).href;

// 화면 동작 확인용 예시 데이터입니다. 출시일은 실제 Steam 데이터가 아닙니다.
export const mockNewGames = [
  { id: 1, title: "HB Inc.", image: image1, genres: ["시뮬레이션"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-09-18" },
  { id: 2, title: "Valdivia AllStars", image: image2, genres: ["스포츠"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-09-12" },
  { id: 3, title: "RAKHEM", image: image3, genres: ["어드벤처"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-09-04" },
  { id: 10, title: "Celeste", image: null, genres: ["액션"], platforms: { windows: true, mac: true, linux: true }, releaseDate: "2026-08-29" },
  { id: 11, title: "Portal 2", image: null, genres: ["퍼즐"], platforms: { windows: true, mac: false, linux: true }, releaseDate: "2026-08-21" },
  { id: 12, title: "Terraria", image: null, genres: ["어드벤처"], platforms: { windows: true, mac: true, linux: true }, releaseDate: "2026-08-16" },
  { id: 7, title: "Eternal Return", image: null, genres: ["전략", "액션"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-08-08" },
  { id: 8, title: "Stardew Valley", image: null, genres: ["시뮬레이션"], platforms: { windows: true, mac: true, linux: true }, releaseDate: "2026-08-01" },
];
