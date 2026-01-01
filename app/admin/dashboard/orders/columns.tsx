"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/types/orders";
import { User } from "@/lib/types/users";
import { formatDate, formatPrice, truncateId } from "@/lib/utils";
import Link from "next/link";
import { Copy, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { orderStatusClasses } from "@/lib/styles/badgeClasses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Define allowed statuses
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Table meta for status change callback
type OrderTableMeta = {
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
};

export const columns = (users: User[]): ColumnDef<Order>[] => [
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
    accessorKey: "user_id",
    header: "Customer",
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.user_id);
      return (
        <Link
          className="hover-utility hover:text-accent"
          href={`/admin/dashboard/users/${row.original.user_id}`}
          passHref
        >
          {user?.full_name ?? truncateId(row.original.user_id)}
        </Link>
      );
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    cell: ({ row }) => `${formatPrice(row.original.total_price)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as OrderStatus;
      const statusClass =
        orderStatusClasses[status] ??
        "px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium";

      return (
        <span className={statusClass}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Placed",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const orderId = row.original.id;
      const currentStatus = row.original.status as OrderStatus;
      const meta = table.options.meta as OrderTableMeta | undefined;

      const statusOptions: OrderStatus[] = [
        "pending",
        "processing",
        "completed",
        "cancelled",
      ];

      return (
        <div className="flex items-center gap-2">
          {/* View Order */}
          <Link href={`/admin/dashboard/orders/${orderId}`} passHref>
            <Button variant="nav" className="border" size="icon">
              <Eye className="size-4" />
            </Button>
          </Link>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="nav"
                className="border w-32 justify-between flex"
              >
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <span className="block px-2 py-1 text-xs text-muted-foreground">
                Update Status
              </span>
              <DropdownMenuSeparator />
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={status === currentStatus}
                  onClick={() => meta?.onStatusChange(orderId, status)}
                >
                  {status === currentStatus && "✓ "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
