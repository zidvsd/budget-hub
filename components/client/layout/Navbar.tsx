"use client";

import { ShoppingCart, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthFromCookies } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/ui/logout";
import { ModeToggle } from "@/components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/store/useUsers";
import { User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { getFirstName } from "@/lib/utils";
export default function Navbar() {
  const { role, loading: AuthLoading } = useAuthFromCookies();
  const { users, loading: userLoading, fetchUsers } = useUsers();
  const loading = AuthLoading || userLoading;
  useEffect(() => {
    if (!users?.length) fetchUsers(); // fetch only if empty
  }, [users, fetchUsers]);
  return (
    <nav className="sticky top-0 bg-background border-b border-neutral-300 shadow dark:border-neutral-700 z-50">
      <div className="custom-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="logo">GadyetHu</h1>
        </Link>

        {/* Search */}
        <div className="self-center flex justify-center items-center w-full">
          <div className="mx-4 md:w-1/2 lg:w-1/2">
            <Input placeholder="Search..." className="w-full " />
          </div>
          <div className="w-fit">
            <ModeToggle variant="nav" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-8">
          {role && (
            <>
              <Link
                href="/notifications"
                className="group hover:bg-muted rounded-lg p-2 hover-utility"
              >
                <Bell className="size-4 cursor-pointer transition group-hover:text-accent" />
              </Link>
              <Link
                href="/cart"
                className="group hover:bg-muted rounded-lg p-2 hover-utility"
              >
                <ShoppingCart className="size-4 cursor-pointer hover-utility group-hover:text-accent" />
              </Link>{" "}
            </>
          )}

          <div className="flex items-center">
            {role ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group hover:bg-muted  cursor-pointer rounded-lg p-2 hover-utility">
                    <User className="size-4 cursor-pointer hover-utility group-hover:text-accent" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      href="/account"
                      className="group flex items-center py-1.5 gap-2 w-full justify-center text-center hover:text-white transition"
                    >
                      <UserIcon className="w-4 h-4 shrink-0 text-black dark:text-white group-hover:text-white transition" />
                      {loading
                        ? "Loading..."
                        : users && users.length > 0
                        ? getFirstName(users[0].full_name)
                        : "Account"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="w-fit ">
                      <LogoutButton showText={true} />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={"/login"}>
                <Button variant="accent">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
