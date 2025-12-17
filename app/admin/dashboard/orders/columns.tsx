"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/types/orders";
import { User } from "@/lib/types/users";
import { formatDate, formatPrice, truncateId } from "@/lib/utils";
import Link from "next/link";
import { Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Define allowed statuses for type safety
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Map statuses to colors
export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Define the structure for table metadata (for updating status)
type OrderTableMeta = {
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
};

export const columns = (users: User[]): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      return truncateId(row.original.id);
    },
  },
  {
    accessorKey: "user_id",
    header: "Customer",
    cell: ({ row }) => {
      const user = users.find((u) => u.id === row.original.user_id);
      // Fallback to user_id if user is not found
      return user?.full_name ?? truncateId(row.original.user_id);
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
      const colorClass = statusColors[status] ?? "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}
        >
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
  // --- New Actions Column ---
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const orderId = row.original.id;
      const currentStatus = row.original.status as OrderStatus;
      // Get the meta object from the table options
      const meta = table.options.meta as OrderTableMeta | undefined;

      // Define the available status options
      const statusOptions: OrderStatus[] = [
        "pending",
        "processing",
        "completed",
        "cancelled",
      ];

      return (
        <div className="flex items-center gap-2">
          {/* 1. View Order Button (Eye Icon) */}
          <Link href={`/admin/dashboard/orders/${orderId}`} passHref>
            <Button
              variant={"nav"}
              className="border hover:border-muted"
              size="icon"
              title="View Order Details"
            >
              <Eye className="size-4 " />
            </Button>
          </Link>

          {/* 2. Status Change Dropdown */}
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
                  // Disable the item if it's the current status
                  disabled={status === currentStatus}
                  onClick={() => {
                    // Call the handler function from the meta prop
                    meta?.onStatusChange(orderId, status);
                  }}
                >
                  {/* Optional: Add visual indicator for the current status */}
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
