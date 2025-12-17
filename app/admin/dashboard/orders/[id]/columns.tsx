"use client";

import { ColumnDef } from "@tanstack/react-table";

// Shape of your order items after enriching with product data
export type OrderItemRow = {
  id: string;
  product_id: string;
  productName: string;
  quantity: number;
  price: number;
};

export const columns: ColumnDef<OrderItemRow>[] = [
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "product_id",
    header: "Product ID",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Subtotal",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`, // format price
  },
];
