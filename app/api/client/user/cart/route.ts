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

    if (cartError || !cart) {
      return NextResponse.json(
        { success: false, error: cartError?.message || "Cart not found" },
        { status: 404 }
      );
    }

    const cartId = cart.id;

    // cart items

    const { data: cartItems, error: cartItemsError } = await supabase
      .from("cart_items")
      .select(`*, product:products(id, name, price, image_path)`)
      .eq("cart_id", cartId);

    if (cartItemsError || !cartItems) {
      return NextResponse.json(
        { success: false, error: cartItemsError.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { ...cart, items: cartItems ?? [] } },
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
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }
    const body = await req.json();

    const { product_id, quantity = 1, price } = body;

    if (!product_id || !price) {
      return NextResponse.json(
        { success: false, error: "Product ID and price required" },
        { status: 400 }
      );
    }

    let { data: cart, error: cartError } = await supabase
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

    // create cart if theres no exisiting one
    if (!cart) {
      const { data: newCart, error: newCartError } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select("*")
        .maybeSingle();
      if (newCartError || !newCart) {
        return NextResponse.json(
          {
            success: false,
            error: newCartError?.message || "Failed to create cart",
          },
          { status: 500 }
        );
      }
      cart = newCart;
    }
    const cartId = cart.id;

    // insert cart items

    const { data: newItem, error: itemError } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id, quantity, price })
      .select(`*, product:products(id,name,price, image_path)`);

    if (itemError) {
      return NextResponse.json(
        { success: false, error: itemError.message },
        { status: 500 }
      );
    }

    // 3. Fetch updated cart items
    const { data: cartItems, error: cartItemsError } = await supabase
      .from("cart_items")
      .select(`*, product:products(id, name, price, image_path)`)
      .eq("cart_id", cart.id);

    if (cartItemsError) {
      return NextResponse.json(
        { success: false, error: cartItemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, cart: { ...cart, items: cartItems ?? [] } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
