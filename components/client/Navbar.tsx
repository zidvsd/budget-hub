"use client";

import { ShoppingCart, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { useAuthFromCookies } from "@/hooks/useAuth";
import { Button } from "../ui/button";
export default function Navbar() {
  const { role, loading } = useAuthFromCookies();
  if (loading) return null;
  return (
    <nav className="sticky top-0 bg-transparent border-b border-neutral-300 shadow dark:border-neutral-700 z-50">
      <div className="custom-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href={"/"} className="text-xl font-bold">
          GadyetHub
        </Link>

        {/* Search */}
        <div className="self-center flex justify-center items-center w-full">
          <div className=" mx-4 md:w-1/2 lg:w-1/2">
            <Input placeholder="Search..." className="w-full " />
          </div>
          <div className="w-fit">
            <ModeToggle variant="nav" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-8">
          <Link
            href="/notifications"
            className="group hover:bg-muted rounded-lg p-2 transition"
          >
            <Bell className="size-4 cursor-pointer transition group-hover:text-accent" />
          </Link>

          <Link
            href="/cart"
            className="group hover:bg-muted rounded-lg p-2 transition"
          >
            <ShoppingCart className="size-4 cursor-pointer transition   group-hover:text-accent" />
          </Link>
          <div className="flex items-center space-x-8">
            {role ? (
              <Link
                href="/account"
                className="group hover:bg-muted rounded-lg p-2 transition"
              >
                <User className="size-4 cursor-pointer transition group-hover:text-accent" />
              </Link>
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
