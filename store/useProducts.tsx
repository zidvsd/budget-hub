import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
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
      const data: Product[] = await res.json();
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearProducts: () => set({ products: [], error: null }),
}));
