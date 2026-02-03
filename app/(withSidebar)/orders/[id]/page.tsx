"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Phone,
  CreditCard,
  Copy,
} from "lucide-react";
import { useUsers } from "@/store/useUsers";
import { useOrders } from "@/store/useOrders";
import { useProducts } from "@/store/useProducts";
import {
  formatDateFull,
  formatPrice,
  formatTime,
  truncateId,
} from "@/lib/utils";
import { OrderItemsCarousel } from "@/components/client/OrderItemsCarousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadCrumb } from "@/components/client/BreadCrumb";
import { Button } from "@/components/ui/button";
import { orderStatusClasses } from "@/lib/styles/badgeClasses";
import TrackStatusOrder from "@/components/client/TrackStatusOrder";
import OrderStatusBadge from "@/components/client/OrderStatusBadge";
import { toast } from "sonner";
import NotFound from "@/app/not-found";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { users, fetchUsers, loading: usersLoading } = useUsers();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { products, fetchProducts, loading: productsLoading } = useProducts();

  const [isTruncated, setIsTruncated] = useState(true);

  const orderId = params.id as string;
  const order = orders.find((o) => o.id === orderId);

  // Find the specific user associated with this order
  const customer = users.find((u) => u.id === order?.user_id) || users[0];

  const loading = usersLoading || ordersLoading || productsLoading;

  useEffect(() => {
    fetchUsers();
    fetchOrders(orderId, true);
    fetchProducts();
  }, [orderId, fetchOrders, fetchUsers, fetchProducts]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl my-8 px-4 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!order) return <NotFound />;

  const enrichedItems = order?.order_items?.map((item: any) => {
    // Ensure we match IDs regardless of type (string vs number)
    const productData = products.find(
      (p) => String(p.id) === String(item.product_id),
    );

    return {
      ...item,
      // We nest the data inside a 'product' object to satisfy the carousel's requirements
      product: {
        ...item.product, // Keep existing data if any
        name: productData?.name || item.product?.name || "Unknown Product",
        image_path:
          productData?.image_path ||
          item.product?.image_path ||
          "/placeholder.png",
      },
    };
  });

  const breadcrumbLinks = [
    { label: "Orders", href: "/account?tab=orders" },
    { label: `Order #${truncateId(orderId)}` },
  ];

  return (
    <div className="mx-auto max-w-5xl mt-8 pb-20 px-4">
      <BreadCrumb links={breadcrumbLinks} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-6 w-full">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between w-full gap-4">
              {/* Left Side: ID and Copy Button */}
              <div className="flex items-center gap-3">
                <h1
                  className="text-2xl font-bold cursor-pointer hover:text-accent transition-colors flex items-center gap-2"
                  onClick={() => setIsTruncated(!isTruncated)}
                >
                  Order #{isTruncated ? truncateId(orderId) : orderId}
                  <span className="text-muted-foreground font-normal text-xs">
                    (click to toggle)
                  </span>
                </h1>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopyId(orderId)}
                >
                  <Copy size={14} />
                </Button>
              </div>

              {/* Right Side: Status Badge */}
              <span
                className={`${
                  orderStatusClasses[order.status.toLowerCase()] ||
                  orderStatusClasses.pending
                } whitespace-nowrap`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Placed on {formatDateFull(order.created_at)} at{" "}
              {formatTime(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <TrackStatusOrder status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Totals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Package size={20} className="text-accent" />
              Order Items
            </h2>
            <div className="mt-4">
              <OrderItemsCarousel items={enrichedItems} />
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₱{formatPrice(order.total_price)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl text-accent pt-2">
                <span>Total Amount</span>
                <span>₱{formatPrice(order.total_price)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Status Card */}
        <div className="space-y-6">
          {/* Customer & Shipping Info */}
          <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MapPin size={20} className="text-accent" />
              Delivery Details
            </h2>
            <Separator />
            <div className="space-y-4">
              <div className="flex gap-3">
                <User
                  size={18}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <div className="text-sm">
                  <p className="font-semibold">Recipient</p>
                  <p className="text-muted-foreground">
                    {customer?.first_name} {customer?.last_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone
                  size={18}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <div className="text-sm">
                  <p className="font-semibold">Contact Number</p>
                  <p className="text-muted-foreground">
                    {customer?.phone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin
                  size={18}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <div className="text-sm">
                  <p className="font-semibold">Shipping Address</p>
                  <p className="text-muted-foreground">
                    {customer?.address || "No address provided"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard
                  size={18}
                  className="text-muted-foreground shrink-0 mt-0.5"
                />
                <div className="text-sm">
                  <p className="font-semibold">Payment Method</p>
                  <p className="text-muted-foreground">Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Status Message Card */}
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
}
