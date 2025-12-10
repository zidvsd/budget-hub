"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types/products";
import { formatPrice } from "@/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.original.price),
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
];
