import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
import { requireAdmin } from "@/lib/utils/admin/utils";
export async function GET(req: NextRequest) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("total_revenue:sum(total_price)")
    .eq("status", "completed")
    .single();
  if (error) {
    console.error("Supabase Revenue Aggregation Error:", error);
    return NextResponse.json(
      { success: false, error: "Database aggregation failed." },
      { status: 500 }
    );
  }
  const totalRevenue = data?.total_revenue || 0;

  return NextResponse.json({ success: true, totalRevenue });
}
