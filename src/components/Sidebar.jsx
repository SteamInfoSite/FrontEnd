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

  const [isGameOpen, setIsGameOpen] = useState(false);

  const menus = [
    { id: "nav_home_button", name: "Home", icon: homeIcon },
    { id: "nav_game_button", name: "Game", icon: gameIcon, hasSubmenu: true },
    { id: "nav_library_button", name: "Library", icon: libraryIcon },
    { id: "nav_social_button", name: "Social", icon: socialIcon },
    { id: "nav_board_button", name: "Board", icon: boardIcon },
    { id: "nav_setting_button", name: "Setting", icon: settingIcon },
  ];

  const subMenus = [
    { name: "Hot game", icon: hotIcon },
    { name: "New game", icon: newIcon },
    { name: "Pay-to-play", icon: payIcon },
    { name: "Free game", icon: freeIcon },
    { name: "Discount", icon: discountIcon },
    { name: "Genre", icon: genreIcon },
    { name: "Scheduled", icon: scheduleIcon },
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
                    className="submenu-item"
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