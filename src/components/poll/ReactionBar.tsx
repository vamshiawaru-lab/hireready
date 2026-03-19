"use client";

import { useState } from "react";
import { usePoll } from "@/context/PollContext";
import { cn } from "@/lib/utils";
import type { ReactionType } from "@/types/poll";

interface ReactionBarProps {
  pollId: string;
  impressions: number;
  commentCount: number;
}

const REACTION_EMOJIS: { type: ReactionType; emoji: string }[] = [
  { type: "like", emoji: "\uD83D\uDC4D" },
  { type: "love", emoji: "\u2764\uFE0F" },
  { type: "insightful", emoji: "\uD83D\uDCA1" },
  { type: "need_this", emoji: "\uD83D\uDE4F" },
];

export function ReactionBar({ pollId, impressions, commentCount }: ReactionBarProps) {
  const { toggleReaction, getPollReactions, currentUserId } = usePoll();
  const reactions = getPollReactions(pollId);
  const [animatingType, setAnimatingType] = useState<string | null>(null);

  const handleReaction = (type: ReactionType) => {
    setAnimatingType(type);
    toggleReaction(pollId, type);
    setTimeout(() => setAnimatingType(null), 300);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#ebebeb]">
      <div className="flex items-center gap-3">
        {/* Views */}
        <span className="flex items-center gap-1.5 text-sm text-[#5c5c5c]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
            <circle cx="8" cy="8" r="2" />
          </svg>
          {impressions}
        </span>

        {/* Reactions */}
        <div className="flex items-center gap-1">
          {REACTION_EMOJIS.map(({ type, emoji }) => {
            const count = reactions.filter((r) => r.type === type).length;
            const isActive = reactions.some(
              (r) => r.type === type && r.userId === currentUserId
            );
            const isAnimating = animatingType === type;
            return (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs",
                  "transition-all duration-[200ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                  isActive
                    ? "bg-[#2d1bd3]/10 text-[#2d1bd3]"
                    : "hover:bg-gray-100 text-[#5c5c5c]"
                )}
              >
                <span className={cn(
                  "transition-transform duration-[300ms]",
                  isAnimating && "animate-pop-in"
                )}>
                  {emoji}
                </span>
                {count > 0 && (
                  <span className={cn(
                    "tabular-nums transition-all duration-[200ms]",
                    isAnimating && "text-[#2d1bd3] font-medium"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Comments */}
        <span className="flex items-center gap-1.5 text-sm text-[#5c5c5c]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 3h12v8H5l-3 3V3z" />
          </svg>
          {commentCount}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-1.5 text-gray-400 hover:text-[#171717] transition-colors duration-[150ms]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 2l4 4-8 8H2v-4L10 2z" />
          </svg>
        </button>
        <button className="p-1.5 text-gray-400 hover:text-[#171717] transition-colors duration-[150ms]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 2h7l4 4v8H3V2z" />
            <path d="M10 2v4h4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
