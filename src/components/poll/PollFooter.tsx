"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatTimeRemaining } from "@/lib/utils";
import type { Poll } from "@/types/poll";

interface PollFooterProps {
  poll: Poll;
  voteCount: number;
  commentCount: number;
  hasVoted: boolean;
  isCreator: boolean;
}

export function PollFooter({ poll, voteCount, commentCount, hasVoted, isCreator }: PollFooterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[#5c5c5c]">
        <span className="tabular-nums">{voteCount} votes</span>
        <span>·</span>
        <span>{formatTimeRemaining(poll.endsAt)}</span>
      </div>
      {poll.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {poll.tags.map((tag) => (
            <Badge key={tag} variant="filled" className="text-[10px] uppercase tracking-wider">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 pt-1">
        <button className="text-sm text-[#2d1bd3] font-medium hover:underline transition-colors duration-[150ms]">
          View {commentCount} Comment{commentCount !== 1 ? "s" : ""}
        </button>
        <Link
          href={`/polls/${poll.id}/analytics`}
          className="text-sm text-[#2d1bd3] font-medium hover:underline transition-colors duration-[150ms]"
        >
          View Analytics
        </Link>
      </div>
    </div>
  );
}
