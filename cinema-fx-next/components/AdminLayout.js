import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './sidebar';
import styles from '../styles/adminlayout.module.css';
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";
// If you have a ConfirmModal component, import it here

const routeToKey = {
  '/admin/dashboard': 'dashboard',
  '/admin/products': 'view-product',
  '/admin/add': 'add-product',
  '/admin/orders': 'view-orders',
  '/admin/deliveries': 'view-deliveries',
  '/admin/users': 'view-users',
  '/admin/users/add': 'add-user',
};

export default function AdminLayout({ children, profilePic }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const key = routeToKey[router.pathname] || 'dashboard';
    setActiveItem(key);
  }, [router.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key) => {
    setActiveItem(key);
    switch (key) {
      case 'dashboard': router.push('/admin/dashboard'); break;
      case 'view-product': router.push('/admin/products'); break;
      case 'add-product': router.push('/admin/add'); break;
      case 'view-orders': router.push('/admin/orders'); break;
      case 'view-deliveries': router.push('/admin/deliveries'); break;
      case 'view-users': router.push('/admin/users'); break;
      default: break;
    }
  };

  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar
        activeItem={activeItem}
        onSelect={handleSelect}
        adminName={session.user?.username || "Admin"}
        profilePic={profilePic}
      />
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.profileDropdownWrapper} ref={dropdownRef}>
            <button
              className={styles.profileDropdownButton}
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="User Menu"
            >
              <span className={styles.userIconEmoji}>👤</span>
            </button>
            {dropdownOpen && (
              <div className={styles.profileDropdownMenu}>
                <button
                  className={styles.profileDropdownItem}
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/admin/user-overview');
                  }}
                >
                  Edit Account Settings
                </button>
                <button
                  className={`${styles.profileDropdownItem} ${styles.logoutDropdownItem}`}
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut({ callbackUrl: '/admin/login' });
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.contentArea}>{children}</div>
        {/* If you use ConfirmModal, add it here */}
      </div>
    </div>
  );
}
