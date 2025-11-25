// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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

    const { error: insertError } = await supabaseAdmin.from("users").upsert({
      id: userId,
      email,
      role: "user",
      full_name: "",
    });

    if (insertError) throw insertError;

    return NextResponse.json({ message: "User signed up successfully!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
