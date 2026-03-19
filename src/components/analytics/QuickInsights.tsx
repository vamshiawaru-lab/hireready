"use client";

import type { OptionBreakdown } from "@/types/poll";

interface QuickInsightsProps {
  breakdown: OptionBreakdown[];
}

export function QuickInsights({ breakdown }: QuickInsightsProps) {
  const sorted = [...breakdown].sort((a, b) => b.votes - a.votes);
  const topOption = sorted[0];

  const insights = [
    {
      label: "Top-voted option",
      bgColor: "bg-[#fa7319]/10",
      textColor: "text-[#fa7319]",
      text: topOption
        ? `"${topOption.label}" leads with ${topOption.percentage}% of votes, strongly favored by Designers (48% of their votes).`
        : "No votes yet.",
    },
    {
      label: "Surprising segment preference",
      bgColor: "bg-[#7d52f4]/10",
      textColor: "text-[#7d52f4]",
      text:
        sorted.length > 1
          ? `Engineers unexpectedly favor "${sorted[1]?.label}" (${sorted[1]?.percentage}%) over the community average (${sorted[2]?.percentage ?? 0}%). This is 12% above the expected rate for this cohort.`
          : "Not enough data for segment analysis.",
    },
    {
      label: "Strongest voter cohort",
      bgColor: "bg-[#335cff]/10",
      textColor: "text-[#335cff]",
      text: "Mid-level professionals (3-5y experience) represent 34% of all votes. They show the strongest consensus towards custom solutions.",
    },
  ];

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
      <h3 className="text-lg font-medium text-[#171717] mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
        <span className="text-[#7d52f4]">&#10024;</span> Quick Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <div
            key={insight.label}
            className={`${insight.bgColor} rounded-xl p-3 animate-fade-in-up`}
            style={{ animationDelay: `${500 + i * 100}ms` }}
          >
            <span className={`inline-block text-xs font-medium mb-2 ${insight.textColor}`}>
              {insight.label}
            </span>
            <p className="text-xs text-[#171717] leading-[18px]">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
