import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/schema";
import { analyzeScreenshot } from "@/lib/anthropic";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow up to 60s for AI processing

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limited. Try again in ${rateCheck.retryAfter}s.` },
        { status: 429 }
      );
    }

    // Check API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Server is not configured with an API key. Check .env.local." },
        { status: 500 }
      );
    }

    // Parse and validate request
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { image, mimeType } = parsed.data;

    // Check file size (base64 is ~33% larger than binary)
    const maxMB = parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10);
    const sizeBytes = Math.ceil((image.length * 3) / 4);
    if (sizeBytes > maxMB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Maximum is ${maxMB}MB.` },
        { status: 413 }
      );
    }

    // Analyze with Claude
    const analysis = await analyzeScreenshot(image, mimeType);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during analysis.",
      },
      { status: 500 }
    );
  }
}
