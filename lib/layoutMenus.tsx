export type IconName =
  | "Home"
  | "LayoutGrid"
  | "Bell"
  | "Package"
  | "User" // Client Icons
  | "LayoutDashboard"
  | "ShoppingCart"
  | "PackageSearch"
  | "Users"
  | "ChartColumnIncreasing"; // Admin Icons

export interface MenuItem {
  title: string;
  url: string;
  icon: IconName;
}
export const clientMenu: MenuItem[] = [
  { title: "Home", url: "/", icon: "Home" },
  { title: "Categories", url: "/categories", icon: "LayoutGrid" },
  { title: "Notifications", url: "/account?tab=notifications", icon: "Bell" },
  { title: "Orders", url: "/account?tab=orders", icon: "Package" },
  { title: "Account", url: "/account?tab=profile", icon: "User" },
];
export const adminMenu: MenuItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: "LayoutDashboard" },
  { title: "Orders", url: "/admin/dashboard/orders", icon: "ShoppingCart" },
  {
    title: "Inventory",
    url: "/admin/dashboard/inventory",
    icon: "PackageSearch",
  },
  { title: "Users", url: "/admin/dashboard/users", icon: "Users" },
  {
    title: "Analytics",
    url: "/admin/dashboard/analytics",
    icon: "ChartColumnIncreasing",
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/notifications",
    icon: "Bell",
  },
];
