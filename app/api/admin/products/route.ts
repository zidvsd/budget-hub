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
      .insert({
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        image_path: body.image_path,
        is_active: body.is_active,
        created_at: body.created_at,
        updated_at: body.updated_at,
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error); // log exact Supabase error
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Unexpected error in POST /api/admin/products:", err); // log unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
