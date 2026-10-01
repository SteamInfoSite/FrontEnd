import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

import "../styles/Social.css";

const exampleFriends = [
  { id: "minseo", name: "민서", initial: "M", status: "playing", game: "Stardew Valley", lastSeen: "지금" },
  { id: "doyun", name: "도윤", initial: "D", status: "online", game: null, lastSeen: "지금" },
  { id: "harin", name: "하린", initial: "H", status: "away", game: "Hollow Knight", lastSeen: "3시간 전" },
  { id: "jiwoo", name: "지우", initial: "J", status: "offline", game: null, lastSeen: "어제" },
];

const statusLabels = {
  playing: "게임 중",
  online: "온라인",
  away: "자리 비움",
  offline: "오프라인",
};

const friendFilters = [
  { id: "all", label: "전체" },
  { id: "online", label: "온라인" },
  { id: "playing", label: "게임 중" },
];

function Social() {
  const navigate = useNavigate();
  const { loggedIn, status } = useAuth();
  const [filter, setFilter] = useState("all");
  const visibleFriends = exampleFriends.filter((friend) => {
    if (filter === "online") return friend.status === "online" || friend.status === "playing";
    if (filter === "playing") return friend.status === "playing";
    return true;
  });
  const filterCounts = {
    all: exampleFriends.length,
    online: exampleFriends.filter((friend) => friend.status === "online" || friend.status === "playing").length,
    playing: exampleFriends.filter((friend) => friend.status === "playing").length,
  };

  return (
    <div className="social-page">
      <Sidebar />
      <div className="social-main-area">
        <Header />
        <main id="social_content" className="social-content">
          <div className="social-heading">
            <div>
              <h1>Social</h1>
              <p>Steam 친구의 접속 상태와 게임 활동을 확인하세요.</p>
            </div>
            {loggedIn && status === "ready" && <span className="social-example-label">예시 데이터</span>}
          </div>

          {status === "loading" ? (
            <p className="social-loading" role="status">로그인 상태를 확인하는 중입니다.</p>
          ) : loggedIn && status === "ready" ? (
            <>
              <section id="social_friend_list" className="social-friends" aria-labelledby="social_friends_title">
                <div className="social-section-heading">
                  <h2 id="social_friends_title">친구 목록</h2>
                  <span>{exampleFriends.length}명</span>
                </div>

                <div id="social_friend_filters" className="social-friend-filters" role="group" aria-label="친구 상태 필터">
                  {friendFilters.map((item) => (
                    <button
                      key={item.id}
                      id={`social_friend_filter_${item.id}_button`}
                      type="button"
                      className={filter === item.id ? "active" : ""}
                      aria-pressed={filter === item.id}
                      onClick={() => setFilter(item.id)}
                    >
                      {item.label} {filterCounts[item.id]}
                    </button>
                  ))}
                </div>

                <div className="social-table-scroll">
                  <table id="social_friend_table" className="social-friend-table">
                    <thead>
                      <tr>
                        <th scope="col">친구</th>
                        <th scope="col">상태</th>
                        <th scope="col">플레이 중</th>
                        <th scope="col">마지막 접속</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleFriends.map((friend) => (
                        <tr key={friend.id} id={`social_friend_${friend.id}`}>
                          <td>
                            <div className="social-friend-profile">
                              <span className="social-friend-avatar" aria-hidden="true">{friend.initial}</span>
                              <span>
                                <strong>{friend.name}</strong>
                                <small>Steam 친구</small>
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`social-friend-status social-friend-status--${friend.status}`}>
                              {statusLabels[friend.status]}
                            </span>
                          </td>
                          <td className={friend.game ? "social-friend-game" : "social-friend-no-game"}>
                            {friend.game ?? "—"}
                          </td>
                          <td className="social-friend-last-seen">{friend.lastSeen}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="social_recent_activity" className="social-recent-activity" aria-labelledby="social_activity_title">
                <div className="social-section-heading">
                  <h2 id="social_activity_title">최근 활동</h2>
                  <span>친구들이 플레이한 게임</span>
                </div>
                <div className="social-activity-row">
                  <span>민서가 Stardew Valley를 시작했습니다.</span>
                  <time>2시간 전</time>
                </div>
              </section>
            </>
          ) : (
            <section id="social_login_notice" className="social-login-notice" aria-labelledby="social_login_title">
              <div className="social-login-message">
                <span className="social-login-icon" aria-hidden="true">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="17" r="7" />
                    <path d="M9 38c2-9 8-14 15-14s13 5 15 14" />
                  </svg>
                </span>
                <h2 id="social_login_title">친구의 활동을 보려면 로그인이 필요합니다</h2>
                <p>Steam 계정으로 로그인하면 친구 목록과 플레이 중인 게임을 볼 수 있습니다.</p>
                {status === "error" && <p className="social-auth-error" role="alert">로그인 상태를 확인하지 못했습니다. 서버 연결을 확인해 주세요.</p>}
                <button id="social_login_button" type="button" onClick={() => navigate("/login")}>Steam으로 로그인</button>
              </div>
              <p className="social-login-footer">친구 목록과 최근 활동은 로그인 후 표시됩니다.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Social;
