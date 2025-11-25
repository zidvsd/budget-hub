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
    let mounted = true;

    // 1️⃣ Check initial session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        router.push("/login"); // redirect if not logged in
      } else {
        setSession(session);
      }
      setLoading(false);
    };

    checkSession();

    // 2️⃣ Listen for login/logout events
    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
        setSession(null);
      } else {
        setSession(session);
      }
    });

    // unsubscribe properly
    return () => {
      mounted = false;
      listener.data.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <p>Checking session...</p>;
  if (!session) return null; // while redirecting

  return <p>Welcome, {session.user.email}!</p>;
}
