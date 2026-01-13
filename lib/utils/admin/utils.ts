import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
import { createClient } from "@/lib/supabase/server";
export async function requireAdmin(req: NextRequest) {
  const supabase = await createClient();
  // 1. Get user from Supabase (Safe check)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("GUARD CHECK - User found:", !!user);
  if (authError || !user) {
    return NextResponse.json(
      { message: "Unauthorized: Please log in.", success: false },
      { status: 401 }
    );
  }
  // Note: Check if your table is called 'users' or 'profiles'
  const { data: userData, error: dbError } = await supabaseAdmin
    .from("users") // or "users"
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || userData?.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admin access required", success: false },
      { status: 403 }
    );
  }

  return null;
}
