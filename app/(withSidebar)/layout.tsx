"use client";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { clientMenu } from "@/lib/layoutMenus";
import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useUsers } from "@/store/useUsers";
import { useEffect } from "react";
import Link from "next/link";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const publicPages = ["/", "/category", "/products"];
  return (
    <>
      <ProtectedRoute role="user" publicPages={publicPages}>
        {/* Desktop: Navbar + Content */}
        <div className="hidden md:block">
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </div>

        {/* Mobile/Tablet: Sidebar + Content */}
        <SidebarProvider className="md:hidden">
          <AppSidebar items={clientMenu} />
          <div className="flex flex-col w-full ">
            <div className="flex justify-between items-center pt-2 w-full p-2">
              <SidebarTrigger />
              {/* logo */}
              <Link className="" href="/">
                <h1 className="logo">GadyetHub</h1>
              </Link>
            </div>

            <main className="w-full  min-h-screen">{children}</main>
          </div>
        </SidebarProvider>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
