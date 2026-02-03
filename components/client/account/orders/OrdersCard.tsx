"use client";

import { ShoppingBag } from "lucide-react";
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
    <div className="group relative flex flex-col gap-4 rounded-xl border bg-transparent dark:bg-muted/70 p-4 sm:p-6 transition-all hover:scale-[1.01] hover:shadow-md md:flex-row md:items-center md:justify-between">
      {/* Left Section: Icon + Details */}
      <div className="flex items-start gap-4 md:items-center">
        {/* Product Image - Hidden on very small screens to save space if you prefer */}
        <div className="shrink-0">
          <ShoppingBag className="text-accent bg-muted p-2 size-12 rounded-xl" />
        </div>

        {/* Order Details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold leading-none tracking-tight">
              Order #{truncateId(order.id)}
            </h3>
            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${statusStyle}`}
            >
              <Clock className="size-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {upperCaseFirstLetter(order.status)}
              </span>
            </div>
          </div>

          {/* Date & Relative Time */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            <span className="hidden sm:inline opacity-50">•</span>
            <span>{formatRelativeTime(order.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Right Section: Price & Chevron */}
      <div className="flex items-center justify-between border-t pt-3 md:border-none md:pt-0 md:justify-end md:gap-4">
        <div className="font-bold text-lg md:text-base">
          <span className="text-accent">₱{formatPrice(order.total_price)}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      {/* Clickable Link Overlay */}
      <Link href={`/orders/${order.id}`} className="absolute inset-0">
        <span className="sr-only">View order {order.id}</span>
      </Link>
    </div>
  );
}
