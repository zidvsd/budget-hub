import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
interface OrderItemPayload {
  product_id: string;
  quantity: number;
  price: number;
}
// get all orders of user
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { success: false, error: "User not authenticated" },
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const body = await req.json();
    const { total_price, order_items } = body;

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
    const orderItemsPayload: OrderItemPayload[] = order_items.map(
      (item: OrderItemPayload) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })
    );

    const { error: itemsError } = await supabase
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
