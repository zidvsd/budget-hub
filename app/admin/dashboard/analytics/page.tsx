"use client";
import { ChartPieLabelList } from "@/components/charts/PieChart";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaDefault } from "@/components/charts/AreaChart";
import { ChartBarActive } from "@/components/charts/BarChart";
import { ChartLineDefault } from "@/components/charts/LineChart";
import { useProducts } from "@/store/useProducts";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { useEffect, useMemo } from "react";

export default function page() {
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { users, fetchUsers, loading: usersLoading } = useUsers();

  useEffect(() => {
    if (!products.length || !orders.length || !users.length) {
      fetchOrders(), fetchProducts(), fetchUsers();
    }
  }, [fetchOrders, fetchProducts, fetchUsers]);
  const loading = productsLoading || ordersLoading || usersLoading;

  const pieData = useMemo(() => {
    const counts = {
      completed: orders.filter((o) => o.status === "completed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    return [
      {
        status: "completed",
        count: counts.completed,
        fill: "var(--color-completed)",
      },
      {
        status: "processing",
        count: counts.processing,
        fill: "var(--color-processing)",
      },
      {
        status: "pending",
        count: counts.pending,
        fill: "var(--color-pending)",
      },
      {
        status: "cancelled",
        count: counts.cancelled,
        fill: "var(--color-cancelled)",
      },
    ];
  }, [orders]);
  return (
    <div className="">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="w-72 h-10 rounded-md" />
          <Skeleton className="w-48 h-8  rounded-md" />
        </div>
      ) : (
        <>
          <h1 className="page-heading">Analytics Management</h1>

          <p className="page-subheading">Monitor your store's performance</p>
        </>
      )}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* pie chart - order status */}
          <ChartPieLabelList data={pieData} />
          {/* area chart - revenue over time */}
          <ChartAreaDefault />
          {/* bar chart - top selling products */}
          <ChartBarActive />
          {/* line chart - users */}
          <ChartLineDefault />
        </div>
      )}
    </div>
  );
}
