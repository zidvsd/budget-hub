// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server-client";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const { data: signUpData, error: signUpError } =
      await supabaseAdmin.auth.signUp({
        email,
        password,
      });

    if (signUpError) throw signUpError;
    const userId = signUpData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "Signup successful! Please check your email to confirm." },
        { status: 200 }
      );
    }
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exits" },
        { status: 400 }
      );
    }
    const { error: insertError } = await supabaseAdmin.from("users").upsert(
      {
        id: userId,
        email,
        role: "user",
        full_name: "",
      },
      { onConflict: "email" }
    );

    if (insertError) throw insertError;

    return NextResponse.json({ message: "User signed up successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
