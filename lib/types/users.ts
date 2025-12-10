export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "user";
  address: string | null;
  phone: string;
  created_at: string;
}
