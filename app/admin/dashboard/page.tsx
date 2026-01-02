"use client";

import {
  TriangleAlert,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useProducts } from "@/store/useProducts";
import { useEffect } from "react";
import { useUsers } from "@/store/useUsers";

export default function DashboardPage() {
  const { fetchOrders, orders, loading: ordersLoading } = useOrders();
  const { fetchProducts, products, loading: productsLoading } = useProducts();
  const { fetchUsers, users, loading: usersLoading } = useUsers();
  const loading = ordersLoading || productsLoading || usersLoading;

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, [fetchOrders, fetchProducts, fetchUsers]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users?.length ?? 0;
  const totalPendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const totalLowStocks = products.filter(
    (product) => product.stock <= 5
  ).length;

  return (
    <div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </>
      ) : (
        <>
          <h1 className="page-heading">Dashboard</h1>
          <p className="page-subheading">Welcome to your admin dashboard</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-5">
            <StatCard
              title="Total Products"
              icon={<Package className="size-6" />}
              stat={totalProducts}
              description="All products currently available in the store"
            />
            <StatCard
              title="Total Orders"
              icon={<ShoppingCart className="size-6" />}
              stat={totalOrders}
              description="All orders placed by customers so far"
            />
            <StatCard
              title="Pending Orders"
              icon={<DollarSign className="size-6 " />}
              stat={totalPendingOrders}
              description="Orders that are awaiting processing or fulfillment"
            />

            <StatCard
              title="Total Users"
              icon={<Users className="size-6 " />}
              stat={totalUsers}
              description="All users registered"
            />
          </div>
        </>
      )}
    </div>
  );
}
