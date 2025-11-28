import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
// get all orders of user
export async function GET(req: NextRequest) {
  const supabase = await createClient();
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

  const userId = user?.id;

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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await req.json();
    const { user_id, total_price, order_items } = body;

    if (
      !total_price ||
      !order_items ||
      !Array.isArray(order_items) ||
      order_items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing total_price or order_items" },
        { status: 400 }
      );
    }

    const userId = "e06b6d1e-d4c9-4ece-b72a-92e7c3320246";

    // insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_price,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // insert order items
    const orderItemsPayload = order_items.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 500 }
      );
    }

    // Step 3: Fetch the full order with items
    const { data: fullOrder, error: fetchError } = await supabase
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
      .single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: fullOrder },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
