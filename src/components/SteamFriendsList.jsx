import { useEffect, useState } from "react";
import { getMySteamFriends } from "../services/socialService";
import { useLanguage } from "../contexts/LanguageContext";

const stateLabels = {
  0: "오프라인",
  1: "온라인",
  2: "다른 용무 중",
  3: "자리 비움",
  4: "자리 비움",
  5: "거래 희망",
  6: "플레이 희망",
};

const filters = [
  { id: "all", label: "전체" },
  { id: "online", label: "온라인" },
  { id: "playing", label: "게임 중" },
];

function isPlaying(friend) {
  return friend.profileAvailable === true &&
    Boolean(
      friend.gameName ||
      (friend.gameId && friend.gameId !== "0")
    );
}

function isOnline(friend) {
  return friend.profileAvailable === true &&
    (
      isPlaying(friend) ||
      (
        Number.isInteger(friend.personaState) &&
        friend.personaState >= 1 &&
        friend.personaState <= 6
      )
    );
}

function getStatus(friend) {
  if (!friend.profileAvailable) {
    return { label: "확인 불가", style: "unknown" };
  }

  if (isPlaying(friend)) {
    return { label: "게임 중", style: "playing" };
  }

  const label = stateLabels[friend.personaState];

  if (!label) {
    return { label: "확인 불가", style: "unknown" };
  }

  if (friend.personaState === 0) {
    return { label, style: "offline" };
  }

  if (friend.personaState === 3 || friend.personaState === 4) {
    return { label, style: "away" };
  }

  return { label, style: "online" };
}

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(language === "ko" ? "ko-KR" : language === "ja" ? "ja-JP" : "en-US");
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

function FriendAvatar({ friend }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [friend.avatarUrl]);

  if (!friend.avatarUrl || failed) {
    return (
      <span className="social-friend-avatar" aria-hidden="true">
        {(friend.nickname || "?").slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      className="social-friend-avatar"
      src={friend.avatarUrl}
      alt=""
      width="44"
      height="44"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function SteamFriendsList() {
  const { language, t, formatNumber } = useLanguage();
  const [friends, setFriends] = useState([]);
  const [checkedAt, setCheckedAt] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getMySteamFriends({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;

        setFriends(data.friends);
        setCheckedAt(data.checkedAt);
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

  const counts = {
    all: friends.length,
    online: friends.filter(isOnline).length,
    playing: friends.filter(isPlaying).length,
  };

  const visibleFriends = friends.filter((friend) => {
    if (filter === "online") return isOnline(friend);
    if (filter === "playing") return isPlaying(friend);
    return true;
  });

  const reload = () => {
    if (loading || remainingSeconds > 0) return;

    setLoading(true);
    setRetry((value) => value + 1);
  };

  return (
    <section
      id="social_friend_list"
      className="social-friends"
      aria-labelledby="social_friends_title"
      aria-busy={loading}
    >
      <div className="social-section-heading">
        <h2 id="social_friends_title">{t("친구 목록")}</h2>
        {!loading && !error && <span>{t("{{count}}명", { count: formatNumber(friends.length) })}</span>}
      </div>

      {loading ? (
        <p role="status">{t("친구 목록을 불러오는 중입니다.")}</p>
      ) : error ? (
        <div className="social-friends-message">
          <p className="social-profile-error" role="alert">
            {t(error.message || "친구 목록을 불러오지 못했습니다.")}
          </p>

          {error.status === 401 ? (
            <a className="social-profile-button" href="/login">
              {t("로그인하러 가기")}
            </a>
          ) : (
            <button
              type="button"
              className="social-profile-button"
              disabled={remainingSeconds > 0}
              onClick={reload}
            >
              {remainingSeconds > 0
                ? t("{{seconds}}초 후 다시 시도", { seconds: remainingSeconds })
                : t("다시 불러오기")}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="social-friends-checked">
            {t("조회 시각: {{date}}", { date: formatDate(checkedAt, language) })}
          </p>

          <div
            id="social_friend_filters"
            className="social-friend-filters"
            role="group"
            aria-label={t("친구 상태 필터")}
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? "active" : ""}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {t(item.label)} {formatNumber(counts[item.id])}
              </button>
            ))}
          </div>

          {visibleFriends.length === 0 ? (
            <p className="social-friends-message" role="status">
              {t(friends.length === 0
                ? "등록된 Steam 친구가 없습니다."
                : "선택한 조건에 해당하는 친구가 없습니다.")}
            </p>
          ) : (
            <div className="social-table-scroll">
              <table
                id="social_friend_table"
                className="social-friend-table"
              >
                <thead>
                  <tr>
                    <th scope="col">{t("친구")}</th>
                    <th scope="col">{t("상태")}</th>
                    <th scope="col">{t("플레이 중")}</th>
                    <th scope="col">{t("마지막 로그오프")}</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleFriends.map((friend) => {
                    const state = getStatus(friend);

                    return (
                      <tr key={friend.steamId}>
                        <td>
                          <div className="social-friend-profile">
                            <FriendAvatar friend={friend} />
                            <span>
                              <strong>
                                {friend.nickname || t("프로필 확인 불가")}
                              </strong>
                              <small>
                                {friend.profileAvailable
                                  ? t("Steam 친구")
                                  : t("프로필 정보를 받지 못했습니다.")}
                              </small>
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              `social-friend-status ` +
                              `social-friend-status--${state.style}`
                            }
                          >
                            {t(state.label)}
                          </span>
                        </td>

                        <td
                          className={
                            isPlaying(friend)
                              ? "social-friend-game"
                              : "social-friend-no-game"
                          }
                        >
                          {isPlaying(friend)
                            ? friend.gameName || t("게임명 확인 불가")
                            : "—"}
                        </td>

                        <td className="social-friend-last-seen">
                          {formatDate(
                            friend.lastLogoff > 0
                              ? friend.lastLogoff * 1000
                              : null,
                            language
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default SteamFriendsList;
