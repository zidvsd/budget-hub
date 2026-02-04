import { create } from "zustand";
import { Product } from "@/lib/types/products";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (query?: string) => Promise<void>;
  updateProductState: (id: string, updates: Partial<Product>) => void;
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
      const data = json.data ?? json;
      set({
        products: Array.isArray(data) ? data : [],
        loading: false,
        error: json.success === false ? json.error : null,
      });
      set({ products: json.data ?? json, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false, products: [] });
    }
  },
  updateProductState: (id: string, updates: Partial<Product>) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  },
  clearProducts: () => set({ products: [], error: null, loading: false }),
}));
