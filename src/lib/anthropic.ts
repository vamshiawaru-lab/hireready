import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResponseSchema, type AnalysisResponse } from "./schema";
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt, REPAIR_PROMPT } from "./prompts";

const MAX_RETRIES = 2;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

function extractJSON(text: string): string {
  // Try to find JSON in the response (handle markdown code fences)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // Try to find a JSON object directly
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];

  return text.trim();
}

export async function analyzeScreenshot(
  imageBase64: string,
  mimeType: "image/png" | "image/jpeg" | "image/webp"
): Promise<AnalysisResponse> {
  const client = getClient();
  let lastError: Error | null = null;
  let lastRawResponse = "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const isRepairAttempt = attempt > 0 && lastRawResponse;

      const userContent: Anthropic.Messages.ContentBlockParam[] = isRepairAttempt
        ? [
            {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text" as const,
              text: REPAIR_PROMPT.replace("{PREVIOUS_RESPONSE}", lastRawResponse.slice(0, 2000)),
            },
          ]
        : [
            {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text" as const,
              text: buildAnalysisPrompt(mimeType),
            },
          ];

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: ANALYSIS_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],
      });

      // Extract text from response
      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Claude");
      }

      lastRawResponse = textBlock.text;
      const jsonStr = extractJSON(textBlock.text);
      const parsed = JSON.parse(jsonStr);

      // Validate with Zod
      const validated = AnalysisResponseSchema.parse(parsed);
      return validated;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Analysis attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt === MAX_RETRIES) break;
    }
  }

  throw new Error(
    `Analysis failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message || "Unknown error"}`
  );
}
