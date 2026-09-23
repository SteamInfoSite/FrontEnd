import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

// 메인 메뉴 아이콘
import logo from "../assets/logo0.png";
import homeIcon from "../assets/home-page0.png";
import gameIcon from "../assets/gameIcon.svg";
import libraryIcon from "../assets/LibraryIcon.png";
import socialIcon from "../assets/SocialIcon.png";
import boardIcon from "../assets/BoardIcon.png";
import settingIcon from "../assets/SettingIcon.svg";

// 서브메뉴 아이콘
import hotIcon from "../assets/HotIcon.svg";
import newIcon from "../assets/NewIcon.svg";
import payIcon from "../assets/PayIcon.svg";
import freeIcon from "../assets/FreeIcon.svg";
import discountIcon from "../assets/discount0.png";
import genreIcon from "../assets/GenreIcon.svg";
import scheduleIcon from "../assets/ScheduleIcon.svg";



function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isGameOpen, setIsGameOpen] = useState(location.pathname.startsWith("/games"));

  const menus = [
    { id: "nav_home_button", name: "Home", icon: homeIcon },
    { id: "nav_game_button", name: "Game", icon: gameIcon, hasSubmenu: true },
    { id: "nav_library_button", name: "Library", icon: libraryIcon },
    { id: "nav_social_button", name: "Social", icon: socialIcon },
    { id: "nav_board_button", name: "Board", icon: boardIcon },
    { id: "nav_setting_button", name: "Setting", icon: settingIcon },
  ];

  const subMenus = [
    { id: "nav_hot_game_button", name: "Hot game", icon: hotIcon, path: "/games/hot" },
    { id: "nav_new_game_button", name: "New game", icon: newIcon, path: "/games/new" },
    { id: "nav_pay_to_play_button", name: "Pay-to-play", icon: payIcon, path: "/games/paid" },
    { id: "nav_free_game_button", name: "Free game", icon: freeIcon, path: "/games/free" },
    { id: "nav_discount_button", name: "Discount", icon: discountIcon, path: "/games/discount" },
    { name: "Genre", icon: genreIcon },
    { name: "Upcoming", icon: scheduleIcon },
  ];

  const handleMenuClick = (menuName) => {
    if (menuName === "Home") {
      navigate("/");
    }

    if (menuName === "Game") {
      setIsGameOpen((prev) => !prev);
    }

    if (menuName === "Board") {
      navigate("/board");
    }
  };

  const isMenuActive = (menuName) => {
    if (menuName === "Home") {
      return location.pathname === "/";
    }

    if (menuName === "Board") {
      return location.pathname.startsWith("/board");
    }

    if (menuName === "Game") {
      return location.pathname.startsWith("/games");
    }

    return false;
  };

  return (
    <aside id="site_sidebar" className="sidebar">
      <div className="site-info">
        <img src={logo} alt="SteamInfoSite Logo" />
        <span>SteamInfoSite</span>
      </div>

      <nav className="sidebar-menu">
        {menus.map((menu) => (
          <div
            key={menu.name}
            className="menu-group"
          >
            <button
              id={menu.id}
              className={`sidebar-menu-item ${
                isMenuActive(menu.name) ? "active" : ""
              }`}
              onClick={() => handleMenuClick(menu.name)}
              aria-expanded={menu.hasSubmenu ? isGameOpen : undefined}
            >
              <img src={menu.icon} alt="" />
              <span>{menu.name}</span>
            </button>

            {/* Game 메뉴 클릭 시 서브메뉴 목록 출력 */}
            {menu.hasSubmenu && isGameOpen && (
              <div className="submenu-list">
                {subMenus.map((sub) => (
                  <button
                    key={sub.name}
                    id={sub.id}
                    className={`submenu-item ${location.pathname === sub.path ? "active" : ""}`}
                    aria-current={location.pathname === sub.path ? "page" : undefined}
                    onClick={() => { if (sub.path) navigate(sub.path); }}
                  >
                    <img src={sub.icon} alt="" />
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
