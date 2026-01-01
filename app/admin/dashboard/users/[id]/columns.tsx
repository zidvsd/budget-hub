"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Order } from "@/lib/types/orders";
import { orderStatusClasses } from "@/lib/styles/badgeClasses";
import { truncateId } from "@/lib/utils";
import { toast } from "sonner";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Copy ID",
    cell: ({ row }) => {
      const id = row.original.id;

      const handleCopy = async () => {
        await navigator.clipboard.writeText(id);
        toast.success("Order ID copied");
      };

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{truncateId(id)}</span>
          <Button
            variant="nav"
            onClick={handleCopy}
            className="border dark:border-none"
            aria-label="Copy order ID"
          >
            <Copy className="h-4 w-4 opacity-70 hover:opacity-100" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClass = orderStatusClasses[status] ?? "";
      return (
        <span className={`capitalize ${statusClass}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    cell: ({ row }) => `₱${row.original.total_price}`,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "view",
    header: () => <div className="text-center">View</div>,
    cell: ({ row }) => (
      <Link
        className="flex justify-center"
        href={`/admin/dashboard/orders/${row.original.id}`}
      >
        <Button variant="nav" size="icon" className="border">
          <Eye className="size-4" />
        </Button>
      </Link>
    ),
  },
];
