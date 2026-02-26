"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useProducts } from "@/store/useProducts";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { ChartAreaDefault } from "@/components/charts/AreaChart";
import { ChartPieLabelList } from "@/components/charts/PieChart";
import { ChartBarActive } from "@/components/charts/BarChart";
import { ChartLineDefault } from "@/components/charts/LineChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, RefreshCw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import AnalyticsSkeleton from "@/components/client/skeleton/AnalyticsSkeleton";
import { Button } from "@/components/ui/button";
export default function Page() {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const { users, loading: usersLoading, fetchUsers } = useUsers();

  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const timeRange = ["Last 7 Days", "Last Month", "All Time"];

  const [range, setRange] = useState(timeRange[0]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders("admin"),
        fetchUsers("admin"),
      ]);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    } finally {
      setIsRefreshing(false);
      setHasInitiallyLoaded(true);
    }
  }, [fetchProducts, fetchOrders, fetchUsers]);

  useEffect(() => {
    setMounted(true);
    handleRefresh();
  }, [handleRefresh]);

  const showInitialSkeleton =
    (productsLoading || ordersLoading || usersLoading) && !hasInitiallyLoaded;

  const getFilteredOrders = useCallback(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (range === "Last 7 Days") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= sevenDaysAgo;
      }

      if (range === "Last Month") {
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        );
        return orderDate >= thirtyDaysAgo;
      }

      return true; // "All Time"
    });
  }, [orders, range]);

  const pieData = useMemo(() => {
    const filteredOrders = getFilteredOrders();
    const counts = filteredOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return ["completed", "processing", "pending", "cancelled"].map(
      (status) => ({
        status,
        count: counts[status] || 0,
        fill: `var(--color-${status})`,
      }),
    );
  }, [orders, range, getFilteredOrders]);

  const topSellingProducts = useMemo(() => {
    const filtered = getFilteredOrders();

    // LOG 1: Did we pass the date filter?
    console.log(`Passed date filter: ${filtered.length} / ${orders.length}`);

    const counts: Record<string, { name: string; quantity: number }> = {};

    filtered.forEach((order) => {
      // LOG 2: Do items actually exist?
      if (!order.order_items || order.order_items.length === 0) {
        console.warn(`Order ${order.id} has no items! Check your API fetch.`);
        return;
      }

      order.order_items.forEach((item) => {
        const productId = item.product_id;
        const productName = item.product?.name || "Unknown";

        if (!counts[productId]) {
          counts[productId] = { name: productName, quantity: 0 };
        }
        counts[productId].quantity += item.quantity;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders, range, getFilteredOrders]);

  const userActivityData = useMemo(() => {
    if (!users?.length) return [];

    // 1. Filter only 'user' role
    const customerUsers = users.filter((u) => u.role === "user");

    // 2. Determine date cutoff based on range
    const now = new Date();
    let cutoffDate = new Date(0); // Default to All Time

    if (range === "Last 7 Days") {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "Last Month") {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // 3. Group users by Month/Year
    const monthlyCounts: Record<string, number> = {};

    customerUsers.forEach((user) => {
      const userDate = new Date(user.created_at);
      if (userDate >= cutoffDate) {
        const monthYear = userDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
      }
    });

    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        month,
        users: count,
      }))
      .sort((a, b) => {
        return new Date(a.month).getTime() - new Date(b.month).getTime();
      });
  }, [users, range]);

  if (showInitialSkeleton) {
    return <AnalyticsSkeleton />;
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="page-heading">Analytics</h1>
        <p className="page-subheading">
          Get insights on products, orders, and user activity
        </p>

        <Card className="flex flex-col w-full mb-6 p-4 mt-2 gap-3 shadow-none">
          {/* Top Row: Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 ">
                {["Last 7 Days", "Last Month", "All Time"].map((time) => (
                  <Button
                    key={time}
                    variant={range === time ? "accent" : "secondary"}
                    size="sm"
                    onClick={() => setRange(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="lg:ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Bottom Row: Status bar that handles background refreshes */}
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75",
                    (isRefreshing || hasInitiallyLoaded) && "animate-ping",
                  )}
                ></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="uppercase tracking-wider">
                {isRefreshing ? "Updating Dashboard..." : "Syncing Live Data"}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto ">
              <Button
                className="text-accent group h-8 gap-2 "
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-500",
                    isRefreshing ? "animate-spin" : "group-hover:rotate-180",
                  )}
                />
                {isRefreshing ? "Refreshing" : "Refresh"}
              </Button>
              <span className="opacity-80 hidden sm:inline">
                Last updated:{" "}
                {mounted && lastUpdated
                  ? lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Loading..."}
              </span>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPieLabelList data={pieData} />
          <ChartAreaDefault
            revenueData={[{ month: "Current Total", revenue: totalRevenue }]}
          />
          <ChartBarActive data={topSellingProducts} />
          <ChartLineDefault data={userActivityData} />
        </div>
      </div>
    </div>
  );
}
