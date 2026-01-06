"use client";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { clientMenu } from "@/lib/layoutMenus";
import Navbar from "@/components/client/layout/Navbar";
import Footer from "@/components/client/layout/Footer";
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
  const publicPages = ["/"];
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
            <nav className="sticky top-0 z-50 flex justify-between items-center pt-2 w-full p-4 bg-background border-b border-neutral-300  shadow dark:border-muted">
              {" "}
              <SidebarTrigger />
              {/* logo */}
              <Link className="" href="/">
                <h1 className="logo">GadyetHub</h1>
              </Link>
            </nav>

            <main className="w-full  min-h-screen">{children}</main>
          </div>
        </SidebarProvider>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
