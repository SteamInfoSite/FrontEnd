import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import {
  getDiscountGames,
  getGamesByPrice,
  hotGamePlatforms,
} from "../services/gameService";

import "../styles/HotGames.css";

const PAGE_SIZE = 10;

function PriceGames({ mode }) {
  const navigate = useNavigate();

  const isFree = mode === "free";
  const isDiscount = mode === "discount";
  const prefix = isDiscount ? "discount" : isFree ? "free" : "paid";
  const title = isDiscount ? "Discount" : isFree ? "Free game" : "Pay-to-play";
  const description = isDiscount ? "할인 중인 게임과 할인율을 확인하세요." : isFree ? "무료로 플레이할 수 있는 게임을 확인하세요." : "유료로 판매 중인 게임을 확인하세요.";
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = "all";
  const requestedPlatform = searchParams.get("platform");
  const platform = hotGamePlatforms.some(
    (item) => item.value === requestedPlatform
  )
    ? requestedPlatform
    : "all";
  const requestedSort = searchParams.get("sort");
  const sort = isDiscount
    ? requestedSort === "title_asc"
      ? "title_asc"
      : "discount_desc"
    : ["app_id_asc", "title_asc", "recommendations_desc"]
        .includes(requestedSort)
      ? requestedSort
      : "app_id_asc";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const requestKey = JSON.stringify([prefix, genre, platform, sort, page]);
  const [result, setResult] = useState({ key: "", status: "loading", items: [], totalCount: 0 });
  const [retry, setRetry] = useState(0);
  const status = result.key === requestKey ? result.status : "loading";
  const totalPages = Math.ceil(result.totalCount / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    setResult({ key: requestKey, status: "loading", items: [], totalCount: 0 });
    (isDiscount
      ? getDiscountGames({ genre, platform, sort, page, pageSize: PAGE_SIZE, signal: controller.signal })
      : getGamesByPrice({ isFree, genre, platform, sort, page, pageSize: PAGE_SIZE, signal: controller.signal }))
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
  }, [isDiscount, isFree, genre, platform, sort, page, requestKey, retry, setSearchParams]);

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
    <div className="hot-games-page price-games-page">
      <Sidebar />
      <div className="hot-games-main-area">
        <Header />
        <main id={`${prefix}_games_content`} className="hot-games-content">
          <div className="hot-games-heading">
            <div><h1>{title}</h1><p>{description}</p></div>
            {isDiscount && (
              <span className="hot-games-example">예시 데이터</span>
            )}
          </div>
          <div className="hot-games-filters">
            <div className="hot-games-filter-group">

              <select
                id={`${prefix}_platform_select`}
                aria-label="플랫폼"
                value={platform}
                onChange={(event) =>
                  changeFilter("platform", event.target.value)
                }
              >
                <option value="all">모든 플랫폼</option>

                {hotGamePlatforms.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              id={`${prefix}_sort_select`}
              aria-label="정렬"
              value={sort}
              onChange={(event) =>
                changeFilter("sort", event.target.value)
              }
            >
              {isDiscount ? (
                <>
                  <option value="discount_desc">할인율 높은 순</option>
                  <option value="title_asc">이름순</option>
                </>
              ) : (
                <>
                  <option value="app_id_asc">게임 ID 순</option>
                  <option value="recommendations_desc">추천 수 높은 순</option>
                  <option value="title_asc">이름순</option>
                </>
              )}
            </select>
          </div>

          <div className="hot-games-results" aria-busy={status === "loading"}>
            {status === "loading" && <p id={`${prefix}_games_loading`} className="hot-games-state" role="status">게임 목록을 불러오는 중입니다.</p>}
            {status === "error" && <div id={`${prefix}_games_error`} className="hot-games-state" role="alert"><p>게임 목록을 불러오지 못했습니다.</p><button id={`${prefix}_games_retry_button`} type="button" onClick={() => setRetry((value) => value + 1)}>다시 시도</button></div>}
            {status === "success" && result.totalCount === 0 && <div id={`${prefix}_games_empty`} className="hot-games-state" role="status"><p>조건에 맞는 게임이 없습니다.</p><button id={`${prefix}_filters_reset_button`} type="button" onClick={() => setSearchParams({})}>필터 초기화</button></div>}
            {status === "success" && result.totalCount > 0 && <>
              <table id={`${prefix}_game_list`} className="hot-games-table price-games-table" aria-label={`${title} 목록`}>
                <thead>
                  <tr>
                    <th scope="col">{isDiscount ? "순위" : "번호"}</th>
                    <th scope="col">게임명 / 장르</th>
                    <th scope="col">{isDiscount ? "할인 가격" : "가격"}</th>
                  </tr>
                </thead>
                <tbody>{result.items.map((game) => <tr id={`${prefix}_game_item_${game.id}`} key={game.id}>
                  <td className="hot-game-rank">{game.rank}</td>
                  <td>
                    <button
                      type="button"
                      className="hot-game-link"
                      aria-label={`${game.title} 상세 정보 보기`}
                      onClick={() =>
                        navigate(
                          isDiscount
                            ? `/games/${game.id}`
                            : `/games/detail/${game.appId}`
                        )
                      }
                    >
                      <span className="hot-game-image">
                        {game.image ? (
                          <img
                            src={game.image}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.hidden = true;
                            }}
                          />
                        ) : null}
                        <span>게임 이미지</span>
                      </span>

                      <span className="hot-game-description">
                        <strong>{game.title}</strong>
                        <span>
                          {game.genres.join(" · ")}
                          {" · "}
                          {hotGamePlatforms
                            .filter((item) => game.platforms[item.value])
                            .map((item) => item.label)
                            .join(" / ")}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="price-game-value">{isDiscount ? `-${game.discountPercent}% ${game.priceText}` : game.priceText}</td>
                </tr>)}</tbody>
              </table>
              <nav
                id={`${prefix}_game_pagination`}
                className="hot-game-pagination"
                aria-label={`${title} 목록 페이지`}
              >
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={changePage}
                  groupNavigation
                />
              </nav>
              <p className="hot-games-total" role="status">전체 {result.totalCount}개 · {page} / {totalPages} 페이지</p>
            </>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PriceGames;
