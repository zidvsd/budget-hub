export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "user";
  address: string | null;
  phone: string;
  created_at: string;
}
