"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types/products";
import { formatPrice } from "@/lib/utils";
import { Eye, SquarePen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  availabilityClasses,
  stockStatusClasses,
} from "@/lib/styles/badgeClasses";
import Link from "next/link";
import Image from "next/image";

type TableMeta = {
  onDelete: (id: string) => void;
};

// This type is used to define the shape of our data.

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
            className="object-cover"
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
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.original.stock}</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Public Visibility",
    cell: ({ row }) => {
      const isAvailable = row.original.is_active;
      return (
        <div className="text-center">
          <span
            className={
              isAvailable
                ? availabilityClasses.available
                : availabilityClasses.unavailable
            }
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.stock;

      let statusText = "";
      let statusClass = "";

      if (stock === 0) {
        statusText = "Out of Stock";
        statusClass = stockStatusClasses.outOfStock;
      } else if (stock > 0 && stock < 6) {
        statusText = "Low Stock";
        statusClass = stockStatusClasses.lowStock;
      } else {
        statusText = "In Stock";
        statusClass = stockStatusClasses.inStock;
      }

      return <span className={statusClass}>{statusText}</span>;
    },
  },
  {
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row, table }) => {
      const isFeatured = row.original.is_featured;
      const meta = table.options.meta as any;

      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-transparent"
            onClick={() =>
              meta?.onToggleFeatured?.(row.original.id, isFeatured)
            }
          >
            <Star
              className={`size-5 transition-colors ${
                isFeatured
                  ? "fill-accent text-accent "
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const id = row.original.id;
      return (
        <Link href={`/admin/dashboard/inventory/${id}`}>
          <Button variant="nav" className="border">
            <Eye className="size-4" />
          </Button>
        </Link>
      );
    },
  },
];
