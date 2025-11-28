import { supabaseAdmin } from "@/lib/supabase/server-client";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { requireAdmin } from "@/lib/utils/admin/utils";
// get all orders
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`*, order_items(*, product:products(name)) `);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// create an order
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert("")
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
