import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Id not found" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Product fetched successfully", data },
    { status: 200 }
  );
}
