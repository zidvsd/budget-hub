import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*");
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
