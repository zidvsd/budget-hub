import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  try {
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

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError)
      return NextResponse.json(
        { success: false, error: cartError.message },
        { status: 500 }
      );

    const { data: items, error: cartItemsError } = await supabase
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
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { product_id, quantity = 1 } = await req.json();
    const productIdTrimmed = (product_id as string)?.trim();

    // 1. Fetch Price (Ensures Product exists)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price")
      .eq("id", productIdTrimmed) // uuid comparison
      .single();

    if (productError || !product) {
      console.error("Product check failed:", productIdTrimmed);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 2. Get or Create Cart
    let { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select("id")
        .single();

      if (createError) throw createError;
      cart = newCart;
    }

    // 3. Handle Cart Items (Join int8 and uuid)
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id) // cart.id is int8
      .eq("product_id", productIdTrimmed) // product_id is uuid
      .maybeSingle();

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: productIdTrimmed,
        quantity,
        price: product.price,
      });

      if (insertError) throw insertError;
    }

    // 4. Return Fresh Data
    // Instead of calling GET() directly (which can cause header issues),
    // it's cleaner to return a success status or re-fetch logic.
    return GET();
  } catch (error: any) {
    console.error("Cart API Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
