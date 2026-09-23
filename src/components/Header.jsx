function Header() {
  const handleSteamLogin = () => {
    // 인증 API 연결 전에는 Steam 공식 로그인 화면으로 이동합니다.
    window.location.assign("https://store.steampowered.com/login/");
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
