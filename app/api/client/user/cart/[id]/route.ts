import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Must be string here
) {
  const supabase = await createClient();
  const { id } = await params;
  // Convert inside the handler
  const cart_item_id = Number(id);

  if (isNaN(cart_item_id)) {
    return NextResponse.json(
      { success: false, error: "Invalid cart_item_id format" },
      { status: 400 },
    );
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    // USE THE STREAMLINED QUERY (Verify ownership and get item in one go)
    const { data: cartItem, error: cartItemError } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(id, name, price, image_path),
        carts!inner(user_id) 
      `,
      )
      .eq("id", cart_item_id)
      .eq("carts.user_id", user.id) // This checks if the user owns the cart
      .maybeSingle();

    if (cartItemError) throw cartItemError;

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: cartItem });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const resolvedParams = await params;
    const cart_item_id = Number(resolvedParams.id);

    const { quantity } = await req.json();
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be >= 1" },
        { status: 400 },
      );
    }

    // 1️⃣ Get user's cart
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 },
      );
    }

    // 2️⃣ Find the cart item
    const { data: cartItem } = await supabase
      .from("cart_items")
      .select("id")
      .eq("id", cart_item_id) // string
      .eq("cart_id", cart.id) // string too
      .maybeSingle();

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 },
      );
    }

    // 3️⃣ Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cart_item_id); // string

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "Quantity successfully updated",
      data: { id: cart_item_id, quantity },
    });
  } catch (error: any) {
    console.error("Cart PATCH Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const resolvedParams = await params;
    const cart_item_id = Number(resolvedParams.id);

    if (!cart_item_id) {
      return NextResponse.json(
        { success: false, error: "cart_item_id is required" },
        { status: 400 },
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
        { status: 404 },
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
        { status: 404 },
      );
    }

    // 3️⃣ Delete the item
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cart_item_id);

    if (deleteError) throw deleteError;
    return NextResponse.json({
      success: true,
      message: "Item deleted",
      data: { id: cart_item_id },
    });
  } catch (error: any) {
    console.error("Cart DELETE Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
