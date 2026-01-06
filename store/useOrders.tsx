import { create } from "zustand";
import { getRoleFromCookie } from "@/lib/utils";
import { Order } from "@/lib/types/orders";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: (userId?: string) => Promise<void>;
  clearOrders: () => void;
  updateOrderLocally: (updatedOrder: Order) => void;
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  updateOrderLocally: (updatedOrder) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        // Find the order by its ID and replace the entire object
        order.id === updatedOrder.id ? updatedOrder : order
      ),
    }));
  },
  fetchOrders: async (userId?: string) => {
    const { loading } = get();

    if (loading) return;

    set({ loading: true, error: null });
    try {
      const role = getRoleFromCookie();

      let endpoint =
        role === "admin" ? "/api/admin/orders" : "/api/client/orders";

      if (userId) {
        endpoint += `?user_id=${userId}`;
      }

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const json = await res.json();
      if ("success" in json && json.success === false) {
        set({ error: json.error, loading: false, orders: [] });
        return;
      }

      set({ orders: json.data ?? json, loading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Unknown error",
        loading: false,
        orders: [],
      });
    }
  },

  clearOrders: () => set({ orders: [], error: null, loading: false }),
}));
