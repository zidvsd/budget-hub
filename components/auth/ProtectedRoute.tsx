"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  publicPages?: string[];
}

export default function ProtectedRoute({ children, publicPages = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  useEffect(() => {
    if (publicPages.includes(pathname)) {
      setIsAuthorized(true);
      setLoading(false);
      return;
    }

    const cookiesList = document.cookie.split("; ").reduce((acc, c) => {
      const [key, value] = c.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const roleCookie = cookiesList["role"] || "guest";

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
    setIsAuthorized(true);
    setLoading(false);
  }, [router, publicPages, pathname]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner className="text-accent size-12" />
        <p className="text-accent text-lg font-medium">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
