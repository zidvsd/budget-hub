import { supabaseAdmin } from "@/lib/supabase/server-client";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/admin/utils";
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    // Check if user is admin
    const { data, error } = await supabaseAdmin.from("users").select("*");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch users" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
