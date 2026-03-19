import { NextRequest, NextResponse } from "next/server";
import { AuthRequestSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AuthRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) {
      // No password configured = open access
      return NextResponse.json({ success: true });
    }

    if (parsed.data.password === appPassword) {
      const response = NextResponse.json({ success: true });
      // Set a session cookie (httpOnly for security)
      response.cookies.set("screenlens_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
