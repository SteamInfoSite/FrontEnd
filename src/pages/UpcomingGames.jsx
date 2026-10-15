import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { getUpcomingGames, hotGamePlatforms } from "../services/gameService";
import { useLanguage } from "../contexts/LanguageContext";

import "../styles/HotGames.css";

const PAGE_SIZE = 10;

function UpcomingGames() {
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const platform = hotGamePlatforms.some((item) => item.value === searchParams.get("platform")) ? searchParams.get("platform") : "all";
  const sort = searchParams.get("sort") === "released_desc" ? "released_desc" : "released_asc";
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

    getUpcomingGames({ platform, sort, page, pageSize: PAGE_SIZE, signal: controller.signal })
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
    <div className="hot-games-page upcoming-games-page">
      <Sidebar />
      <div className="hot-games-main-area">
        <Header />
        <main id="upcoming_games_content" className="hot-games-content">
          <div className="hot-games-heading">
            <div>
              <h1>{t("Upcoming")}</h1>
              <p>
                {t("출시 예정 게임을 확인하세요. 예정일이 지난 게임과 날짜 미정 게임은 뒤쪽에 표시됩니다.")}
              </p>
            </div>
          </div>

          <div className="hot-games-filters">
            <div className="hot-games-filter-group">
              <select id="upcoming_platform_select" aria-label={t("플랫폼")} value={platform} onChange={(event) => changeFilter("platform", event.target.value)}>
                <option value="all">{t("모든 플랫폼")}</option>
                {hotGamePlatforms.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <select id="upcoming_sort_select" aria-label={t("정렬")} value={sort} onChange={(event) => changeFilter("sort", event.target.value)}>
              <option value="released_asc">{t("출시일 빠른 순")}</option>
              <option value="released_desc">{t("출시일 늦은 순")}</option>
            </select>
          </div>

          <div className="hot-games-results" aria-busy={status === "loading"}>
            {status === "loading" && <p id="upcoming_games_loading" className="hot-games-state" role="status">{t("출시 예정 게임 목록을 불러오는 중입니다.")}</p>}
            {status === "error" && (
              <div id="upcoming_games_error" className="hot-games-state" role="alert">
                <p>{t("출시 예정 게임 목록을 불러오지 못했습니다.")}</p>
                <button id="upcoming_games_retry_button" type="button" onClick={() => setRetry((value) => value + 1)}>{t("다시 시도")}</button>
              </div>
            )}
            {status === "success" && result.totalCount === 0 && (
              <div id="upcoming_games_empty" className="hot-games-state" role="status">
                <p>{t("조건에 맞는 출시 예정 게임이 없습니다.")}</p>
                <button id="upcoming_filters_reset_button" type="button" onClick={() => setSearchParams({})}>{t("필터 초기화")}</button>
              </div>
            )}
            {status === "success" && result.totalCount > 0 && (
              <>
                <table id="upcoming_game_list" className="hot-games-table upcoming-games-table" aria-label={t("출시 예정 게임 목록")}>
                  <thead><tr><th scope="col">{t("번호")}</th><th scope="col">{t("게임명 / 장르")}</th><th scope="col">{t("출시 예정일")}</th></tr></thead>
                  <tbody>
                    {result.items.map((game) => (
                      <tr id={`upcoming_game_item_${game.id}`} key={game.id}>
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
                        <td className="new-game-date">
                          {game.releaseDateNeedsReview ? (
                            <div className="upcoming-release-review">
                              <strong>{t("출시 일정 재확인 필요")}</strong>
                              <small>{t("기존 예정일: {{date}}", { date: t(game.releaseDate) })}</small>
                            </div>
                          ) : (
                            t(game.releaseDate)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav
                  id="upcoming_game_pagination"
                  className="hot-game-pagination"
                  aria-label={t("출시 예정 게임 목록 페이지")}
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

export default UpcomingGames;
