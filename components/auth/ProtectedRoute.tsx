"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  publicPages?: string[];
}

export default function ProtectedRoute({ children, publicPages = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const cookiesList = document.cookie.split("; ").reduce((acc, c) => {
      const [key, value] = c.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const roleCookie = cookiesList["role"] || "guest";
    const currentPath = window.location.pathname;
    // If page is public, allow access
    if (publicPages.includes(currentPath)) return;

    if (roleCookie === "guest") {
      toast.error("Access Denied", {
        description: "Please login to access this page.",
      });
      router.replace("/login");
      return;
    }
    if (roleCookie !== "user") {
      toast.warning("Unauthorized", {
        description: "You do not have permission to view this section.",
      });
      router.replace("/");
      return;
    }
  }, [router, publicPages, pathname]);

  if (!isClient) return null;

  return <>{children}</>;
}
