import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase/server-client";
import { AuthError } from "@supabase/supabase-js";
type AuthRole = "user" | "admin";

export function withAuth(
  handler: (user: any) => Promise<NextResponse>,
  role: AuthRole = "user",
) {
  return async (req: NextRequest) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        {
          message: "Unauthorized: Please log in.",
          success: false,
        },
        { status: 401 },
      );
    }
    if (role === "admin") {
      const { data: userData, error: dbError } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (dbError || userData?.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden: Admin access required", success: false },
          { status: 403 },
        );
      }
    }
    return handler(user);
  };
}
