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
import { formatPrice } from "@/lib/utils";
import { useUsers } from "@/store/useUsers";
import { EditProfileForm } from "@/components/client/forms/EditProfileForm";
import { useState } from "react";
import Link from "next/link";
export default function Page() {
  const { items, fetchCart, loading, updateQuantity, removeFromCart } =
    useCart();
  const router = useRouter();
  const { users } = useUsers();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleCheckOut = () => {
    const currentUser = users[0];
    const missingInfo =
      !currentUser?.address ||
      !currentUser?.phone ||
      !currentUser?.first_name ||
      !currentUser.last_name;
    if (missingInfo) {
      toast.error("Please complete your profile details before checking out", {
        description: "We need your and phone number for delivery",
      });
      setShowProfileModal(true);
      return;
    }
    router.push("/checkout");
  };
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
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

      {/* Show profile form modal if there is missing info */}
      {showProfileModal && (
        <EditProfileForm
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
        />
      )}
      {/* Content */}
      {(loading || items.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 h-fit rounded-lg border overflow-hidden shadow-md">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border-b bg-card"
                >
                  <Skeleton className="h-[72px] w-[72px] rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[30%]" />
                    <div className="flex gap-4 pt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
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
                    <Link
                      href={`/products/${item.product_id}`}
                      className="shrink-0"
                    >
                      <div className="relative h-[72px] w-[72px] overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={item.product.image_path ?? "/placeholder.png"}
                          alt={item.product.name}
                          fill
                          sizes="72px"
                          className="object-cover hover-utility hover:scale-110"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 space-y-2">
                      <Link href={`/products/${item.product_id}`}>
                        <h3 className="font-semibold hover-utility hover:text-accent">
                          {item.product.name}
                        </h3>
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        ₱{formatPrice(item.price)} each
                      </span>

                      <div className="flex items-center gap-4 mt-2">
                        <QuantityInput
                          value={item.quantity}
                          onChange={async (newQty) => {
                            try {
                              await updateQuantity(item.id, newQty);
                            } catch (err: any) {
                              toast.error(
                                err.message || "Failed to update quantity",
                              );
                            }
                          }}
                        />

                        <span className="font-semibold text-accent">
                          ₱{formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="bg-transparent text-destructive hover:bg-destructive/20 "
                      onClick={async () => {
                        try {
                          await removeFromCart(item.id);
                        } catch (err: any) {
                          toast.error(err.message || "Failed to remove item");
                        }
                      }}
                    >
                      <Trash size={18} />
                      <span className="text-destructive">Remove</span>
                    </Button>
                  </div>
                );
              })}
          </div>

          <div className="min-w-0">
            <div className="bg-card rounded-md border p-6 h-fit space-y-4 shadow-md sticky top-8">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Order Summary</h2>

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₱{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-500 font-bold">Free</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-accent">
                      ₱{formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Truck size={14} /> Free delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={14} /> Secure checkout
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleCheckOut()}
                      variant="accent"
                      className="w-full"
                    >
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
                  {/* ... rest of your summary content ... */}
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
        </div>
      )}
    </div>
  );
}
