import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
// get single order
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // get order
    const { id: orderId } = await params;

    if (!orderId)
      return NextResponse.json(
        { error: "Order ID not found" },
        { status: 400 }
      );

    // authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const { data, error } = await supabase
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
    `
      )
      .eq("id", orderId)
      .eq("user_id", userId)
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
