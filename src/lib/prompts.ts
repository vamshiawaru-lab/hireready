export const ANALYSIS_SYSTEM_PROMPT = `You are an expert UI/UX auditor. You analyze screenshots of user interfaces and identify usability issues, accessibility problems, and design improvements.

You MUST respond with ONLY valid JSON — no markdown, no code fences, no explanation text outside the JSON object.

CRITICAL RULES:
1. All bounding box coordinates (x, y, w, h) are PERCENTAGES of the image dimensions (0-100).
   - x: percentage from left edge
   - y: percentage from top edge
   - w: width as percentage of image width
   - h: height as percentage of image height
2. Place markers near the CENTER of the problematic UI element.
3. Each finding must have a unique marker_number starting from 1.
4. Severity scale: 1 = cosmetic, 2 = minor, 3 = moderate, 4 = major, 5 = critical.
5. Be specific about what you see in the screenshot — reference actual text, colors, positions.
6. Limit findings to the most impactful 5-15 issues.`;

export function buildAnalysisPrompt(_mimeType: string): string {
  return `Analyze this UI screenshot for usability and design issues.

Return a JSON object with this EXACT structure:
{
  "findings": [
    {
      "marker_number": 1,
      "title": "Short descriptive title",
      "issue": "Clear description of the problem a user would face",
      "principle": "The UX heuristic or design principle being violated (e.g., Nielsen's #4 Consistency)",
      "severity": 3,
      "confidence": "high",
      "bbox": { "x": 25.5, "y": 10.2, "w": 50.0, "h": 8.3 },
      "solution": "Specific, actionable fix the team can implement",
      "user_kpis": ["task success rate", "time-on-task"],
      "business_kpis": ["conversion rate", "support tickets"],
      "category_tags": ["Accessibility"],
      "evidence": "What specific element in the screenshot triggered this finding"
    }
  ],
  "summary": "Overall UX assessment in 2-3 sentences",
  "overall_score": 65
}

IMPORTANT:
- bbox coordinates are PERCENTAGES (0-100) of the image, NOT pixels.
- category_tags must be from: Accessibility, Visual Hierarchy, Spacing, Consistency, Copy, Navigation, Error Prevention, Performance Perception, Color Contrast, Typography, Layout, Touch Targets, Feedback, Responsiveness, Information Architecture
- confidence must be: "low", "medium", or "high"
- severity must be an integer 1-5
- overall_score is 0-100 where 100 is perfect UX
- user_kpis examples: task success rate, time-on-task, error rate, learnability, satisfaction score, task completion time
- business_kpis examples: conversion rate, revenue, retention, CAC, support tickets, churn rate, NPS
- Return ONLY the JSON object, nothing else.`;
}

export const REPAIR_PROMPT = `The previous JSON response was malformed. Here is the raw text that was returned:

{PREVIOUS_RESPONSE}

Please fix this to be valid JSON matching this schema exactly:
{
  "findings": [{ "marker_number": number, "title": string, "issue": string, "principle": string, "severity": 1-5, "confidence": "low"|"medium"|"high", "bbox": { "x": 0-100, "y": 0-100, "w": 0-100, "h": 0-100 }, "solution": string, "user_kpis": string[], "business_kpis": string[], "category_tags": string[], "evidence": string }],
  "summary": string,
  "overall_score": 0-100
}

Return ONLY the corrected JSON. No markdown, no code fences, no explanation.`;
