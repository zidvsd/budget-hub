import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server-client";
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("role")?.value;

    // Check if user is admin
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        user_id,
        status,
        total_price,
        created_at,
        updated_at,
        order_items(
          quantity,
          price,
          product_id,
          product:products(name)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
