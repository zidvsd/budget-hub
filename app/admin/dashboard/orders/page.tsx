"use client";

import { Users, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/store/useOrders";
import { useUsers } from "@/store/useUsers";
import { useEffect } from "react";

export default function page() {
  const { fetchOrders, orders, loading: ordersLoading } = useOrders();
  const { fetchUsers, users, loading: usersLoading } = useUsers();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [fetchOrders, fetchUsers]);

  const loading = ordersLoading || usersLoading;

  if (loading) {
    return (
      <div className="custom-container">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-heading">Orders Management</h1>
      <p className="page-subheading">Manage and track all customer orders</p>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
        <StatCard
          title="Users"
          icon={<Users className="w-6 h-6" />}
          stat={users.length}
        />
        <StatCard
          title="Orders"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={orders.length}
        />
        <StatCard
          title="Revenue"
          icon={<ShoppingCart className="w-6 h-6" />}
          stat={orders.length}
          description="This month"
        />
      </div>

      {/* Orders List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Orders List</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-md p-4 mb-4">
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
                  {order.order_items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name} × {item.quantity} (${item.price})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
