function Header() {
  const handleSteamLogin = () => {
    // 향후 Backend의 Steam OpenID 인증 URL로 리다이렉트 처리 구역
    console.log("Steam 로그인 요청");
  };

  return (
    <header id="site_header" className="header">
      <div className="search-area">
        <span>Search:</span>

        <input
          id="game_search_input"
          type="text"
          placeholder="게임 검색"
        />
      </div>

      <div className="auth-buttons">
        <button id="steam_login_button" onClick={handleSteamLogin}>
          Steam Login
        </button>
      </div>
    </header>
  );
}

export default Header;