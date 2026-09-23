import test from "node:test";
import assert from "node:assert/strict";
import { getDiscountGames, getGamesByPrice, getHotGames, getNewGames, getUpcomingGames } from "../src/services/gameService.js";

test("pages contain distinct games and report the filtered total", async () => {
  const first = await getHotGames({ page: 1, pageSize: 10 });
  const second = await getHotGames({ page: 2, pageSize: 10 });
  assert.equal(first.items.length, 10);
  assert.equal(second.items.length, 2);
  assert.equal(first.totalCount, 12);
  assert.equal(new Set([...first.items, ...second.items].map((game) => game.id)).size, 12);
  assert.equal(second.items[0].rank, 11);
});

test("genre and platform filters combine, including no matches", async () => {
  const result = await getHotGames({ genre: "액션", platform: "linux" });
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every((game) => game.genres.includes("액션") && game.platforms.linux));
  const empty = await getHotGames({ genre: "스포츠", platform: "mac" });
  assert.deepEqual(empty, { items: [], totalCount: 0 });
});

test("ascending order retains recommendation ranks and does not change later requests", async () => {
  const ascending = await getHotGames({ sort: "recommendations_asc", pageSize: 20 });
  const descending = await getHotGames({ pageSize: 20 });
  assert.deepEqual(ascending.items.map((game) => game.id), descending.items.map((game) => game.id).reverse());
  assert.equal(ascending.items[0].rank, 12);
  assert.equal(descending.items[0].rank, 1);
  ascending.items[0].genres.push("변경 테스트");
  const fresh = await getHotGames({ sort: "recommendations_asc" });
  assert.ok(!fresh.items[0].genres.includes("변경 테스트"));
});

test("cancelled requests reject instead of supplying stale data", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(getHotGames({ signal: controller.signal }), { name: "AbortError" });
});

test("invalid page sizes use defaults and out of range pages contain no rows", async () => {
  const invalid = await getHotGames({ page: -1, pageSize: 0 });
  assert.equal(invalid.items.length, 10);
  const overflow = await getHotGames({ page: 999 });
  assert.equal(overflow.items.length, 0);
  assert.equal(overflow.totalCount, 12);
});

test("new games are sorted by release date and can be filtered", async () => {
  const latest = await getNewGames({ pageSize: 20 });
  assert.equal(latest.totalCount, 8);
  assert.equal(latest.items[0].title, "HB Inc.");
  assert.ok(latest.items[0].releaseDate >= latest.items.at(-1).releaseDate);

  const filtered = await getNewGames({ genre: "액션", platform: "windows" });
  assert.ok(filtered.items.length > 0);
  assert.ok(filtered.items.every((game) => game.genres.includes("액션") && game.platforms.windows));
});

test("upcoming games are sorted by planned release date and can be filtered", async () => {
  const upcoming = await getUpcomingGames({ pageSize: 20 });
  assert.equal(upcoming.totalCount, 6);
  assert.equal(upcoming.items[0].title, "Project Aurora");
  assert.ok(upcoming.items[0].releaseDate <= upcoming.items.at(-1).releaseDate);

  const filtered = await getUpcomingGames({ genre: "전략", platform: "mac" });
  assert.ok(filtered.items.length > 0);
  assert.ok(filtered.items.every((game) => game.genres.includes("전략") && game.platforms.mac));
});

test("paid and free lists only return the requested price type", async () => {
  const paid = await getGamesByPrice({ isFree: false, pageSize: 20 });
  const free = await getGamesByPrice({ isFree: true, pageSize: 20 });
  assert.ok(paid.items.length > 0);
  assert.ok(free.items.length > 0);
  assert.ok(paid.items.every((game) => game.isFree === false && game.priceText !== "무료"));
  assert.ok(free.items.every((game) => game.isFree === true && game.priceText === "무료"));
});

test("genre mode can return all games or only the selected genre", async () => {
  const allGames = await getGamesByPrice({ isFree: undefined, pageSize: 20 });
  const actionGames = await getGamesByPrice({ isFree: undefined, genre: "액션", pageSize: 20 });
  assert.equal(allGames.totalCount, 12);
  assert.ok(actionGames.items.length > 0);
  assert.ok(actionGames.items.every((game) => game.genres.includes("액션")));
});

test("discount list only returns discounted paid games in discount order", async () => {
  const result = await getDiscountGames({ pageSize: 20 });
  assert.equal(result.totalCount, 7);
  assert.ok(result.items.every((game) => game.isFree === false && game.discountPercent > 0));
  assert.equal(result.items[0].discountPercent, 75);
  assert.ok(result.items.every((game, index) => index === 0 || game.discountPercent <= result.items[index - 1].discountPercent));
});
