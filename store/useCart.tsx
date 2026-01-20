import { create } from "zustand";
import { toast } from "sonner";
import { getRoleFromCookie } from "@/lib/utils";
import { CartItem } from "@/lib/types/cart";
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  isAdding: boolean;
  fetchCart: (force?: boolean, silent?: boolean) => Promise<void>; // Fetch all cart items
  addToCart: (productId: string, quantity?: number) => Promise<boolean>; // Add locally (and optionally send to backend)
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>; // Add locally (and optionally send to backend)
  clearCart: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  isAdding: false,
  error: null,

  fetchCart: async (force = false, silent = false) => {
    const currentItems = get().items;
    if (currentItems.length > 0 && !force) return;
    if (!silent) set({ loading: true, error: null });

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
        items: [],
      });
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1): Promise<boolean> => {
    const role = getRoleFromCookie();
    if (!role) {
      throw new Error("Please login to add items to cart");
    }

    set({ isAdding: true, error: null });
    try {
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
      await get().fetchCart(true, true);

      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      set({ isAdding: false });
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    }));

    try {
      const res = await fetch(`/api/client/user/cart/${cartItemId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: quantity }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || "Failed to update quantity");
        await useCart.getState().fetchCart();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update quantity");
      await useCart.getState().fetchCart(); // revert on error
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const res = await fetch(`/api/client/user/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.error || "Failed to remove item");
        return;
      }
      set((state) => ({
        items: state.items.filter((item) => item.id !== cartItemId),
      }));
      toast.success("Item removed from cart!");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove item");
    }
  },
  clearCart: () => set({ items: [], error: null }),
}));
