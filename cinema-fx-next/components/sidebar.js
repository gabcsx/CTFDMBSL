import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/sidebar.module.css";
import sidebarMenu from "./sidebarMenu";

export default function Sidebar({ activeItem, onSelect, adminName, profilePic }) {
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    sidebarMenu.forEach((item) => {
      if (item.submenu) {
        const found = item.submenu.some((sub) => sub.key === activeItem);
        if (found) {
          setOpenMenus((prev) => ({
            ...prev,
            [item.key]: true,
          }));
        }
      }
    });
  }, [activeItem]);

  const handleMenuClick = (key, hasSubmenu) => {
    if (hasSubmenu) {
      setOpenMenus((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    } else {
      onSelect(key);
    }
  };

  return (
    <nav className={styles.sidebarContainer} tabIndex={0}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/assets/minilogo.png"
          alt="Logo"
          width={150}
          height={150}
          style={{ objectFit: "contain" }}
        />
        <span className={styles.logoText}>Admin</span>
      </div>
      {/* Profile */}
      <div className={styles.profileSection}>
        <div className={styles.profileAvatarWrapper}>
          <Image
            src={profilePic || "/assets/avatar.png"}
            alt="Profile"
            width={48}
            height={48}
            className={styles.profileAvatar}
          />
        </div>
        <span className={styles.profileName}>{adminName || "Admin User"}</span>
      </div>
      {/* Menu */}
      <ul className={styles.menuList}>
        {sidebarMenu.map((item) => (
          <li key={item.key}>
            <div
              className={`${styles.menuItem} ${
                activeItem === item.key ||
                (item.submenu && item.submenu.some((sub) => sub.key === activeItem))
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleMenuClick(item.key, !!item.submenu)}
              tabIndex={0}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.submenu && (
                <span className={styles.arrow}>
                  {openMenus[item.key] ? "▼" : "►"}
                </span>
              )}
            </div>
            {item.submenu && openMenus[item.key] && (
              <ul className={styles.subMenu}>
                {item.submenu.map((sub) => (
                  <li
                    key={sub.key}
                    className={`${styles.subMenuItem} ${
                      activeItem === sub.key ? styles.selected : ""
                    }`}
                    onClick={() => onSelect(sub.key)}
                    tabIndex={0}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.sidebarFooter}>
        &copy; {new Date().getFullYear()} Admin
      </div>
    </nav>
  );
}
