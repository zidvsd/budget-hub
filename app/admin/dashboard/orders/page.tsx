"use client";
import { Users, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useEffect } from "react";
export default function page() {
  const { fetchOrders, orders, loading } = useOrders();
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  console.log(orders);
  if (loading) {
    return (
      <div className="custom-container">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="custom-container">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="page-heading">Orders Management</h1>
      <p className="page-subheading">Manage and track all customer orders</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <StatCard title="Users" icon={<Users className="w-6 h-6" />} stat={0} />
        <StatCard
          title="Orders"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={0}
        />
        <StatCard
          title="Revenue"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={orders.length}
          description="This month"
        />
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-md p-4 mb-4 flex flex-col gap-2"
        >
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.total_price}
          </p>
          <div>
            <strong>Products:</strong>
            <ul className="ml-4 list-disc">
              {order.order_items.map((item, i) => (
                <li key={i}>
                  {item.product?.name || item.product.name} x {item.quantity} ($
                  {item.price})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
