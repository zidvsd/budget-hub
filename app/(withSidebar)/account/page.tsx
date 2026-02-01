"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { Package, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import OrdersTab from "@/components/client/account/orders/OrdersTab";
import ProfileTab from "@/components/client/account/profile/ProfileTab";
export default function Page() {
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { fetchUsers, loading: usersLoading } = useUsers();
  const [currentTab, setCurrentTab] = useState("profile");
  const searchParams = useSearchParams();
  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setCurrentTab(tab);
    }
  }, [searchParams]);

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
          onClick={() => setCurrentTab("orders")}
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
          onClick={() => setCurrentTab("notifications")}
          variant={tabVariant("notifications")}
          className=" flex-1 flex items-center gap-2 "
        >
          <Bell />
          <span className="hidden sm:block">Notifications </span>
          <span className="sm:hidden">Alerts </span>
          <span>{}</span>
        </Button>

        <Button
          onClick={() => setCurrentTab("profile")}
          variant={tabVariant("profile")}
          className=" flex-1 flex items-center gap-2 "
        >
          <User />
          <span>Profile</span>
        </Button>
      </div>

      {/* orders tab */}
      <main className="mt-8">
        {currentTab === "orders" && (
          <OrdersTab orders={orders} loading={ordersLoading} />
        )}
        {currentTab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
