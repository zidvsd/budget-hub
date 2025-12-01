"use client";

import { useEffect, useState } from "react";

export function useAuthFromCookies() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookiesList = document.cookie.split("; ").reduce((acc, c) => {
      const [key, value] = c.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    setUserRole(cookiesList["role"] ?? null);
    setLoading(false);
  }, []);

  return { role: userRole, loading };
}
