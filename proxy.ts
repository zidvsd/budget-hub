// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = request.cookies.get("role")?.value;
  const url = request.nextUrl.pathname;

  // 2. Protect CLient API Routes (Frontend)
  if (url.startsWith("/api/client")) {
    if (!user || role !== "user") {
      return NextResponse.json(
        { error: "Unauthorized: User access required" },
        { status: 401 }
      );
    }
  }

  // 3. Protect API Routes ( Backend)
  if (url.startsWith("/api/admin") && (!user || role !== "admin")) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 }
    );
  }

  // 4. Protect Admin Pages
  if (url.startsWith("/admin") && (!user || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Protected User Routes (/account, /cart, /orders, /notifications)
  const clientProtected = ["/account", "/cart", "/orders", "/notifications"];
  const isClientPath = clientProtected.some((path) => url.startsWith(path));

  if (isClientPath) {
    // If not logged in at all, or if they are an admin trying to access user-only pages
    if (!user || role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If an admin lands on the home page, send them to their dashboard
  if (url === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
