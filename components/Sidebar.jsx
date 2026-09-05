import { useState } from "react";

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
  const [isGameOpen, setIsGameOpen] = useState(false);

  const menus = [
    { name: "Home", icon: homeIcon, active: true },
    { name: "Game", icon: gameIcon, hasSubmenu: true },
    { name: "Library", icon: libraryIcon },
    { name: "Social", icon: socialIcon },
    { name: "Board", icon: boardIcon },
    { name: "Setting", icon: settingIcon },
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
    if (menuName === "Game") {
      setIsGameOpen((prev) => !prev);
    }
  };

  return (
    <aside className="sidebar">
      <div className="site-info">
        <img src={logo} alt="SteamInfoSite Logo" />
        <span>SteamInfoSite</span>
      </div>

      <nav className="sidebar-menu">
        {menus.map((menu) => (
          <div key={menu.name} className="menu-group">
            <button
              className={`sidebar-menu-item ${menu.active ? "active" : ""}`}
              onClick={() => handleMenuClick(menu.name)}
            >
              <img src={menu.icon} alt="" />
              <span>{menu.name}</span>
            </button>

            {/* 서브메뉴 목록 출력 */}
            {menu.hasSubmenu && isGameOpen && (
              <div className="submenu-list">
                {subMenus.map((sub) => (
                  <button key={sub.name} className="submenu-item">
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