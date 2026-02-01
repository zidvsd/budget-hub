import OrdersCard from "./OrdersCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/Empty";
import { Order } from "@/lib/types/orders";

interface OrdersTabProp {
  orders: Order[];
  loading: boolean;
}

export default function OrdersTab({ orders, loading }: OrdersTabProp) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-500">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border bg-transparent dark:bg-muted/70 p-6"
          >
            <div className="flex items-center gap-4">
              {/* Icon Skeleton */}
              <Skeleton className="size-12 rounded-xl" />

              {/* Text Content Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" /> {/* Order ID */}
                  <Skeleton className="h-5 w-24 rounded-md" /> {/* Status */}
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" /> {/* Date */}
                  <Skeleton className="h-4 w-20" /> {/* Relative Time */}
                </div>
              </div>
            </div>

            {/* Price & Arrow Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" /> {/* Price */}
              <Skeleton className="h-5 w-5 rounded-full" /> {/* Chevron */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        description="Try buying some gadgets!"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrdersCard key={order.id} order={order} />
      ))}
    </div>
  );
}
