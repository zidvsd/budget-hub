import { create } from "zustand";
import { Product } from "@/lib/types/products";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (query?: string) => Promise<void>;
  clearProducts: () => void;
}

export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (query?: string) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      let url = "/api/products";
      if (query) url += `?q=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Unable to fetch products");

      const json = await res.json();

      if ("success" in json && json.success === true) {
        set({ error: json.error, loading: false, products: [] });
      }
      set({ products: json.data ?? json, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false, products: [] });
    }
  },

  clearProducts: () => set({ products: [], error: null, loading: false }),
}));
