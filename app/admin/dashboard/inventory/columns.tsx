"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types/products";
import { formatPrice } from "@/lib/utils";
import { SquarePen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
type TableMeta = {
  onDelete: (id: string) => void;
};
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "img_path",
    header: "Image",
    cell: ({ row }) => {
      const imagePath = row.original.image_path;

      if (!imagePath) return null;

      return (
        <Link href={`/admin/dashboard/inventory/${row.original.id}`}>
          <Image
            src={imagePath}
            alt={row.original.name}
            height={42}
            width={42}
            className=" object-cover"
          />
        </Link>
      );
    },
  },

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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.stock;

      switch (true) {
        case stock === 0:
          return (
            <span className="px-3 py-1 rounded-full bg-red-100 text-destructive text-xs font-medium">
              Out of Stock
            </span>
          );

        case stock > 0 && stock < 6:
          return (
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
              Low Stock
            </span>
          );

        default:
          return (
            <span className="px-3 py-1 rounded-full bg-green-100 text-chart-2 text-xs font-medium">
              In Stock
            </span>
          );
      }
    },
  },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const id = row.original.id;
      const meta = table.options.meta as TableMeta | undefined;
      return (
        <div className="flex items-center gap-2">
          <Button variant={"nav"} className="border">
            <Link href={`/admin/dashboard/inventory/${id}`}>
              <SquarePen className="size-4" />
            </Link>
          </Button>

          {/* Delete with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    meta?.onDelete(id);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
