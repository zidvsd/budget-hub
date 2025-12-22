"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
// Shape of your order items after enriching with product data
export type OrderItemRow = {
  id: string;
  product_id: string;
  productName: string;
  quantity: number;
  price: number;
  image_path: string | null;
};

export const columns: ColumnDef<OrderItemRow>[] = [
  {
    accessorKey: "img_path",
    header: "Image",
    cell: ({ row }) => {
      const imagePath = row.original.image_path;

      if (!imagePath) return null;

      return (
        <Image
          src={imagePath}
          alt={row.original.productName}
          height={52}
          width={52}
          className="object-cover"
        />
      );
    },
  },
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
