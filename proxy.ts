// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value; // assume you set a cookie with role after login
  const url = req.nextUrl.pathname;
  const authPages = ["/login", "/signin"];
  if (role && authPages.includes(url)) {
    // Redirect admin to dashboard, user to home
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect admin routes
  if (url.startsWith("/admin")) {
    if (!role || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (role === "admin" && url === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  const clientProtected = ["/account", "/cart", "/orders", "/notifications"];
  if (clientProtected.some((path) => url.startsWith(path))) {
    if (!role || role !== "user") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // run on all frontend pages
  ],
};
