import { z } from "zod";

// Bounding box as percentage of image dimensions (0-100)
export const BBoxSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  w: z.number().min(0).max(100),
  h: z.number().min(0).max(100),
});

export const SeveritySchema = z.number().int().min(1).max(5);

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);

export const CategoryTagSchema = z.enum([
  "Accessibility",
  "Visual Hierarchy",
  "Spacing",
  "Consistency",
  "Copy",
  "Navigation",
  "Error Prevention",
  "Performance Perception",
  "Color Contrast",
  "Typography",
  "Layout",
  "Touch Targets",
  "Feedback",
  "Responsiveness",
  "Information Architecture",
]);

export const FindingSchema = z.object({
  marker_number: z.number().int().min(1),
  title: z.string().min(1).max(200),
  issue: z.string().min(1).max(500),
  principle: z.string().min(1).max(500),
  severity: SeveritySchema,
  confidence: ConfidenceSchema,
  bbox: BBoxSchema,
  solution: z.string().min(1).max(500),
  user_kpis: z.array(z.string()).min(1),
  business_kpis: z.array(z.string()).min(1),
  category_tags: z.array(CategoryTagSchema).min(1),
  evidence: z.string().min(1).max(500),
});

export const AnalysisResponseSchema = z.object({
  findings: z.array(FindingSchema).min(1).max(20),
  summary: z.string().min(1).max(1000),
  overall_score: z.number().min(0).max(100),
});

// Type exports derived from Zod schemas
export type BBox = z.infer<typeof BBoxSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
export type Severity = z.infer<typeof SeveritySchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type CategoryTag = z.infer<typeof CategoryTagSchema>;

// Request validation
export const AnalyzeRequestSchema = z.object({
  image: z.string().min(1), // base64
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  filename: z.string().min(1).max(255),
});

export const AuthRequestSchema = z.object({
  password: z.string().min(1).max(100),
});
