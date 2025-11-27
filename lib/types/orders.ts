export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}
export interface OrderItem {
  id: string;
  product: ProductItem; // <-- single object
  product_id: string;
  quantity: number;
  price: number;
}
export interface ProductItem {
  name: string;
}
