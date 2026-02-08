"use client";

import React from "react";
import {
  Home,
  LayoutGrid,
  Bell,
  Package,
  User,
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Users,
  ChartColumnIncreasing,
  LogIn,
} from "lucide-react";
import { MenuItem, IconName, clientMenu } from "@/lib/layoutMenus";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoutButton from "./ui/logout";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";

// 1. Map the string names to the actual components for Tree Shaking
const iconMap: Record<IconName, React.ElementType> = {
  Home,
  LayoutGrid,
  Bell,
  Package,
  User,
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Users,
  ChartColumnIncreasing,
};

interface AppSidebarProps {
  hide?: boolean;
  items?: MenuItem[];
}

export function AppSidebar({ hide, items = clientMenu }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { role } = useAuth();

  // If hide is true, we return null so the sidebar doesn't render at all
  if (hide) return null;

  return (
    <Sidebar collapsible="icon" className="flex flex-col h-full">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const IconComponent = iconMap[item.icon];

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url}>
                        {IconComponent && <IconComponent className="size-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* BOTTOM SECTION */}
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Toggle Theme">
                    <ModeToggle showText={!isCollapsed} />
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    {role ? (
                      <LogoutButton showText={!isCollapsed} />
                    ) : (
                      <Link href="/login">
                        <LogIn className="size-4" />
                        {!isCollapsed && <span>Sign In</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
