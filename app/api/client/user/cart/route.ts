import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
export async function GET() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError || !cart) {
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    const { data: items, error: cartItemsError } = await supabaseAdmin
      .from("cart_items")
      .select(`*, product:products(id, name, price, image_path)`)
      .eq("cart_id", cart.id);

    if (cartItemsError) {
      return NextResponse.json(
        { success: false, error: cartItemsError.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { ...cart, items: items ?? [] } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }
    const body = await req.json();

    const { product_id, quantity = 1 } = body;
    console.log("Received product_id:", product_id);
    if (!product_id) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid quantity" },
        { status: 400 }
      );
    }
    // fetch price from db
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("price")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      console.log("Product not found:", product_id);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // get cart / create cart if no cart

    let { data: cart, error: cartError } = await supabaseAdmin
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError) {
      return NextResponse.json(
        { success: false, error: cartError.message },
        { status: 500 }
      );
    }

    // create cart if theres no existing one
    if (!cart) {
      const res = await supabaseAdmin
        .from("carts")
        .insert({ user_id: user.id })
        .select("*")
        .single();

      cart = res.data;
    }

    // merge item if already exists
    const { data: existingItem } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("product_id", product_id)
      .maybeSingle();

    if (existingItem) {
      await supabaseAdmin
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
    } else {
      await supabaseAdmin.from("cart_items").insert({
        cart_id: cart.id,
        product_id,
        quantity,
        price: product.price,
      });
    }

    return GET();
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
