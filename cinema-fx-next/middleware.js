// cinema-fx next/ middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define customer-only routes
const customerPaths = ["/profile", "/orders"];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Redirect logged-in customers away from /admin/login
  if (pathname === "/admin/login" && token && token.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/user-overview"; // or any customer page you want
    return NextResponse.redirect(url);
  }

  // 2. Allow access to /admin/login for everyone else (admins, unauthenticated)
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 3. Block non-admins from /admin/* (show 404)
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.rewrite(url);
    }
  }

  // 4. Block admins from customer-only routes
  if (
    token?.role === "admin" &&
    customerPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // 5. If not authenticated and trying to access protected customer routes
  if (
    !token &&
    customerPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only match protected routes!
export const config = {
  matcher: ["/admin/:path*", "/profile", "/orders", "/admin/login"],
};
