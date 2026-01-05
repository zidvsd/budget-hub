"use client";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminMenu } from "@/lib/layoutMenus";
import Link from "next/link";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar items={adminMenu} />
      <main className="w-full p-4 lg:p-6 max-w-[1440px]">
        <div className="flex justify-between">
          <SidebarTrigger />
          {/* logo */}
          <Link className="" href="/">
            <h1 className="logo">GadyetHub</h1>
          </Link>
        </div>
        <div className="mt-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
