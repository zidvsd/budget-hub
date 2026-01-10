import { create } from "zustand";
import { getRoleFromCookie } from "@/lib/utils";
import { Cart } from "@/lib/types/cart";
import { CartItem } from "@/lib/types/cart";
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  fetchCartItems: () => Promise<void>; // Fetch all cart items
  addCartItem: (item: CartItem) => void; // Add locally (and optionally send to backend)
  removeCartItem: (itemId: string) => void; // Remove locally
  updateCartItem: (updatedItem: CartItem) => void; // Update quantity or data locally
  clearCart: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchCartItems: async () => {
    const { items, loading } = get();

    if (loading) return;

    set({ loading: true, error: null });

    try {
      const role = getRoleFromCookie();
      let endpoint =
        role === "admin" ? "/api/admin/cart" : "/api/client/user/cart";

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const json = await res.json();

      if (!json.success) {
        set({ error: json.error, loading: false, items: [] });
        return;
      }

      // Expect backend to return { cartItems: [...] }
      set({ items: json.cartItems ?? [], loading: false });
    } catch (error: any) {
      set({
        error: error.message ?? "Unknown error",
        loading: false,
        items: [],
      });
    }
  },

  addCartItem: (item: CartItem) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  removeCartItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },

  updateCartItem: (updatedItem: CartItem) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === updatedItem.id ? updatedItem : i
      ),
    }));
  },

  clearCart: () => set({ items: [], error: null }),
}));
