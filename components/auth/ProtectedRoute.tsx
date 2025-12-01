"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  role?: "user" | "admin";
  publicPages?: string[];
}

export default function ProtectedRoute({
  children,
  role,
  publicPages = [],
}: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const cookiesList = document.cookie.split("; ").reduce((acc, c) => {
      const [key, value] = c.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookiesList["access-token"];
    const roleCookie = cookiesList["role"];

    // If page is public, allow access
    if (publicPages.includes(window.location.pathname)) {
      return;
    }

    if (!token) {
      router.push("/login");
      return;
    }

    if (role && roleCookie !== role) {
      router.push("/"); // redirect if role mismatch
    }
  }, [router, role, publicPages]);

  if (!isClient) return null; // avoid SSR mismatch

  return <>{children}</>;
}
