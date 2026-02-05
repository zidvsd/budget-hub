import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 },
      );

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (roleError) {
      return NextResponse.json(
        { success: false, error: roleError.message },
        { status: 500 },
      );
    }
    const payload = {
      user: data.user,
      session: data.session,
      role: userData.role,
    };

    const response = NextResponse.json({ success: true, data: payload });
    response.cookies.set("role", userData.role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to login" },
      { status: 500 },
    );
  }
}
