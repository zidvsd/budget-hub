import * as LucideIcons from "lucide-react";
export const clientMenu: {
  title: string;
  url: string;
  icon: keyof typeof LucideIcons;
}[] = [
  { title: "Home", url: "/", icon: "Home" },
  { title: "Inbox", url: "/inbox", icon: "Inbox" },
  { title: "Calendar", url: "/calendar", icon: "Calendar" },
  { title: "Search", url: "/search", icon: "Search" },
  { title: "Settings", url: "/settings", icon: "Settings" },
];
export const adminMenu: {
  title: string;
  url: string;
  icon: keyof typeof LucideIcons;
}[] = [
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
