import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { getGenreGames, hotGameGenres, hotGamePlatforms } from "../services/gameService";

import "../styles/HotGames.css";

const PAGE_SIZE = 10;

function GenreGames() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = hotGameGenres.includes(searchParams.get("genre")) ? searchParams.get("genre") : "all";
  const platform = hotGamePlatforms.some((item) => item.value === searchParams.get("platform")) ? searchParams.get("platform") : "all";
  const sort = searchParams.get("sort") === "title_asc" ? "title_asc" : "recommendations_desc";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestKey = JSON.stringify([genre, platform, sort, page]);
  const [result, setResult] = useState({ key: "", status: "loading", items: [], totalCount: 0 });
  const [retry, setRetry] = useState(0);
  const status = result.key === requestKey ? result.status : "loading";
  const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    setResult({ key: requestKey, status: "loading", items: [], totalCount: 0 });

    getGenreGames({ genre, platform, sort, page, pageSize: PAGE_SIZE, signal: controller.signal })
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
  }, [genre, platform, sort, page, requestKey, retry, setSearchParams]);

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
    <div className="hot-games-page genre-games-page">
      <Sidebar />
      <div className="hot-games-main-area">
        <Header />
        <main id="genre_games_content" className="hot-games-content">
          <div className="hot-games-heading">
            <div><h1>Genre</h1><p>장르별 게임을 확인하세요.</p></div>
            <span className="hot-games-example">예시 데이터</span>
          </div>

          <div className="hot-games-filters">
            <div className="hot-games-filter-group">
              <select id="genre_genre_select" aria-label="장르" value={genre} onChange={(event) => changeFilter("genre", event.target.value)}>
                <option value="all">전체 장르</option>
                {hotGameGenres.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select id="genre_platform_select" aria-label="플랫폼" value={platform} onChange={(event) => changeFilter("platform", event.target.value)}>
                <option value="all">모든 플랫폼</option>
                {hotGamePlatforms.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <select id="genre_sort_select" aria-label="정렬" value={sort} onChange={(event) => changeFilter("sort", event.target.value)}>
              <option value="recommendations_desc">추천 수 높은 순</option>
              <option value="title_asc">이름순</option>
            </select>
          </div>

          <div className="hot-games-results" aria-busy={status === "loading"}>
            {status === "loading" && <p id="genre_games_loading" className="hot-games-state" role="status">게임 목록을 불러오는 중입니다.</p>}
            {status === "error" && <div id="genre_games_error" className="hot-games-state" role="alert"><p>게임 목록을 불러오지 못했습니다.</p><button id="genre_games_retry_button" type="button" onClick={() => setRetry((value) => value + 1)}>다시 시도</button></div>}
            {status === "success" && result.totalCount === 0 && <div id="genre_games_empty" className="hot-games-state" role="status"><p>조건에 맞는 게임이 없습니다.</p><button id="genre_filters_reset_button" type="button" onClick={() => setSearchParams({})}>필터 초기화</button></div>}
            {status === "success" && result.totalCount > 0 && <>
              <table id="genre_game_list" className="hot-games-table genre-games-table" aria-label="Genre 목록">
                <thead><tr><th scope="col">순위</th><th scope="col">게임명 / 장르</th><th scope="col">추천 수</th></tr></thead>
                <tbody>{result.items.map((game) => <tr id={`genre_game_item_${game.id}`} key={game.id}>
                  <td className="hot-game-rank">{game.rank}</td>
                  <td><Link className="hot-game-link" to={`/games/${game.id}`}><span className="hot-game-image">{game.image ? <img src={game.image} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}<span>게임 이미지</span></span><span className="hot-game-description"><strong>{game.title}</strong><span>{game.genres.join(" · ")} · {hotGamePlatforms.filter((item) => game.platforms[item.value]).map((item) => item.label).join(" / ")}</span></span></Link></td>
                  <td className="hot-game-count">{game.recommendationsTotal.toLocaleString()}</td>
                </tr>)}</tbody>
              </table>
              <nav id="genre_game_pagination" className="hot-game-pagination" aria-label="Genre 목록 페이지"><button id="genre_page_prev_button" type="button" disabled={page === 1} onClick={() => changePage(page - 1)}>이전</button><Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} /><button id="genre_page_next_button" type="button" disabled={page === totalPages} onClick={() => changePage(page + 1)}>다음</button></nav>
              <p className="hot-games-total" role="status">전체 {result.totalCount}개 · {page} / {totalPages} 페이지</p>
            </>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GenreGames;
