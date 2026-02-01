"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useUsers } from "@/store/useUsers";
import { useEffect, useState } from "react";
import {
  Phone,
  Calendar,
  Pencil,
  ShoppingBag,
  TrendingUp,
  Mail,
  MapPin,
  Copy,
  KeyRound,
} from "lucide-react";
import Image from "next/image";
import { getUserSession } from "@/lib/supabase/session";
import { useOrders } from "@/store/useOrders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getFirstChar, formatPrice, formatDateFull } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import { EditProfileForm } from "../../forms/EditProfileForm";
import { truncateId } from "@/lib/utils";
import { toast } from "sonner";
export default function ProfileTab() {
  const { users, fetchUsers, loading: userLoading } = useUsers();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toggleTruncate, setToggleTruncate] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const session = await getUserSession();
      setUserEmail(session?.user?.email ?? null);
      setAuthLoading(false);
    };

    loadSession();
    fetchUsers();
    fetchOrders();
  }, [fetchUsers, fetchOrders]);
  const currentUser = users[0] ?? null;

  const handleCopyId = () => {
    if (currentUser?.id) {
      navigator.clipboard.writeText(currentUser.id);
      toast.success("Copied ID to clipboard!");
    }
  };

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );
  const totalSpent = completedOrders.reduce(
    (acc, order) => acc + order.total_price,
    0,
  );
  if (userLoading || ordersLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        {/* Profile Header Skeleton */}
        <Card className="overflow-hidden">
          <CardContent className="flex flex-row items-start gap-6 p-6">
            {/* Avatar Skeleton */}
            <Skeleton className="w-28 h-28 rounded-full shrink-0" />

            {/* User Info Skeleton */}
            <div className="flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-8 w-1/3" /> {/* Name */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" /> {/* Email */}
                  <Skeleton className="h-4 w-1/5" /> {/* Phone */}
                  <Skeleton className="h-4 w-1/3" /> {/* Address */}
                  <Skeleton className="h-4 w-1/2" /> {/* Date */}
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-md" /> {/* Edit Button */}
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))}
        </div>

        {/* Account Details Skeleton */}
        <Card className="mt-6">
          <CardContent className="py-6 px-6 space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>

            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-end">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                  {i > 2 && <Skeleton className="h-8 w-20" />}{" "}
                  {/* Copy/Update Buttons */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <Card className={cn("group  relative overflow-hidden ")}>
        <CardContent className="flex flex-row items-start gap-6 p-6">
          {/* Avatar */}
          <div className="relative w-28 h-28 shrink-0">
            <div className="relative w-full h-full rounded-full border-4 border-accent/20 bg-muted overflow-hidden items-center justify-center flex">
              {currentUser?.avatar_url ? (
                <Image
                  key={currentUser?.avatar_url}
                  src={currentUser?.avatar_url}
                  alt="avatar"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="uppercase text-accent text-4xl font-bold">
                  <span className="uppercase text-accent text-4xl font-bold">
                    {getFirstChar(currentUser?.first_name ?? "")}
                    {getFirstChar(currentUser?.last_name ?? "")}
                  </span>
                </span>
              )}
            </div>
          </div>
          {/* User Info */}
          <div className="flex flex-col justify-between flex-1 space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                {currentUser?.first_name ?? "N/A"}{" "}
                {currentUser?.last_name ?? ""}
              </CardTitle>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {currentUser?.email ?? "Not provided"}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {currentUser?.phone ?? "Not set"}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {currentUser?.address ?? "Not set"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Member since {formatDateFull(currentUser?.created_at ?? "")}
              </div>
            </div>

            {/* Edit Profile Button */}

            <EditProfileForm />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          title="Total Orders"
          icon={<ShoppingBag />}
          stat={orders.length}
          description="All time orders"
        />{" "}
        <StatCard
          title="Total Spent"
          icon={<TrendingUp />}
          stat={`₱${formatPrice(totalSpent)}`}
          description="Lifetime purchases"
        />{" "}
        <StatCard
          title="Completed"
          icon={<ShoppingBag />}
          stat={completedOrders.length}
          description="Successful orders"
        />
      </div>
      {/* account details*/}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 mt-6",
        )}
      >
        <CardContent className="py-4 px-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-accent-foreground">
              Account Details
            </h2>
            <p className="text-sm text-zinc-500">
              Your account information and preferences
            </p>
          </div>

          <div className="flex flex-row items-start gap-8">
            {/* User Info Grid to match the image spacing */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-xs font-medium text-foreground-accent uppercase tracking-wider mb-1">
                  Full Name
                </p>
                <p className="text-lg text-neutral-400">
                  {currentUser?.first_name ?? "N/A"}{" "}
                  {currentUser?.last_name ?? ""}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground-accent uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <span className="text-[10px] bg-green-500 text-white px-4 py-0.5 rounded-full border ">
                    Verified
                  </span>
                </div>
                <p className="text-lg text-neutral-400">
                  {currentUser?.email ?? "Not provided"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-12">
                  <div>
                    <p className="text-xs font-medium text-foreground-accent uppercase tracking-wider mb-1">
                      Account ID
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-xs text-neutral-400 italic cursor-pointer hover:text-accent transition-colors"
                        onClick={() => setToggleTruncate(!toggleTruncate)}
                      >
                        {/* Toggle between truncated and full ID */}
                        {toggleTruncate
                          ? `${truncateId(currentUser?.id ?? "unknown")}`
                          : (currentUser?.id ?? "unknown")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => setToggleTruncate(!toggleTruncate)}
                      >
                        {toggleTruncate ? "Show" : "Hide"}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-xs"
                  onClick={() => handleCopyId()}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground-accent uppercase tracking-wider mb-1">
                      Password
                    </p>
                    <p className="text-lg text-neutral-400">********</p>
                  </div>
                  <Button className="text-xs" variant={"ghost"} size={"sm"}>
                    <KeyRound className="size-3.5" />
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
