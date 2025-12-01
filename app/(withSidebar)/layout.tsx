"use client";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { clientMenu } from "@/lib/layoutMenus";
import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publicPages = ["/", "/category", "/products/category"];
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
          <SidebarTrigger />
          <main className="w-full  min-h-screen">{children}</main>
        </SidebarProvider>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
