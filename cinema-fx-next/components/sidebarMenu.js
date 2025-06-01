// components/sidebarMenu.js
const sidebarMenu = [
  { key: "dashboard", label: "Dashboard" },
  { key: "reports", label: "Reports" },
  {
    key: "product",
    label: "Product",
    submenu: [
      { key: "view-product", label: "View Product" },
      { key: "add-product", label: "Add Product" },
    ],
  },
  {
    key: "purchase-order",
    label: "Purchase Order",
    submenu: [
      { key: "view-orders", label: "View Orders" },
    ],
  },
  {
    key: "user",
    label: "User",
    submenu: [
      { key: "view-users", label: "View Users" },
    ],
  },
];

export default sidebarMenu;
