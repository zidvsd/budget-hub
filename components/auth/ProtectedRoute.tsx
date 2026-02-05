"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
export default function ProtectedRoute({
  children,
  publicPages = [],
}: {
  children: ReactNode;
  publicPages?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (publicPages.includes(pathname)) {
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = user?.app_metadata?.role || "guest";

      if (!user) {
        toast.error("Access Denied", { description: "Please login." });
        router.replace("/login");
        return;
      }

      // Role Logic
      if (pathname.startsWith("/admin") && role !== "admin") {
        toast.warning("Unauthorized", {
          description: "Admin access required.",
        });
        router.replace("/");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [pathname, router, publicPages]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner className="text-accent size-12" />
        <p className="text-accent text-lg font-medium">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
