"use client";

import { useAppStore } from "@/lib/store";

const steps = [
  { key: "upload", label: "Uploading image" },
  { key: "analyze", label: "Analyzing UI patterns" },
  { key: "process", label: "Processing findings" },
];

function getActiveStep(analysisStep: string): number {
  if (analysisStep.includes("Processing")) return 2;
  if (analysisStep.includes("Analyzing")) return 1;
  return 0;
}

export default function LoadingProgress() {
  const { analysisStep } = useAppStore();
  const activeIdx = getActiveStep(analysisStep);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-8 h-12 w-12 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />

      <h2 className="mb-2 text-lg font-semibold text-zinc-900">Analyzing your screenshot</h2>
      <p className="mb-8 text-sm text-zinc-500">This usually takes 10-30 seconds</p>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                idx < activeIdx
                  ? "bg-indigo-600 text-white"
                  : idx === activeIdx
                    ? "border-2 border-indigo-600 text-indigo-600"
                    : "border-2 border-zinc-300 text-zinc-400"
              }`}
            >
              {idx < activeIdx ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`text-sm ${
                idx <= activeIdx ? "font-medium text-zinc-900" : "text-zinc-400"
              }`}
            >
              {step.label}
            </span>
            {idx === activeIdx && (
              <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
