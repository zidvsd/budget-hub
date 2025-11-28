import { create } from "zustand";

import { getRoleFromCookie } from "@/lib/utils";
import { Product } from "@/lib/types/products";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProducts = create<ProductsState>((set) => ({
  products: [],
  loading: true,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products");
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

  clearProducts: () => set({ products: [], error: null }),
}));
