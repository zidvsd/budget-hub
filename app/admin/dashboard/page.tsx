"use client";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useEffect } from "react";
import { useProducts } from "@/store/useProducts";
export default function page() {
  const { fetchOrders, orders, loading, error } = useOrders();

  return (
    <div>
      <h1 className="page-heading">Dashboard</h1>
      <p className="page-subheading">Welcome to your admin dashboard</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <StatCard
          title="Total Products"
          icon={<Package className="w-6 h-6" />}
          stat={1280}
        />
        <StatCard
          title="Total Orders"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={1280}
        />
        <StatCard
          title="Pending Orders"
          icon={<DollarSign className="w-6 h-6" />}
          stat={245}
        />
      </div>
    </div>
  );
}
