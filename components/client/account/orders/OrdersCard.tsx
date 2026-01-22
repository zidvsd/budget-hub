"use client";

import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Assuming you use shadcn/ui
import { Order } from "@/lib/types/orders";
import { ChevronRight, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { orderStatusClasses } from "@/lib/styles/badgeClasses";
import { upperCaseFirstLetter } from "@/lib/utils";
import { truncateId, formatPrice, formatDate } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
interface OrdersCardProps {
  order: Order;
}
export default function OrdersCard({ order }: OrdersCardProps) {
  const statusStyle =
    orderStatusClasses[order.status.toLowerCase()] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-xl hover:scale-102 hover-utility border bg-transparent dark:bg-muted/70 p-6 transition-all hover:shadow-md hover-utility">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <ShoppingBag className="text-accent bg-muted p-2 size-12 rounded-xl" />

        {/* Order Details */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-none tracking-tight">
                Order#{truncateId(order.id)}
              </h3>
              <div className={`flex items-center gap-1.5  ${statusStyle}`}>
                <Clock className="size-4" />
                <span className="text-xs">
                  {upperCaseFirstLetter(order.status)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formatDate(order.created_at)}</span>
              </div>
              ·<span>{formatRelativeTime(order.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status & Action (Desktop) */}
      <div className="flex items-center gap-4">
        <div>
          <span className="text-accent">₱{formatPrice(order.total_price)}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      {/* Optional: Make the whole card clickable */}
      <a href={`/account/orders/${order.id}`} className="absolute inset-0">
        <span className="sr-only">View order {order.id}</span>
      </a>
    </div>
  );
}

// Helper component for the Badge logic
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Shipped: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    Delivered: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    Processing: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    Cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`border-none ${variants[status] || ""}`}
    >
      {status}
    </Badge>
  );
}
