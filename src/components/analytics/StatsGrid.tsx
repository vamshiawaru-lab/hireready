"use client";

import type { PollAnalytics } from "@/types/poll";
import { formatNumber } from "@/lib/utils";

interface StatsGridProps {
  analytics: PollAnalytics;
}

export function StatsGrid({ analytics }: StatsGridProps) {
  const stats = [
    { label: "Impressions", value: formatNumber(analytics.impressions) },
    { label: "Total Votes", value: formatNumber(analytics.totalVotes) },
    { label: "Participation", value: `${analytics.participationRate}%` },
    { label: "Comments", value: analytics.commentCount.toString() },
    { label: "Reactions", value: analytics.reactionCount.toString() },
    { label: "Reports", value: analytics.reportCount.toString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-[#ebebeb] rounded-lg overflow-hidden border border-[#ebebeb] w-full sm:w-[340px] shrink-0">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#ebebeb]/20 px-4 py-3 text-center bg-white">
          <div className="text-lg font-medium text-[#171717] tabular-nums" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
            {s.value}
          </div>
          <div className="text-xs text-[#5c5c5c]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
