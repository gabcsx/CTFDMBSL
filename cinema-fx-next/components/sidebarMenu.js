const sidebarMenu = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  {
    key: "product",
    label: "Product",
    icon: "🧴",
    submenu: [
      { key: "view-product", label: "Manage Products", icon: "📦" },    
    ],
  },
  {
    key: "purchase-order",
    label: "Transactions",
    icon: "💸",
    submenu: [
      { key: "view-orders", label: "View Transactions", icon: "🧾" },
      { key: "view-deliveries", label: "View Deliveries", icon: "🚚" },
    ],
  },
  {
    key: "user",
    label: "User",
    icon: "👤",
    submenu: [
      { key: "view-users", label: "Manage Users", icon: "🧑‍🤝‍🧑" },
    ],
  },
];
export default sidebarMenu;
