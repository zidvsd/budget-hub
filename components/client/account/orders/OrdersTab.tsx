// components/client/account/orders/OrdersTab.jsx
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
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
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
      {orders.map((order, index) => (
        <OrdersCard key={order.id} order={order} />
      ))}
    </div>
  );
}
