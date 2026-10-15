import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { getNewGames, hotGamePlatforms } from "../services/gameService";
import { useLanguage } from "../contexts/LanguageContext";

import "../styles/HotGames.css";

const PAGE_SIZE = 10;

function NewGames() {
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const platform = hotGamePlatforms.some((item) => item.value === searchParams.get("platform")) ? searchParams.get("platform") : "all";
  const sort = searchParams.get("sort") === "released_asc" ? "released_asc" : "released_desc";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestKey = JSON.stringify([platform, sort, page]);
  const [result, setResult] = useState({ key: "", status: "loading", items: [], totalCount: 0 });
  const [retry, setRetry] = useState(0);
  const status = result.key === requestKey ? result.status : "loading";
  const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    setResult({ key: requestKey, status: "loading", items: [], totalCount: 0 });

    getNewGames({ platform, sort, page, pageSize: PAGE_SIZE, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE));
        if (page > lastPage) {
          setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            next.set("page", String(lastPage));
            return next;
          }, { replace: true });
          return;
        }
        setResult({ ...data, key: requestKey, status: "success" });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key: requestKey, status: "error", items: [], totalCount: 0 });
      });

    return () => controller.abort();
  }, [platform, sort, page, requestKey, retry, setSearchParams]);

  const changeFilter = (name, value) => {
    const next = new URLSearchParams(searchParams);
    next.set(name, value);
    next.delete("page");
    setSearchParams(next);
  };

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <div className="hot-games-page new-games-page">
      <Sidebar />
      <div className="hot-games-main-area">
        <Header />
        <main id="new_games_content" className="hot-games-content">
          <div className="hot-games-heading">
            <div>
              <h1>{t("New game")}</h1>
              <p>{t("오늘을 포함한 최근 30일 동안 출시된 게임을 확인하세요.")}</p>
            </div>
          </div>

          <div className="hot-games-filters">
            <div className="hot-games-filter-group">
              <select id="new_platform_select" aria-label={t("플랫폼")} value={platform} onChange={(event) => changeFilter("platform", event.target.value)}>
                <option value="all">{t("모든 플랫폼")}</option>
                {hotGamePlatforms.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <select id="new_sort_select" aria-label={t("정렬")} value={sort} onChange={(event) => changeFilter("sort", event.target.value)}>
              <option value="released_desc">{t("최신 출시 순")}</option>
              <option value="released_asc">{t("오래된 출시 순")}</option>
            </select>
          </div>

          <div className="hot-games-results" aria-busy={status === "loading"}>
            {status === "loading" && <p id="new_games_loading" className="hot-games-state" role="status">{t("신작 목록을 불러오는 중입니다.")}</p>}
            {status === "error" && (
              <div id="new_games_error" className="hot-games-state" role="alert">
                <p>{t("신작 목록을 불러오지 못했습니다.")}</p>
                <button id="new_games_retry_button" type="button" onClick={() => setRetry((value) => value + 1)}>{t("다시 시도")}</button>
              </div>
            )}
            {status === "success" && result.totalCount === 0 && (
              <div id="new_games_empty" className="hot-games-state" role="status">
                <p>{t("조건에 맞는 신작이 없습니다.")}</p>
                <button id="new_filters_reset_button" type="button" onClick={() => setSearchParams({})}>{t("필터 초기화")}</button>
              </div>
            )}
            {status === "success" && result.totalCount > 0 && (
              <>
                <table id="new_game_list" className="hot-games-table new-games-table" aria-label={t("최근 출시 게임 목록")}>
                  <thead>
                    <tr>
                      <th scope="col">{t("번호")}</th>
                      <th scope="col">{t("게임명 / 장르")}</th>
                      <th scope="col">{t("출시일")}</th>
                      <th scope="col">{t("가격")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((game) => (
                      <tr id={`new_game_item_${game.id}`} key={game.id}>
                        <td className="hot-game-rank">{game.rank}</td>
                        <td>
                          <button
                            type="button"
                            className="hot-game-link"
                            aria-label={t("{{title}} 상세 정보 보기", { title: game.title })}
                            onClick={() => navigate(`/games/detail/${game.appId}`)}
                          >
                            <span className="hot-game-image">
                              {game.image ? <img src={game.image} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}
                              <span>{t("게임 이미지")}</span>
                            </span>
                            <span className="hot-game-description">
                              <strong>{game.title}</strong>
                              <span>{game.genres.join(" · ")} · {hotGamePlatforms.filter((item) => game.platforms[item.value]).map((item) => item.label).join(" / ")}</span>
                            </span>
                          </button>
                        </td>
                        <td className="new-game-date">{t(game.releaseDate)}</td>
                        <td className="price-game-value">{t(game.priceText)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav
                  id="new_game_pagination"
                  className="hot-game-pagination"
                  aria-label={t("신작 목록 페이지")}
                >
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={changePage}
                    groupNavigation
                  />
                </nav>
                <p className="hot-games-total" role="status">{t("전체 {{count}}개 · {{page}} / {{pages}} 페이지", { count: formatNumber(result.totalCount), page, pages: totalPages })}</p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewGames;
