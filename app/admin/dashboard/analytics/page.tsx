"use client";
import { ChartPieSimple } from "@/components/charts/PieChart";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaDefault } from "@/components/charts/AreaChart";
import { ChartBarActive } from "@/components/charts/BarChart";
import { ChartLineDefault } from "@/components/charts/LineChart";
export default function page() {
  const loading = false;
  return (
    <div className="">
      {loading ? (
        <>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-6" />
        </>
      ) : (
        <>
          <h1 className="page-heading">Analytics Management</h1>

          <p className="page-subheading">Monitor your store's performance</p>
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* pie chart - order status */}
          <ChartPieSimple />
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
