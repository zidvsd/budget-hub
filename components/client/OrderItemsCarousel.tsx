"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CartItem } from "@/lib/types/cart";
import Link from "next/link";

export function OrderItemsCarousel({ items }: { items: CartItem[] }) {
  // If there's only 1 or 2 items, we disable the loop and autoplay
  // to prevent weird "snapping" behavior.
  const isScrollable = items.length > 2;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: isScrollable,
      }}
      orientation="vertical"
      className="w-full"
      plugins={
        isScrollable
          ? [
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]
          : []
      }
    >
      <CarouselContent className="-mt-1 h-[220px]">
        {items.map((item, index) => (
          <CarouselItem
            key={`${item.id}-${index}`}
            className="select-none pt-1 basis-1/3" // basis-1/3 fits 3 items in 220px
          >
            <div className="p-1">
              <div className="flex items-center gap-3 p-2 rounded-md border bg-muted/30">
                <div className="relative h-12 w-12 shrink-0">
                  <Link href={`/products/${item.product_id}`}>
                    <Image
                      unoptimized
                      src={item.product.image_path ?? "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="rounded object-cover border bg-background"
                    />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="hover:text-accent transition-colors"
                  >
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-semibold text-accent">
                  ₱{formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
