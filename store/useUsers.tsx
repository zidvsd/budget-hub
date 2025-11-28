import { create } from "zustand";
import { User } from "@/lib/types/users";
import { getRoleFromCookie } from "@/lib/utils";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  clearUsers: () => void;
}

export const useUsers = create<UsersState>((set) => ({
  users: [],
  loading: true,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      const role = getRoleFromCookie();
      const endpoint =
        role === "admin" ? "/api/admin/users" : "/api/client/user";

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unable to fetch users");

      const data = await res.json();

      console.log("⚠️ Users API returned:", data);
      set({ users: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearUsers: () => set({ users: [], error: null }),
}));
