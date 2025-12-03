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
          <main className="custom-container min-h-screen">{children}</main>
        </div>

        {/* Mobile/Tablet: Sidebar + Content */}
        <SidebarProvider className="md:hidden">
          <AppSidebar items={clientMenu} />
          <div className="flex flex-col w-full custom-container">
            <div className="flex justify-between items-center">
              <SidebarTrigger />
              <h1>Logo</h1>
            </div>

            <main className="w-full  min-h-screen">{children}</main>
          </div>
        </SidebarProvider>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
