"use client";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminMenu } from "@/lib/layoutMenus";

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
        </div>
        <div className="mt-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
