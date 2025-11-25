"use client";
// get session
import { supabase } from "./client";
export async function getUserSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }

  return session;
}
