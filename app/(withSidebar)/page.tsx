"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    if (!role) {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);
  if (loading) return <p>Checking session...</p>;
  if (!session) return null; // while redirecting

  return <p>Welcome, {session.user.email}!</p>;
}
