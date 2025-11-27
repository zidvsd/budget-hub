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
      <main className="w-full p-6">
        <header></header>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
