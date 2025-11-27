"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import LogoutButton from "./ui/logout";
import { clientMenu } from "@/lib/layoutMenus";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
// Menu items.

interface AppSidebarProps {
  hide?: boolean;
  items: {
    title: string;
    url: string;
    icon: keyof typeof LucideIcons;
  }[];
}
export function AppSidebar({ hide, items = clientMenu }: AppSidebarProps) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar
      collapsible="icon"
      className={`${
        hide ? "lg:hidden" : null
      } flex flex-col justify-between h-full`}
    >
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]">
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const IconComponent = LucideIcons[
                  item.icon as keyof typeof LucideIcons
                ] as LucideIcon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        onClick={toggleSidebar}
                        href={item.url}
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout button at the bottom */}
      <div className={`${isCollapsed ? "p-0" : "p-2"}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <LogoutButton showText={!isCollapsed} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
