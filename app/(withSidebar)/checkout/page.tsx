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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { users } = useUsers();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = users[0];
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Logic for creating order in DB goes here
      toast.success("Order placed successfully!", {
        description: "Thank you for your purchase.",
      });
      clearCart();
      router.push("/account?tab=orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="custom-container my-8">
      {/* Header */}
      <div className="flex items-center gap-8 mb-8">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <span className="text-muted-foreground">
            Review and place your order
          </span>
        </div>
      </div>

      {/* Grid: 1 column on mobile, 60/40 split on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-8">
        {/* Left Side: Shipping & Payment Info */}
        <div className="space-y-6 min-w-0">
          {/* Shipping Details Card */}
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

          {/* Payment Method Card */}
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
              <span className="text-xs text-muted-foreground">Default</span>
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

            {/* Vertical Items Carousel */}
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-accent">₱{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Button
              className="w-full h-10 text-lg font-bold"
              variant="accent"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              <CreditCard className="size-6" />
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>

            <Button
              className="w-full h-10 text-lg font-bold"
              variant="secondary"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              <ShoppingCart className="size-6" />
              Back to Cart
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              Your transaction is encrypted and secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
