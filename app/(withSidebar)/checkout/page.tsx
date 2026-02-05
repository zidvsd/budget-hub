"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import { EditProfileForm } from "@/components/client/forms/EditProfileForm";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { useUsers } from "@/store/useUsers";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { OrderItemsCarousel } from "@/components/client/OrderItemsCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/Empty";
import { Spinner } from "@/components/ui/spinner";
export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, loading: cartLoading } = useCart();
  const { users, loading: userLoading } = useUsers();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = users[0];
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (!cartLoading && items.length === 0 && !isProcessing) {
    router.push("/");
    return null;
  }
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderItemsPayload = items.map((item) => {
        // Look for the UUID in 'item.product.id' FIRST, then 'item.product_id'
        const actualProductId = item.product?.id || item.product_id;

        return {
          product_id: actualProductId,
          quantity: item.quantity,
          price: item.price,
        };
      });

      // 2. Client-side check: Don't even hit the API if a UUID is missing
      if (
        orderItemsPayload.some(
          (i) => !i.product_id || i.product_id === "undefined",
        )
      ) {
        throw new Error(
          "Some items are missing valid product IDs. Please refresh your cart.",
        );
      }

      const res = await fetch("/api/client/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_price: subtotal,
          order_items: orderItemsPayload,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to place order");
      toast.success("Order placed successfully!", {
        description: "You will receive an email confirmation shortly.",
      });
      router.push(`/orders/${result.data.id}`);
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (err: any) {
      console.error("CHECKOUT_ERROR:", err);
      toast.error("Checkout Failed", {
        description: err.message || "Please try again later.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="custom-container my-8">
      {/* Header - NOW ALWAYS VISIBLE */}
      <div className="flex items-center gap-8 mb-8">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <span className="text-muted-foreground">
            Review and place your order
          </span>
        </div>
      </div>

      {/* Conditional Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-8">
        {cartLoading || userLoading ? (
          /* SKELETON STATE*/
          <>
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Separator />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Separator />
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <Skeleton className="h-20 w-20 rounded-md" />
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Main Content */
          <>
            {/* Left Side: Shipping & Payment Info */}
            <div className="space-y-6 min-w-0">
              <div className="bg-card rounded-lg border p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <MapPin className="text-accent" size={20} />
                    <h2>Shipping Information</h2>
                  </div>
                  <EditProfileForm />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs uppercase text-muted-foreground font-bold">
                      Recipient
                    </span>
                    <p className="flex items-center gap-2 font-medium">
                      <User size={14} /> {currentUser?.first_name}{" "}
                      {currentUser?.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase text-muted-foreground font-bold">
                      Phone Number
                    </span>
                    <p className="flex items-center gap-2 font-medium">
                      <Phone size={14} /> {currentUser?.phone}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <span className="text-xs uppercase text-muted-foreground font-bold">
                      Delivery Address
                    </span>
                    <p className="font-medium">{currentUser?.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <CreditCard className="text-accent" size={20} />
                  <h2>Payment Method</h2>
                </div>
                <Separator />
                <div className="p-4 rounded-md border-2 border-accent bg-accent/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-4 border-accent" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="space-y-6 min-w-0">
              <div className="bg-card rounded-lg border p-6 shadow-md space-y-4 h-fit sticky top-8">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <ShoppingBag className="text-accent" size={20} />
                  <h2>Order Summary</h2>
                </div>
                <Separator />
                <div className="py-2">
                  <OrderItemsCarousel items={items} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal {items.length} items
                    </span>
                    <span>₱{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-accent">
                      ₱{formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-10 font-bold"
                  variant="accent"
                  disabled={isProcessing}
                  onClick={() => handlePlaceOrder()}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <Button
                  className="w-full h-10 font-bold"
                  variant="secondary"
                  onClick={() => router.push("/cart")}
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card p-8 rounded-xl border shadow-2xl flex flex-col items-center gap-4">
            <Spinner className="h-10 w-10 text-accent" />
            <div className="text-center">
              <h3 className="text-lg font-bold">Processing Order</h3>
              <p className="text-sm text-muted-foreground">
                Please do not refresh the page...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
