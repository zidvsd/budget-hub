import { supabaseAdmin } from "@/lib/supabase/server-client";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/admin/utils";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin

    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    // get id from req
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false || "Id not found" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch user" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}
