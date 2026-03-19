"use client";

import { usePoll } from "@/context/PollContext";
import { PageShell } from "@/components/layout/PageShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { PollCard } from "@/components/poll/PollCard";
import Link from "next/link";

export default function FeedPage() {
  const { polls, hasUserVoted } = usePoll();

  const pinnedPoll = polls.find((p) => p.isPinned && p.status === "active");
  const feedPolls = polls.filter((p) => !p.isPinned);

  return (
    <PageShell sidebar={<Sidebar />}>
      {/* Pinned Poll Hero — always visible when a pinned poll exists */}
      {pinnedPoll && (
        <section className="bg-white rounded-2xl border border-[#ebebeb] p-4 md:p-6 mb-6 animate-fade-in-down">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#2d1bd3] uppercase tracking-wider">
              Personalized for you
            </span>
            <Link href="/" className="text-sm text-[#2d1bd3] hover:underline font-medium transition-colors duration-[150ms]">
              View all polls &rarr;
            </Link>
          </div>
          <h2 className="text-lg font-bold text-[#171717] mb-1">
            Polls Needing Your Vote
          </h2>
          <p className="text-sm text-[#5c5c5c] mb-4">
            Open community polls you can answer in one click
          </p>
          <PollCard poll={pinnedPoll} />
        </section>
      )}

      {/* Feed */}
      <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-bold text-[#171717]">Recent Content</h2>
        </div>
        <div className="flex gap-4 mb-4 border-b border-[#ebebeb]">
          <button className="text-sm font-medium text-[#2d1bd3] border-b-2 border-[#2d1bd3] pb-2 px-1 transition-colors duration-[200ms]">
            Most Recent
          </button>
          <button className="text-sm font-medium text-[#5c5c5c] pb-2 px-1 hover:text-[#171717] transition-colors duration-[200ms]">
            Most Viewed
          </button>
        </div>
        <div className="space-y-4">
          {feedPolls.map((poll, i) => (
            <PollCard key={poll.id} poll={poll} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
