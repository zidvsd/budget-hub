import { supabaseAdmin } from "@/lib/supabase/server-client";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/admin/utils";

export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(body)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
