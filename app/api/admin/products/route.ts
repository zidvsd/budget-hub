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

    return NextResponse.json(
      {
        success: true,
        message: "Product added succesfully",
        data,
      },
      { status: 201 }
    );
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

export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;
    const { id, name, category, description, price, stock, image_path } =
      await req.json();
    if (!id)
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name,
        description,
        price,
        stock,
        image_path,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Unable to update product" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Product updated successfully", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;
    const { id } = await req.json();

    if (!id)
      return NextResponse.json(
        { success: false, error: "Missing product id" },
        { status: 400 }
      );

    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to delete product" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Product deleted successfully", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
