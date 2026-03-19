"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePoll } from "@/context/PollContext";
import { Badge } from "@/components/ui/Badge";
import { StatsGrid } from "@/components/analytics/StatsGrid";
import { MetricCards } from "@/components/analytics/MetricCards";
import { OptionBreakdown } from "@/components/analytics/OptionBreakdown";
import { VoteActivityChart } from "@/components/analytics/VoteActivityChart";
import { QuickInsights } from "@/components/analytics/QuickInsights";
import { AnalyticsActionBar } from "@/components/analytics/AnalyticsActionBar";
import { formatDateTime } from "@/lib/utils";

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { polls, currentUserId, getPollAnalytics, closePoll } = usePoll();

  const poll = polls.find((p) => p.id === id);

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-xl font-bold text-[#171717]">Poll not found</h1>
        <Link href="/" className="text-[#2d1bd3] hover:underline mt-2 inline-block">
          Back to Feed
        </Link>
      </div>
    );
  }

  if (poll.creatorId !== currentUserId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-xl font-bold text-[#171717]">Access Denied</h1>
        <p className="text-[#5c5c5c] mt-2">Only the poll creator can view analytics.</p>
        <Link href="/" className="text-[#2d1bd3] hover:underline mt-4 inline-block">
          Back to Feed
        </Link>
      </div>
    );
  }

  const analytics = getPollAnalytics(id);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-4">
      {/* Back */}
      <Link
        href="/"
        className="text-sm text-[#5c5c5c] hover:text-[#171717] flex items-center gap-1 font-medium transition-colors duration-[150ms] animate-fade-in"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 4l-4 4 4 4" />
        </svg>
        Back to Feed
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#ebebeb] p-6 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={poll.status === "active" ? "success" : "filled"}>
                {poll.status}
              </Badge>
              <Badge variant="filled">{poll.type} poll</Badge>
              {poll.tags.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="filled">{tag}</Badge>
              ))}
              <Badge variant="trending">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-1">
                  <path d="M1 9l3-3 2 2 5-5" />
                </svg>
                Trending
              </Badge>
            </div>
            <h1 className="text-lg font-medium text-[#171717] leading-[27px]" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
              {poll.question}
            </h1>
            {poll.description && (
              <p className="text-sm text-[#5c5c5c] leading-[21px]">{poll.description}</p>
            )}
            <p className="text-xs text-[#5c5c5c] flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="5.5" />
                <path d="M7 4.5v3l2 1" />
              </svg>
              Created {formatDateTime(poll.createdAt)}
            </p>
          </div>
          <StatsGrid analytics={analytics} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="animate-fade-in-up" style={{ animationDelay: "160ms" }}>
        <AnalyticsActionBar
          onClosePoll={() => closePoll(id)}
          isClosed={poll.status === "closed"}
        />
      </div>

      {/* Metric Cards */}
      <MetricCards analytics={analytics} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OptionBreakdown breakdown={analytics.optionBreakdown} />
        <VoteActivityChart data={analytics.hourlyActivity} />
      </div>

      {/* Quick Insights */}
      <QuickInsights breakdown={analytics.optionBreakdown} />
    </div>
  );
}
