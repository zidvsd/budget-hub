"us";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { clientMenu } from "@/lib/layoutMenus";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="lg:hidden ">
      <AppSidebar items={clientMenu} />
      <SidebarTrigger />

      <main>{children}</main>
    </SidebarProvider>
  );
}
