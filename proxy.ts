// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";
import { updateSession } from "./lib/supabase/middleware";
export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const url = request.nextUrl.pathname;

  const isUserPage = ["/account", "/cart", "/orders", "/notifications"];
  const isAdminPage = url.startsWith("/admin");

  if ((isUserPage || isAdminPage) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = user?.app_metadata?.role || "user";

  if (isAdminPage && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (url === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
