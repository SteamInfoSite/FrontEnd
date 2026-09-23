const image1 = new URL("../assets/N_01.jpg", import.meta.url).href;
const image2 = new URL("../assets/N_02.jpg", import.meta.url).href;
const image3 = new URL("../assets/N_03.jpg", import.meta.url).href;

// 화면 동작 확인용 예시 데이터입니다. 출시일은 실제 Steam 데이터가 아닙니다.
export const mockUpcomingGames = [
  { id: 101, title: "Project Aurora", image: image1, genres: ["어드벤처"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-10-15" },
  { id: 102, title: "Skyline Tactics", image: image2, genres: ["전략"], platforms: { windows: true, mac: true, linux: false }, releaseDate: "2026-10-22" },
  { id: 103, title: "Garden Workshop", image: image3, genres: ["시뮬레이션"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-11-03" },
  { id: 104, title: "Neon Drift", image: null, genres: ["액션", "스포츠"], platforms: { windows: true, mac: true, linux: true }, releaseDate: "2026-11-14" },
  { id: 105, title: "Dragonfall", image: null, genres: ["어드벤처", "액션"], platforms: { windows: true, mac: false, linux: false }, releaseDate: "2026-12-01" },
  { id: 106, title: "Moonbase 9", image: null, genres: ["시뮬레이션"], platforms: { windows: true, mac: true, linux: true }, releaseDate: "2027-01-09" },
];
