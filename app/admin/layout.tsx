import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-6">
        <header>
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        </header>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
