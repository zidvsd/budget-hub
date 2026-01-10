import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    let queryBuilder = supabase.from("products").select("*");

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    const { data, error } = await queryBuilder;
    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
