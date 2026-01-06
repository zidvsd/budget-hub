import { create } from "zustand";
import { Product } from "@/lib/types/products";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  clearProducts: () => void;
}

export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    const { products, loading } = get();

    if (loading || products.length > 0) return;

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

  clearProducts: () => set({ products: [], error: null, loading: false }),
}));
