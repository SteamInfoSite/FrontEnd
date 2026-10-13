import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SteamApiKeyPanel from "../components/SteamApiKeyPanel";
import { useAuth } from "../contexts/AuthContext";
import { getMyLibrary } from "../services/libraryService";

import "../styles/Social.css";
import "../styles/Library.css";

function formatPlaytime(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return "확인 불가";
  }

  const totalMinutes = Math.floor(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours === 0) return `${remainingMinutes}분`;
  if (remainingMinutes === 0) return `${hours}시간`;

  return `${hours}시간 ${remainingMinutes}분`;
}

function formatLastPlayed(seconds) {
  if (seconds === 0) return "플레이 기록 없음";
  if (!Number.isFinite(seconds) || seconds < 0) return "확인 불가";

  const date = new Date(seconds * 1000);

  return Number.isNaN(date.getTime())
    ? "확인 불가"
    : date.toLocaleDateString("ko-KR");
}

function formatCheckedAt(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("ko-KR");
}

function getRetryDelay(value) {
  if (!value) return 60000;

  if (/^[0-9]+$/.test(value)) {
    return Number(value) * 1000;
  }

  const retryAt = Date.parse(value);

  return Number.isNaN(retryAt)
    ? 60000
    : Math.max(0, retryAt - Date.now());
}

function LibraryGameCard({ game }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [game.headerImage]);

  const canOpenDetail = game.detailAvailable === true;
  const noRecentPlay =
    game.playtimeTwoWeeks == null || game.playtimeTwoWeeks === 0;

  return (
    <article className="library-game-card">
      <button
        className="library-game-open"
        type="button"
        disabled={!canOpenDetail}
        aria-label={`${game.gameName} 상세 정보 보기`}
        onClick={() => navigate(`/games/detail/${game.appId}`)}
      >
        {game.headerImage && !imageFailed ? (
          <img
            className="library-game-image"
            src={game.headerImage}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="library-game-image library-game-placeholder">
            이미지 없음
          </div>
        )}

        <h3>{game.gameName}</h3>
      </button>

      <div className="library-game-info">
        <dl>
          <div>
            <dt>누적 플레이</dt>
            <dd>{formatPlaytime(game.playtimeForever)}</dd>
          </div>

          <div>
            <dt>최근 2주</dt>
            <dd>
              {noRecentPlay
                ? "플레이 기록 없음"
                : formatPlaytime(game.playtimeTwoWeeks)}
            </dd>
          </div>

          <div>
            <dt>마지막 플레이</dt>
            <dd>{formatLastPlayed(game.lastPlayed)}</dd>
          </div>
        </dl>

        {!canOpenDetail && (
          <p className="library-detail-unavailable">
            사이트 상세 정보가 없는 항목입니다.
          </p>
        )}
      </div>
    </article>
  );
}

function LibraryContent() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getMyLibrary({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;

        setData(result);
        setRetryAt(0);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;

        setError(error);

        if (error.status === 429) {
          const current = Date.now();
          setNow(current);
          setRetryAt(current + getRetryDelay(error.retryAfter));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    if (retryAt <= Date.now()) return;

    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (current >= retryAt) {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [retryAt]);

  const remainingSeconds = Math.max(
    0,
    Math.ceil((retryAt - now) / 1000)
  );

  const reload = () => {
    if (loading || remainingSeconds > 0) return;

    setLoading(true);
    setRetry((value) => value + 1);
  };

  if (loading) {
    return (
      <p className="library-message" role="status">
        보유 게임을 불러오는 중입니다.
      </p>
    );
  }

  if (error) {
    return (
      <section className="library-message">
        <p className="social-profile-error" role="alert">
          {error.message || "보유 게임을 불러오지 못했습니다."}
        </p>

        {error.status === 401 ? (
          <button
            className="social-profile-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            로그인하러 가기
          </button>
        ) : (
          <button
            className="social-profile-button"
            type="button"
            disabled={remainingSeconds > 0}
            onClick={reload}
          >
            {remainingSeconds > 0
              ? `${remainingSeconds}초 후 다시 시도`
              : "다시 불러오기"}
          </button>
        )}
      </section>
    );
  }

  if (!data) return null;

  return (
    <>
      <section
        className="library-games-section"
        aria-labelledby="library_games_title"
      >
        <div className="social-section-heading">
          <h2 id="library_games_title">보유 유료 게임</h2>
          <span>{data.games.length}개</span>
        </div>

        <p className="library-checked-at">
          조회 시각: {formatCheckedAt(data.checkedAt)}
        </p>

        {data.games.length === 0 ? (
          <p className="library-message">
            현재 확인된 보유 유료 게임이 없습니다.
          </p>
        ) : (
          <div className="library-game-grid">
            {data.games.map((game) => (
              <LibraryGameCard key={game.appId} game={game} />
            ))}
          </div>
        )}
      </section>

      {data.unclassifiedGames.length > 0 && (
        <details className="library-unclassified">
          <summary>
            추가 보유 항목 {data.unclassifiedGames.length}개
          </summary>

          <p>
            유료 게임 여부를 확인하지 못한 보유 항목입니다.
          </p>

          <div className="library-game-grid">
            {data.unclassifiedGames.map((game) => (
              <LibraryGameCard key={game.appId} game={game} />
            ))}
          </div>
        </details>
      )}
    </>
  );
}

function Library() {
  const navigate = useNavigate();
  const { loggedIn, status, steamId, refreshAuth } = useAuth();

  return (
    <div className="social-page library-page">
      <Sidebar />

      <div className="social-main-area">
        <Header />

        <main id="library_content" className="social-content">
          <div className="social-heading">
            <div>
              <h1>Library</h1>
              <p>내가 보유한 유료 게임과 플레이 기록을 확인하세요.</p>
            </div>
          </div>

          {status === "loading" ? (
            <p className="social-loading" role="status">
              로그인 상태를 확인하는 중입니다.
            </p>
          ) : status === "error" ? (
            <section className="library-message">
              <p className="social-profile-error" role="alert">
                로그인 상태를 확인하지 못했습니다.
              </p>
              <button
                className="social-profile-button"
                type="button"
                onClick={refreshAuth}
              >
                다시 확인
              </button>
            </section>
          ) : loggedIn ? (
            <SteamApiKeyPanel
              key={steamId}
              description="보유 게임과 플레이 기록을 조회하려면 API 키를 등록해 주세요."
            >
              <LibraryContent />
            </SteamApiKeyPanel>
          ) : (
            <section className="social-login-notice">
              <div className="social-login-message">
                <h2>내 보유 게임을 보려면 로그인이 필요합니다</h2>
                <p>
                  Steam 계정으로 로그인하고 API 키를 등록해 주세요.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Steam으로 로그인
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Library;