import { useNavigate } from "react-router-dom";

function Header() { //로그인 안내 페이지로 보냄
  const navigate = useNavigate();

  const handleSteamLogin = () => {
    navigate("/login");
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
