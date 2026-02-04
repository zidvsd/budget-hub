import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
import { requireAdmin } from "@/lib/utils/admin/utils";

// get single order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    // get order
    const { id: orderId } = await params;

    if (!orderId)
      return NextResponse.json(
        { success: false, error: "Order ID not found" },
        { status: 400 },
      );

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
      order_items(
        quantity,
        price,
        product_id,
        product:products(name)
      )
    `,
      )
      .eq("id", orderId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
// update order
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // ------------------------------
    // ADMIN CHECK
    // ------------------------------
    const adminCheck = await requireAdmin(req);
    if (adminCheck) return adminCheck;

    const resolvedParams = await params;
    const orderId = resolvedParams.id;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID not provided" },
        { status: 400 },
      );
    }

    // ------------------------------
    // PARSE REQUEST BODY
    // ------------------------------
    const body = await req.json();

    const { status, total_price } = body;
    const allowedStatuses = ["pending", "processing", "completed", "cancelled"];

    // status validation
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status" },
        { status: 400 },
      );
    }
    if (status === undefined && total_price === undefined) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 },
      );
    }

    // ------------------------------
    // UPDATE MAIN ORDER FIELDS
    // ------------------------------
    const { error: orderError } = await supabaseAdmin
      .from("orders")
      .update({
        ...(status !== undefined && { status }),
        ...(total_price !== undefined && { total_price }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 },
      );
    }

    // return order
    const { data, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        user_id,
        total_price,
        status,
        created_at,
        updated_at,
        order_items(
          quantity,
          price,
          product_id,
          product:products(name)
        )
      `,
      )
      .eq("id", orderId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// delete order
