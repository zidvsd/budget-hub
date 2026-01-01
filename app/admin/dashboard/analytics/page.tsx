"use client";
import { useState, useEffect, useMemo } from "react";

// ...other imports
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

  useEffect(() => {
    if (!products.length) fetchProducts();
    if (!orders.length) fetchOrders();
    if (!users?.length) fetchUsers();

    const fetchMetrics = async () => {
      try {
        setLoadingRevenue(true);
        const res = await fetch("/api/admin/metrics");
        const json = await res.json();
        if (res.ok && json.success) {
          setTotalRevenue(json.totalRevenue);
          console.log(totalRevenue);
        } else {
          console.error("Failed to fetch metrics:", json.error);
        }
      } catch (err) {
        console.error("Metrics fetch error:", err);
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchMetrics();
  }, [fetchProducts, fetchOrders, fetchUsers]);

  const loading =
    productsLoading || ordersLoading || usersLoading || loadingRevenue;

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
    <div>
      {/* ...loading skeletons */}
      {!loading && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPieLabelList data={pieData} />
          <ChartAreaDefault
            revenueData={[
              { month: "January", revenue: 1200 },
              { month: "February", revenue: 2300 },
              { month: "March", revenue: 1800 },
            ]}
          />
          <ChartBarActive />
          <ChartLineDefault />
        </div>
      )}
    </div>
  );
}
