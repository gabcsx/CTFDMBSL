// components/Sidebar.js
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/sidebar.module.css";
import sidebarMenu from "./sidebarMenu";

export default function Sidebar({ activeItem, onSelect, adminName, profilePic }) {
  const [openMenus, setOpenMenus] = useState({});

  // Open the parent menu if an active submenu is selected
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
    <div className={styles.sidebarContainer}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/assets/minilogo.png"
          alt="Logo"
          width={150}
          height={150}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Profile */}
      <div className={styles.profileSection} style={{ position: "relative" }}>
        <div
          className={styles.profileAvatarWrapper}
        >
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
            >
              <span className={styles.menuLabel}>{item.label}</span>
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
                  >
                    {sub.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
