"use client";

import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900">About ScreenLens</h1>

        <div className="space-y-8">
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">What It Does</h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              ScreenLens analyzes UI screenshots using AI to identify usability issues, accessibility
              problems, and design improvements. It produces an annotated screenshot with numbered
              markers and a detailed report with severity ratings, UX principles, and actionable
              solutions.
            </p>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">What It Checks</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Accessibility", desc: "Color contrast, text readability, touch targets, screen reader compatibility" },
                { title: "Visual Hierarchy", desc: "Information priority, focal points, scanning patterns" },
                { title: "Spacing & Layout", desc: "Consistent margins, alignment, grouping, white space usage" },
                { title: "Consistency", desc: "Uniform buttons, colors, typography, interaction patterns" },
                { title: "Copy & Labels", desc: "Clarity, jargon, actionable language, error messages" },
                { title: "Navigation", desc: "Wayfinding, menu structure, breadcrumbs, back navigation" },
                { title: "Error Prevention", desc: "Input validation, confirmation dialogs, undo options" },
                { title: "Color Contrast", desc: "WCAG compliance, text-on-background readability" },
                { title: "Typography", desc: "Font sizes, line heights, readability, hierarchy" },
                { title: "Touch Targets", desc: "Mobile tap size (44px min), spacing between targets" },
                { title: "Feedback", desc: "Loading states, success/error indicators, progress" },
                { title: "Performance Perception", desc: "Skeleton screens, loading animations, perceived speed" },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-zinc-50 p-3">
                  <h3 className="text-sm font-medium text-zinc-900">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">Limitations</h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                AI analysis may miss subtle issues or produce false positives
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Marker placement is approximate — use the adjust mode to fine-tune
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Cannot analyze interactive states (hover, focus, animations)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Cannot test actual functionality, only visual/layout aspects
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Results should be reviewed by a human UX professional
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">Privacy</h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                Screenshots are processed in memory and not stored permanently
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                Images are sent to Anthropic&apos;s Claude API for analysis only
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                No analytics or tracking cookies
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                API keys are stored server-side in environment variables
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900">Technology</h2>
            <p className="text-sm text-zinc-600">
              Built with Next.js, TypeScript, and Tailwind CSS. Analysis powered by Anthropic
              Claude with vision capabilities. All annotation rendering and PDF generation happens
              in the browser using HTML Canvas and jsPDF.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
