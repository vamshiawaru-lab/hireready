"use client";

import { useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { Finding } from "@/lib/schema";

function severityLabel(s: number): string {
  return ["", "Cosmetic", "Minor", "Moderate", "Major", "Critical"][s] || "Unknown";
}

function severityBadge(s: number): string {
  switch (s) {
    case 1:
      return "bg-blue-100 text-blue-700";
    case 2:
      return "bg-amber-100 text-amber-700";
    case 3:
      return "bg-orange-100 text-orange-700";
    case 4:
      return "bg-red-100 text-red-700";
    case 5:
      return "bg-red-200 text-red-900";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function confidenceBadge(c: string): string {
  switch (c) {
    case "high":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-zinc-100 text-zinc-600";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

function markerColor(severity: number): string {
  switch (severity) {
    case 1:
      return "bg-blue-500";
    case 2:
      return "bg-amber-500";
    case 3:
      return "bg-orange-500";
    case 4:
      return "bg-red-500";
    case 5:
      return "bg-red-800";
    default:
      return "bg-zinc-500";
  }
}

function FindingCard({ finding }: { finding: Finding }) {
  const ref = useRef<HTMLDivElement>(null);
  const { selectedFinding, setSelectedFinding } = useAppStore();
  const isSelected = selectedFinding === finding.marker_number;

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isSelected]);

  return (
    <div
      ref={ref}
      onClick={() => setSelectedFinding(isSelected ? null : finding.marker_number)}
      className={`cursor-pointer rounded-lg border p-4 transition-all ${
        isSelected
          ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="mb-2 flex items-start gap-2.5">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${markerColor(
            finding.severity
          )}`}
        >
          {finding.marker_number}
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 leading-tight">{finding.title}</h3>
      </div>

      {/* Badges */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityBadge(
            finding.severity
          )}`}
        >
          {severityLabel(finding.severity)} ({finding.severity}/5)
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${confidenceBadge(
            finding.confidence
          )}`}
        >
          {finding.confidence} confidence
        </span>
      </div>

      {/* Expandable details */}
      {isSelected && (
        <div className="space-y-3 border-t border-zinc-200 pt-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Issue</dt>
            <dd className="mt-0.5 text-sm text-zinc-800">{finding.issue}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Why It Matters
            </dt>
            <dd className="mt-0.5 text-sm text-zinc-800">{finding.principle}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Solution</dt>
            <dd className="mt-0.5 text-sm text-zinc-800 font-medium">{finding.solution}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Evidence</dt>
            <dd className="mt-0.5 text-sm text-zinc-600 italic">{finding.evidence}</dd>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                User KPIs Impacted
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {finding.user_kpis.map((kpi) => (
                  <span
                    key={kpi}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600"
                  >
                    {kpi}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Business KPIs Impacted
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {finding.business_kpis.map((kpi) => (
                  <span
                    key={kpi}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600"
                  >
                    {kpi}
                  </span>
                ))}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Categories
            </dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              {finding.category_tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FindingsPanel() {
  const { analysis } = useAppStore();

  if (!analysis) return null;

  const sorted = [...analysis.findings].sort((a, b) => b.severity - a.severity);

  return (
    <div className="flex h-full flex-col">
      {/* Summary header */}
      <div className="border-b border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">
            {analysis.findings.length} Issues Found
          </h2>
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              analysis.overall_score >= 70
                ? "bg-green-100 text-green-800"
                : analysis.overall_score >= 40
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            Score: {analysis.overall_score}/100
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-600 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Findings list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.map((finding) => (
          <FindingCard key={finding.marker_number} finding={finding} />
        ))}
      </div>
    </div>
  );
}
