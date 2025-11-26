// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value; // assume you set a cookie with role after login
  if (role === "admin" && req.nextUrl.pathname.startsWith("/")) {
    if (!req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }
  if (role === "user" && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // run on all frontend pages
  ],
};
