import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
export async function GET() {
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
      .single();

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
      .select("*")
      .eq("cart_id", cartId);

    if (cartItemsError || !cartItems) {
      return NextResponse.json(
        { success: false, error: cartItemsError.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: cart, cartItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
