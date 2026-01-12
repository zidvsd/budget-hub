import { create } from "zustand";
import { getRoleFromCookie } from "@/lib/utils";
import { CartItem } from "@/lib/types/cart";
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>; // Fetch all cart items
  addToCart: (productId: string, quantity?: number) => Promise<void>; // Add locally (and optionally send to backend)
  removeFromCart: (productId: string) => Promise<void>; // Add locally (and optionally send to backend)
  clearCart: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/client/user/cart", {
        credentials: "include",
      });
      const json = await res.json();

      if (!json.success) {
        set({ error: json.error, loading: false });
        return;
      }

      set({ items: json.data.items ?? [], loading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Unknown error",
        loading: false,
        items: [],
      });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await fetch("/api/client/user/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id: productId, quantity }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add to cart");
    }
    await useCart.getState().fetchCart();
  },

  removeFromCart: async (itemId) => {
    await fetch(`/api/client/user/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    await useCart.getState().fetchCart();
  },

  clearCart: () => set({ items: [], error: null }),
}));
