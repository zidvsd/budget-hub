import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
import { requireAdmin } from "@/lib/utils/admin/utils";

export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from("products")
      .upload(fileName, buffer, { upsert: true });

    if (error) throw error;

    const { data: publicData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      publicUrl: publicData.publicUrl,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
