"use client";

import Link from "next/link";
import { usePoll } from "@/context/PollContext";
import { Avatar } from "@/components/ui/Avatar";
import { formatTimeRemaining } from "@/lib/utils";

export function Sidebar() {
  const { users, polls, hasUserVoted } = usePoll();

  const topContributors = [...users]
    .sort((a, b) => b.kudos - a.kudos)
    .slice(0, 5);

  const activePolls = polls
    .filter((p) => p.status === "active" && !hasUserVoted(p.id))
    .slice(0, 3);

  return (
    <aside className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
      {/* Top Contributors */}
      <div className="bg-white rounded-2xl border border-[#ebebeb] p-5">
        <h3 className="text-base font-semibold text-[#171717] mb-4">
          Top Contributors
        </h3>
        <div className="space-y-3">
          {topContributors.map((user, i) => (
            <div
              key={user.id}
              className="flex items-center justify-between animate-fade-in-up"
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} name={user.name} size="md" />
                <div>
                  <div className="text-sm font-medium text-[#171717]">
                    {user.name}
                  </div>
                  <div className="text-xs text-[#5c5c5c]">{user.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-[#5c5c5c]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 2l1.5 3 3.5.5-2.5 2.5.5 3.5L7 10l-3 1.5.5-3.5L2 5.5 5.5 5z" />
                </svg>
                <span className="tabular-nums">{user.kudos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Polls */}
      {activePolls.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#ebebeb] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#171717]">
              Active Polls
            </h3>
            <Link href="/" className="text-sm text-[#2d1bd3] hover:underline font-medium transition-colors duration-[150ms]">
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {activePolls.map((poll, i) => (
              <div
                key={poll.id}
                className="space-y-1.5 animate-fade-in-up"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <p className="text-sm font-medium text-[#171717] line-clamp-2 leading-[21px]">
                  {poll.question}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5c5c5c]">
                    {formatTimeRemaining(poll.endsAt)}
                  </span>
                  <Link
                    href={`/polls/${poll.id}`}
                    className="text-xs text-[#2d1bd3] border border-[#2d1bd3] rounded-full px-3 py-0.5 font-medium hover:bg-[#2d1bd3]/5 transition-all duration-[200ms] hover:shadow-sm"
                  >
                    Vote now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
