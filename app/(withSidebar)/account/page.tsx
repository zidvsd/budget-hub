"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { Package, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import OrdersTab from "@/components/client/account/orders/OrdersTab";
import ProfileTab from "@/components/client/account/profile/ProfileTab";
export default function Page() {
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { fetchUsers, loading: usersLoading } = useUsers();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("tab") || "profile",
  );
  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setCurrentTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName);

    const params = new URLSearchParams(searchParams);
    params.set("tab", tabName);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tabVariant = (tab: string) => (currentTab === tab ? "accent" : "ghost");

  return (
    <div className="custom-container my-8">
      <h1 className="text-3xl font-bold">My Account</h1>
      <span className="text-muted-foreground">
        Manage your orders, notifications, and profile
      </span>

      {/* tab selection */}
      <div className="flex items-center justify-around gap-2 bg-sidebar-accent dark:bg-muted w-full sm:w-fit p-2 rounded-md mt-4">
        <Button
          onClick={() => handleTabChange("orders")}
          variant={tabVariant("orders")}
          className=" flex-1 flex items-center gap-2"
        >
          <Package />
          <span>Orders</span>
          {/* order length */}
          <span className="ml-1 border shadow-md flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-xs font-medium text-foreground">
            {orders.length}
          </span>
        </Button>

        <Button
          onClick={() => handleTabChange("notifications")}
          variant={tabVariant("notifications")}
          className=" flex-1 flex items-center gap-2 "
        >
          <Bell />
          <span className="hidden sm:block">Notifications </span>
          <span className="sm:hidden">Alerts </span>
          <span>{}</span>
        </Button>

        <Button
          onClick={() => handleTabChange("profile")}
          variant={tabVariant("profile")}
          className=" flex-1 flex items-center gap-2 "
        >
          <User />
          <span>Profile</span>
        </Button>
      </div>

      <main className="mt-8">
        {currentTab === "orders" && (
          <OrdersTab orders={orders} loading={ordersLoading} />
        )}
        {currentTab === "profile" && <ProfileTab />}
        {currentTab === "notifications" && (
          <div className="p-4 border rounded-md text-muted-foreground">
            No new notifications.
          </div>
        )}
      </main>
    </div>
  );
}
