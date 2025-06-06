
const sidebarMenu = [
  { key: "dashboard", label: "Dashboard" },
  {
    key: "product",
    label: "Product",
    submenu: [
      { key: "view-product", label: "Manage Products" },    
    ],
  },
  {
    key: "purchase-order",
    label: "Transactions",
    submenu: [
      { key: "view-orders", label: "View Transactions" },
      { key: "view-deliveries", label: "View Deliveries" },
    ],
  },
  {
    key: "user",
    label: "User",
    submenu: [
      { key: "view-users", label: "Manage Users" },
    ],
  },
];

export default sidebarMenu;
