"use client";

import { useEffect, useState } from "react";
import type { PollAnalytics } from "@/types/poll";

interface MetricCardsProps {
  analytics: PollAnalytics;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value]);

  return <span className="tabular-nums">{display}{suffix}</span>;
}

const ICON_COLORS = [
  "bg-[#2d1bd3]/10",
  "bg-[#1fc16b]/10",
  "bg-[#335cff]/10",
  "bg-[#fa7319]/10",
];

export function MetricCards({ analytics }: MetricCardsProps) {
  const cards = [
    {
      label: "Total Votes",
      value: analytics.totalVotes,
      suffix: "",
      delta: "+23% vs avg",
    },
    {
      label: "Participation Rate",
      value: analytics.participationRate,
      suffix: "%",
      delta: "18% above benchmark",
    },
    {
      label: "Impressions",
      value: analytics.impressions,
      suffix: "",
      delta: "1.8x vote-to-view",
    },
    {
      label: "Engagement Rate",
      value: analytics.engagementRate,
      suffix: "%",
      delta: "Top 10% performer",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-[#ebebeb] p-4 animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center ${ICON_COLORS[i]}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5c5c5c]">
                {i === 0 && <><rect x="3" y="2" width="10" height="12" rx="1" /><path d="M6 6h4M6 9h2" /></>}
                {i === 1 && <path d="M2 12l4-4 3 3 5-5" />}
                {i === 2 && <><circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="2" /></>}
                {i === 3 && <path d="M2 8l4-4 3 3 5-5M8 12l4 2M4 10l-2 4" />}
              </svg>
            </div>
            <span className="text-xs text-[#5c5c5c]">{card.label}</span>
          </div>
          <div className="text-[32px] font-medium text-[#171717] leading-[48px]" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
            <AnimatedNumber value={card.value} suffix={card.suffix} />
          </div>
          <div className="text-xs text-[#5c5c5c] mt-1">{card.delta}</div>
        </div>
      ))}
    </div>
  );
}
