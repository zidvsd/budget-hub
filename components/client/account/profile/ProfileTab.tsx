"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useUsers } from "@/store/useUsers";
import { useEffect, useState, useMemo } from "react";
import {
  Phone,
  Calendar,
  Settings,
  ShoppingBag,
  TrendingUp,
  CircleCheck,
  Pencil,
  Mail,
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
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );
  const totalSpent = completedOrders.reduce(
    (acc, order) => acc + order.total_price,
    0,
  );
  if (userLoading || ordersLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton className="w-full h-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
        <Skeleton className="w-full h-48" />
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
              {currentUser.avatar_url ? (
                <Image
                  key={currentUser.avatar_url}
                  src={currentUser.avatar_url}
                  alt="avatar"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="uppercase text-accent text-4xl font-bold">
                  {getFirstChar(currentUser.first_name)}
                  {getFirstChar(currentUser.last_name)}
                </span>
              )}
            </div>
          </div>
          {/* User Info */}
          <div className="flex flex-col justify-between flex-1 space-y-4">
            <div className="space-y-2">
              {/* Name */}
              <CardTitle className="text-2xl  font-semibold text-foreground">
                {currentUser?.first_name} {currentUser?.last_name}
              </CardTitle>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {currentUser?.email}
              </div>
              {/* Phone */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {currentUser?.phone ? currentUser?.phone : "Not set"}
              </div>
              {/* Member since */}
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
            <h2 className="text-xl font-semibold text-zinc-100">
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
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Full Name
                </p>
                <p className="text-lg text-zinc-200">
                  {currentUser?.first_name}
                  {currentUser?.last_name}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <span className="text-[10px] bg-green-500 text-white px-4 py-1 rounded-full border ">
                    Verified
                  </span>
                </div>
                <p className="text-lg text-zinc-200">{currentUser?.email}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-12">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                      Account ID
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-xs text-zinc-500 italic cursor-pointer hover:text-accent transition-colors"
                        onClick={() => setToggleTruncate(!toggleTruncate)}
                      >
                        {/* Toggle between truncated and full ID */}
                        {toggleTruncate
                          ? `${truncateId(currentUser?.id)}...`
                          : currentUser?.id}
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
                <Button variant={"ghost"}>Copy</Button>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                      Password
                    </p>
                    <p className="text-lg text-zinc-200">********</p>
                  </div>
                  <Button variant={"ghost"}>Change</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
