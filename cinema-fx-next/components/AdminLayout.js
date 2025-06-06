import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './sidebar';
import styles from '../styles/adminlayout.module.css';
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react";

const routeToKey = {
  '/admin/dashboard': 'dashboard',
  '/admin/reports': 'reports',
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

  // Update active sidebar item based on route
  useEffect(() => {
    const key = routeToKey[router.pathname] || 'dashboard';
    setActiveItem(key);
  }, [router.pathname]);

  // Close dropdown when clicking outside
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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <Sidebar
          activeItem={activeItem}
          onSelect={handleSelect}
          adminName={session.user.username}
          profilePic={profilePic}
        />
      </aside>
      <main className={styles.mainContent}>
        {/* Header Bar */}
        <div
          style={{
            width: '100%',
            padding: '16px 32px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.45)',
            position: 'relative',
            zIndex: 20,
            marginBottom: 24,
          }}
        >
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 28,
                cursor: 'pointer',
                color: '#e75480',
                borderRadius: '50%',
                padding: 6,
                outline: dropdownOpen ? '2px solid #e75480' : 'none',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="User Menu"
            >
              👤
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 40,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  borderRadius: 8,
                  minWidth: 200,
                  zIndex: 999,
                  padding: '8px 0',
                }}
              >
                <button
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 24px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 16,
                    cursor: 'pointer',
                    color: '#222',
                  }}
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/admin/user-overview');
                  }}
                >
                  Edit Account Settings
                </button>
                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #eee' }} />
                <button
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 24px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 16,
                    cursor: 'pointer',
                    color: '#e75480',
                  }}
                  onClick={() => {
    setDropdownOpen(false);
    signOut({ callbackUrl: '/' }); 
  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.contentArea}>{children}</div>
      </main>
    </div>
  );
}
