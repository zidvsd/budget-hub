"use client";
import { useUsers } from "@/store/useUsers";
import { useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { ShieldUser, UserRound, UserSquare2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
export default function page() {
  const { fetchUsers, users, loading: usersLoading } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalUsers = users.length;
  const totalAdmins = users.filter((user) => user.role === "admin").length;
  const totalCustomers = users.filter((user) => user.role === "user").length;

  return (
    <div>
      {usersLoading ? (
        <>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </>
      ) : (
        <>
          <h1 className="page-heading">Users</h1>
          <p className="page-subheading">
            View and manage registered users Total Users
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
            <StatCard
              title="Total Users"
              icon={<UserSquare2 className="size-6" />}
              stat={totalUsers}
            />
            <StatCard
              title="Admin"
              icon={<ShieldUser className="size-6" />}
              stat={totalAdmins}
            />
            <StatCard
              title="Customers"
              icon={<UserRound className="size-6" />}
              stat={totalCustomers}
            />
          </div>
        </>
      )}
    </div>
  );
}
