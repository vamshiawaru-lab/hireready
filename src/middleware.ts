import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow auth API, static files, and _next
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if password protection is enabled
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = req.cookies.get("screenlens_auth");
  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // For API routes, return 401
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // For page routes, redirect to login (handled client-side via the PasswordGate component)
  // We'll let all page routes through and handle auth check client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/analyze/:path*"],
};
