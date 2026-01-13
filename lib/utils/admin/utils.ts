import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function requireAdmin() {
  const supabase = await createClient();

  // 1. Get user from Supabase (Safe check)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { message: "Unauthorized: Please log in.", success: false },
      { status: 401 }
    );
  }

  // 3️⃣ Fetch the user's role from the 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { message: "Unauthorized: Profile not found.", success: false },
      { status: 401 }
    );
  }

  // 4️⃣ Check if the role is 'admin'
  if (profile.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admin access required.", success: false },
      { status: 403 }
    );
  }

  // ✅ User is admin — allow access
  return null;
}
