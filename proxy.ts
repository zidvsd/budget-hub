// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value; // assume you set a cookie with role after login
  const token = req.cookies.get("access-token")?.value;
  const url = req.nextUrl.pathname;

  // Protect admin routes
  if (url.startsWith("/admin")) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (role === "admin" && url === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // run on all frontend pages
  ],
};
