"use client";

import { ArrowLeft, ShoppingCart, Trash, Shield, Truck } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/Empty";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { QuantityInput } from "@/components/client/QuantityInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const { items, fetchCart, loading, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="custom-container my-8">
      {/* Header */}
      <div className="flex items-center gap-8 mb-8">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-muted-foreground">
            {items.length} items in your cart
          </span>
        </div>
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added any items yet."
        />
      )}

      {/* Content */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 rounded-lg border overflow-hidden">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}

            {!loading &&
              items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 border-b bg-card p-4
                      ${isFirst ? "rounded-t-lg" : ""}
                      ${isLast ? "rounded-b-lg border-b-0" : ""}`}
                  >
                    <Image
                      src={item.product.image_path ?? "/placeholder.png"}
                      alt={item.product.name}
                      width={72}
                      height={72}
                      className="rounded-md"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        ₱{item.price.toFixed(2)} each
                      </span>

                      <div className="flex items-center gap-4">
                        <QuantityInput
                          value={item.quantity}
                          onChange={async (newQty) => {
                            try {
                              await updateQuantity(item.id, newQty);
                            } catch (err: any) {
                              toast.error(
                                err.message || "Failed to update quantity"
                              );
                            }
                          }}
                        />

                        <span className="font-semibold">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={async () => {
                          try {
                            await removeFromCart(item.id);
                          } catch (err: any) {
                            toast.error(err.message || "Failed to remove item");
                          }
                        }}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-md border p-6 h-fit space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield size={14} /> Secure checkout
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} /> Free delivery
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="accent" className="w-full">
                Proceed to Checkout
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
