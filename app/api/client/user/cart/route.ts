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

export async function PATCH(req: NextRequest) {
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

    //
    const { cart_item_id, quantity } = await req.json();

    if (!cart_item_id || typeof quantity !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (cartError || !cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }
    const { data: cartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("id", cart_item_id)
      .eq("cart_id", cart.id)
      .maybeSingle();

    if (cartItemError || !cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cart_item_id);

    if (updateError) throw updateError;
    return GET();
  } catch (error: any) {
    console.error("Cart PATCH Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    // Read the cart_item_id from query params
    const { searchParams } = new URL(req.url);
    const cart_item_id = searchParams.get("cart_item_id");

    if (!cart_item_id) {
      return NextResponse.json(
        { success: false, error: "cart_item_id is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError || !cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Verify cart item belongs to this cart
    const { data: cartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("id", cart_item_id)
      .eq("cart_id", cart.id)
      .maybeSingle();

    if (cartItemError || !cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Delete the item
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cart_item_id);

    if (deleteError) throw deleteError;

    // 4️⃣ Return fresh cart (same as GET)
    return GET();
  } catch (error: any) {
    console.error("Cart DELETE Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
