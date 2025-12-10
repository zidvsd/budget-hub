"use client";

import { ShoppingCart, Clock, XCircle, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
export default function page() {
  const { fetchOrders, orders, loading: ordersLoading } = useOrders();
  const { fetchUsers, users, loading: usersLoading } = useUsers();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [fetchOrders, fetchUsers]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const loading = ordersLoading || usersLoading;

  if (loading) {
    return (
      <div className="custom-container">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-heading">Orders Management</h1>
      <p className="page-subheading">Manage and track all customer orders</p>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
        <StatCard
          title="Total Orders"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={totalOrders}
        />
        <StatCard
          title="Pending Orders"
          icon={<Clock className="w-6 h-6" />}
          stat={pendingOrders}
        />
        <StatCard
          title="Cancelled Orders"
          icon={<XCircle className="w-6 h-6" />}
          stat={cancelledOrders}
        />
        <StatCard
          title="Completed Orders"
          icon={<CheckCircle className="w-6 h-6" />}
          stat={completedOrders}
        />
      </div>

      {/* Orders List */}
      <div className="mt-8">
        {loading ? (
          <Skeleton className=" w-full h-42 rounded-md animate-pulse" />
        ) : (
          <>
            <h1 className="text-2xl mb-4">All Orders</h1>
            <DataTable data={orders} columns={columns(users)} />
          </>
        )}
      </div>
    </div>
  );
}
