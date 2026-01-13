// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // 1. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Verify Auth - Use getUser() for security
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = request.cookies.get("role")?.value;
  const url = request.nextUrl.pathname;

  // 3. Protect API Routes (The Backend)
  if (url.startsWith("/api/admin") && (!user || role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Protect Admin Pages
  if (url.startsWith("/admin") && (!user || role !== "admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ... rest of your logic for /cart, /orders, etc.

  // 5. Protected User Routes (/account, /cart, /orders, /notifications)
  const clientProtected = ["/account", "/cart", "/orders", "/notifications"];
  const isClientPath = clientProtected.some((path) => url.startsWith(path));

  if (isClientPath) {
    // If not logged in at all, or if they are an admin trying to access user-only pages
    if (!user || role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 7. Root Path "/" Logic
  // If an admin lands on the home page, send them to their dashboard
  if (url === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

// CRITICAL: Ensure 'api' is NOT excluded if you want to protect backend endpoints
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
