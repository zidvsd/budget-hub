import { NextRequest, NextResponse } from "next/server";
// check for role
export async function requireAdmin(req: NextRequest) {
  let role: string | null | undefined = req.cookies.get("role")?.value;
  if (!role) {
    role = req.headers.get("role") || null;
  }
  if (role !== "admin")
    return NextResponse.json(
      { message: "Unauthorized: Admin access is required.", success: false },
      { status: 403 }
    );

  return null;
}
