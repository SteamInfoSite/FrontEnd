import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { useLanguage } from "../contexts/LanguageContext";
import { getSearchGames } from "../services/gameService";
import "../styles/HotGames.css";

const PAGE_SIZE = 10;

function SearchGames() {
  const { t, formatNumber } = useLanguage();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const requestedSort = params.get("sort");
  const sort = ["recommendations_desc", "released_desc", "title_asc"]
    .includes(requestedSort)
    ? requestedSort
    : "recommendations_desc";
  const requestedPage = Number(params.get("page"));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage : 1;
  const key = JSON.stringify([q, sort, page]);
  const [result, setResult] = useState({
    key: "", status: "loading", items: [], totalCount: 0,
  });
  const [retry, setRetry] = useState(0);
  const status = !q ? "idle"
    : result.key === key ? result.status : "loading";
  const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);

  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();
    setResult({ key, status: "loading", items: [], totalCount: 0 });

    getSearchGames({ q, sort, page, pageSize: PAGE_SIZE, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE));
        if (page > lastPage) {
          setParams((previous) => {
            const next = new URLSearchParams(previous);
            next.set("page", String(lastPage));
            return next;
          }, { replace: true });
          return;
        }
        setResult({ ...data, key, status: "success" });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({ key, status: "error", items: [], totalCount: 0 });
        }
      });

    return () => controller.abort();
  }, [q, sort, page, key, retry, setParams]);

  const changePage = (nextPage) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
  };

const changeSort = (nextSort) => {
  const next = new URLSearchParams(params);
  next.set("sort", nextSort);
  next.delete("page");
  setParams(next);
};

  return (
    <div className="hot-games-page">
      <Sidebar />
      <div className="hot-games-main-area">
        <Header />
        <main className="hot-games-content">
          <div className="hot-games-heading">
            <div><h1>{t("Search")}</h1><p>{q}</p></div>
          </div>
          <div className="hot-games-filters">
            <label htmlFor="search_sort_select">{t("정렬")}</label>
            <select
              id="search_sort_select"
              value={sort}
              onChange={(event) => changeSort(event.target.value)}
            >
              <option value="recommendations_desc">{t("추천 수 높은 순")}</option>
              <option value="released_desc">{t("최신 출시 순")}</option>
              <option value="title_asc">{t("이름순")}</option>
            </select>
          </div>
          <div className="hot-games-results" aria-busy={status === "loading"}>
            {status === "idle" && <p className="hot-games-state">{t("게임 검색")}</p>}
            {status === "loading" && <p className="hot-games-state" role="status">{t("게임 목록을 불러오는 중입니다.")}</p>}
            {status === "error" && <div className="hot-games-state" role="alert">
              <p>{t("게임 목록을 불러오지 못했습니다.")}</p>
              <button type="button" onClick={() => setRetry((value) => value + 1)}>{t("다시 시도")}</button>
            </div>}
            {status === "success" && result.totalCount === 0 && (
              <p className="hot-games-state" role="status">{t("조건에 맞는 게임이 없습니다.")}</p>
            )}
            {status === "success" && result.totalCount > 0 && <>
              <table className="hot-games-table" aria-label={t("Search")}>
                <thead><tr><th>{t("번호")}</th><th>{t("게임명 / 장르")}</th><th>{t("추천 수")}</th></tr></thead>
                <tbody>{result.items.map((game) => (
                  <tr key={game.id}>
                    <td className="hot-game-rank">{game.rank}</td>
                    <td><button type="button" className="hot-game-link"
                      onClick={() => navigate(`/games/detail/${game.appId}`)}>
                      <span className="hot-game-image">
                        {game.image && <img src={game.image} alt="" />}
                      </span>
                      <span className="hot-game-description">
                        <strong>{game.title}</strong>
                        <span>{game.genres.join(", ")}</span>
                      </span>
                    </button></td>
                    <td className="hot-game-count">
                      {game.recommendationsTotal == null
                        ? t("정보 없음")
                        : formatNumber(game.recommendationsTotal)}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
              <nav className="hot-game-pagination" aria-label={t("게임 목록 페이지")}>
                <Pagination currentPage={page} totalPages={totalPages}
                  onPageChange={changePage} groupNavigation />
              </nav>
              <p className="hot-games-total" role="status">
                {formatNumber(result.totalCount)} / {page} / {totalPages}
              </p>
            </>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SearchGames;