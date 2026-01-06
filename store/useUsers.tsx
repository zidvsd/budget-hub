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

export const useUsers = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    const { users, loading } = get();

    if (loading || users.length > 0) return;

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

      const json = await res.json();

      if ("success" in json && json.success === false) {
        set({ error: json.error, users: [], loading: false });
        return;
      }

      set({ users: json.data ?? json, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  clearUsers: () => set({ users: [], error: null, loading: false }),
}));
