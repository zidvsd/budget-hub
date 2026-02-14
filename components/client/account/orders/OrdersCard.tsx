"use client";

import { ShoppingBag, ChevronRight, Clock, Calendar } from "lucide-react";
import { Order } from "@/lib/types/orders";
import Link from "next/link";
import { orderStatusClasses } from "@/lib/styles/badgeClasses";
import {
  upperCaseFirstLetter,
  truncateId,
  formatPrice,
  formatDate,
  formatRelativeTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface OrdersCardProps {
  order: Order;
}

export default function OrdersCard({ order }: OrdersCardProps) {
  const statusStyle =
    orderStatusClasses[order.status.toLowerCase()] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="group relative flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer hover:bg-muted/50 bg-transparent dark:bg-muted/70">
      {/* Left Section: The Notification-style Icon Wrapper */}
      <div className="shrink-0 p-2.5 rounded-full bg-accent/10 text-accent">
        <ShoppingBag className="size-5" />
      </div>

      <div className="flex flex-1 items-center justify-between gap-4 px-2">
        {/* LEFT COLUMN: ID & Date */}
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold leading-none text-foreground">
              Order #{truncateId(order.id)}
            </h3>

            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider",
                statusStyle,
              )}
            >
              {upperCaseFirstLetter(order.status)}
            </div>
          </div>

          <div className="flex items-center gap-x-2 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            <span className="opacity-50">•</span>
            <span>{formatRelativeTime(order.created_at)}</span>
          </div>
        </div>

        {/* CENTERED PRICE: Flex-shrink-0 keeps it from squishing */}
        <div className="flex items-center justify-center shrink-0">
          <span className="text-base font-bold text-accent whitespace-nowrap">
            ₱{formatPrice(order.total_price)}
          </span>
        </div>

        {/* RIGHT COLUMN: This is where your Arrow icon or "View" button usually sits */}
        {/* If you have a ChevronRight icon, put it here to act as the second "fixed col" */}
      </div>

      {/* Right Section: Subtle Chevron indicating clickability */}
      <div className="self-center ml-2">
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      {/* Clickable Link Overlay */}
      <Link href={`/orders/${order.id}`} className="absolute inset-0">
        <span className="sr-only">View order {order.id}</span>
      </Link>
    </div>
  );
}
