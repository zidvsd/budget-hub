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
    <nav className="sticky top-0  border-b border-neutral-200 z-50">
      <div className="custom-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href={"/"} className="text-xl font-bold">
          MyLogo
        </Link>

        {/* Search */}
        <div className="self-center flex justify-center items-center w-full">
          <div className=" mx-4 md:w-1/2 lg:w-1/2">
            <Input placeholder="Search..." className="w-full " />
          </div>
          <div className="">
            <ModeToggle />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-8">
          <Link href={"/notifications"}>
            <Bell className="w-6 h-6 cursor-pointer" />
          </Link>
          <Link href={"/cart"}>
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
          </Link>
          <div className="flex items-center space-x-8">
            {role ? (
              <Link href={"/account"}>
                <User className="w-6 h-6 cursor-pointer" />
              </Link>
            ) : (
              <Link href={"/login"}>
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
