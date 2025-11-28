import { create } from "zustand";
import { getRoleFromCookie } from "@/lib/utils";
import { Order } from "@/lib/types/orders";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  clearOrders: () => void;
}

export const useOrders = create<OrdersState>((set) => ({
  orders: [],
  loading: true,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const role = getRoleFromCookie();

      const endpoint =
        role === "admin" ? "/api/admin/orders" : "/api/client/orders";

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
      console.error("Failed to fetch orders:", error);
      set({
        error: error.message ?? "Unknown error",
        loading: false,
        orders: [],
      });
    }
  },

  clearOrders: () => set({ orders: [], error: null }),
}));
