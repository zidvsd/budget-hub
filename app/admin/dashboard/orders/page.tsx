"use client";

import { ShoppingCart, Clock, XCircle, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default function OrdersPage() {
  const { fetchOrders, orders, loading: ordersLoading } = useOrders();
  const { fetchUsers, users, loading: usersLoading } = useUsers();

  const loading = ordersLoading || usersLoading;

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

  return (
    <div>
      {loading ? (
        <>
          {/* Page heading skeleton */}
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-6" />

          {/* Stat cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Orders table skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="w-full h-48 rounded-md" />
          </div>
        </>
      ) : (
        <>
          <h1 className="page-heading">Orders Management</h1>
          <p className="page-subheading">
            Manage and track all customer orders
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
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

          {/* Orders table */}
          <div className="mt-8">
            <h1 className="text-2xl mb-4">All Orders</h1>
            <DataTable data={orders} columns={columns(users)} />
          </div>
        </>
      )}
    </div>
  );
}
