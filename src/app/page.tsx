"use client";

import Header from "@/components/Header";
import UploadDropzone from "@/components/UploadDropzone";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Find UX Issues in Any Screenshot
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Upload a UI screenshot and get an expert analysis with annotated markers, severity
            ratings, and actionable fixes — powered by AI.
          </p>
        </div>

        {/* Upload zone */}
        <UploadDropzone />

        {/* How it works */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-xl font-semibold text-zinc-900">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Drop any UI screenshot — mobile app, website, or desktop software.",
              },
              {
                step: "2",
                title: "Analyze",
                desc: "AI identifies usability issues, accessibility problems, and design improvements.",
              },
              {
                step: "3",
                title: "Export",
                desc: "Download an annotated screenshot and a detailed PDF report with fixes.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What it checks */}
        <div className="mt-16 rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">What Gets Checked</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Accessibility",
              "Visual Hierarchy",
              "Spacing & Layout",
              "Consistency",
              "Copy & Labels",
              "Navigation",
              "Error Prevention",
              "Color Contrast",
              "Typography",
              "Touch Targets",
              "Feedback",
              "Performance Perception",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-zinc-400">
          ScreenLens uses AI analysis which may not catch every issue. Results should be validated by
          a human UX reviewer. Your screenshots are processed temporarily and not stored permanently.
        </p>
      </main>
    </div>
  );
}
