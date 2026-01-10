export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}
export interface CartItem {
  id: string;
  product: ProductItem; // <-- single object
  product_id: string;
  quantity: number;
  price: number;
}
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}
