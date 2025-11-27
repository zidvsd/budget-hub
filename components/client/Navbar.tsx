"use client";

import { ShoppingCart, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="sticky top-0  border-b border-neutral-200 z-50">
      <div className="custom-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href={"/"} className="text-xl font-bold">
          MyLogo
        </Link>

        {/* Search */}
        <div className=" mx-4 self-center md:w-1/2 lg:w-1/3">
          <Input placeholder="Search..." className="w-full " />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-8">
          <Link href={"/cart"}>
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
          </Link>

          <Link href={"/notifications"}>
            <Bell className="w-6 h-6 cursor-pointer" />
          </Link>
          <Link href={"/account"}>
            <User className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
