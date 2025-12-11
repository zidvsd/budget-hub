import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/types/orders";
import { User } from "@/lib/types/users";
import { formatDate, formatPrice, truncateId } from "@/lib/utils";
// Define allowed statuses for type safety
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
// Map statuses to colors
const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
      return user?.full_name ?? row.original.user_id;
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
        <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Placed",
    cell: ({ row }) => formatDate(row.original.created_at),
  },
];
