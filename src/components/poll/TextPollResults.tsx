"use client";

import type { TextOption } from "@/types/poll";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface TextPollResultsProps {
  options: TextOption[];
  results: { optionId: string; votes: number; percentage: number }[];
  userVoteOptionId?: string;
}

const COLORS = [
  "bg-[#2d1bd3]",
  "bg-[#335cff]",
  "bg-[#fa7319]",
  "bg-[#1fc16b]",
  "bg-[#7d52f4]",
  "bg-[#fb3748]",
];

export function TextPollResults({ options, results, userVoteOptionId }: TextPollResultsProps) {
  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        const result = results.find((r) => r.optionId === opt.id);
        return (
          <ProgressBar
            key={opt.id}
            label={opt.label}
            percentage={result?.percentage ?? 0}
            color={COLORS[i % COLORS.length]}
            isSelected={opt.id === userVoteOptionId}
            animationDelay={i * 100}
          />
        );
      })}
    </div>
  );
}
