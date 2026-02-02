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
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      orientation="vertical"
      className="w-full"
      // Optional: Add Autoplay if you want it to move on its own
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      {/* Set a fixed height for the viewable area (e.g., 200px) */}
      <CarouselContent className="-mt-1 h-[200px]">
        {items.map((item) => (
          <CarouselItem key={item.id} className="select-none pt-1 basis-1/3">
            <div className="p-1">
              <div className="flex items-center gap-3 p-2 rounded-md border bg-muted/30">
                <div className="relative h-12 w-12 shrink-0">
                  <Link href={`/products/${item.product_id}`}>
                    <Image
                      unoptimized
                      src={item.product.image_path ?? "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="rounded object-cover  border bg-background"
                    />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product_id}`}
                    className="hover-utility hover:text-accent"
                  >
                    {" "}
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
