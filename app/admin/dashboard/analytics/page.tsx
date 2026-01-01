"use client";

import { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/store/useProducts";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { ChartAreaDefault } from "@/components/charts/AreaChart";
import { ChartPieLabelList } from "@/components/charts/PieChart";
import { ChartBarActive } from "@/components/charts/BarChart";
import { ChartLineDefault } from "@/components/charts/LineChart";

export default function Page() {
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { users, fetchUsers, loading: usersLoading } = useUsers();

  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  // Fetch products, orders, users + metrics
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!products.length) fetchProducts();
        if (!orders.length) fetchOrders();
        if (!users?.length) fetchUsers();

        setLoadingRevenue(true);
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        if (res.ok && json.success) setTotalRevenue(json.totalRevenue || 0);
        else console.error("Failed to fetch metrics:", json.error);
      } catch (err) {
        console.error("Metrics fetch error:", err);
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchAllData();
  }, [
    fetchProducts,
    fetchOrders,
    fetchUsers,
    products.length,
    orders.length,
    users?.length,
  ]);

  const loading =
    productsLoading || ordersLoading || usersLoading || loadingRevenue;

  // Pie chart data
  const pieData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return ["completed", "processing", "pending", "cancelled"].map(
      (status) => ({
        status,
        count: counts[status] || 0,
        fill: `var(--color-${status})`,
      })
    );
  }, [orders]);

  // Compute top 5 selling products from completed orders
  const topSellingProducts = useMemo(() => {
    if (!orders.length || !products.length) return [];

    // Count quantity sold per product in completed orders
    const counts: Record<string, number> = {};

    orders
      .filter((o) => o.status === "completed")
      .forEach((order) => {
        order.order_items.forEach((item) => {
          counts[item.product_id] =
            (counts[item.product_id] || 0) + item.quantity;
        });
      });

    // Convert counts to array with product names
    const result = Object.entries(counts)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return {
          name: product?.name || "Unknown",
          quantity,
        };
      })
      .sort((a, b) => b.quantity - a.quantity) // sort descending
      .slice(0, 5); // top 5

    return result;
  }, [orders, products]);

  // Compute user activity data for the line chart
  const userActivityData = useMemo(() => {
    if (!users?.length) return [];

    // Example: just one data point for now
    const totalUsers = users.filter((u) => u.role === "user").length;

    // If you want monthly data, you can map over orders/users with created_at
    return [
      { month: "January", users: totalUsers },
      { month: "February", users: totalUsers },
      { month: "March", users: totalUsers },
      { month: "April", users: totalUsers },
      { month: "May", users: totalUsers },
    ];
  }, [users]);
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPieLabelList data={pieData} />
          <ChartAreaDefault
            revenueData={[
              { month: "January", revenue: 1200 },
              { month: "February", revenue: 2300 },
              { month: "March", revenue: 1800 },
            ]}
          />
          <ChartBarActive data={topSellingProducts} />
          <ChartLineDefault data={userActivityData} />
        </div>
      )}
    </div>
  );
}
