"use client";

import { useEffect, useState } from "react";
import type { ImageOption } from "@/types/poll";
import { cn } from "@/lib/utils";

interface ImagePollResultsProps {
  options: ImageOption[];
  results: { optionId: string; votes: number; percentage: number }[];
  userVoteOptionId?: string;
}

export function ImagePollResults({ options, results, userVoteOptionId }: ImagePollResultsProps) {
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBadges(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "grid gap-4",
      options.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
    )}>
      {options.map((opt, i) => {
        const result = results.find((r) => r.optionId === opt.id);
        const isSelected = opt.id === userVoteOptionId;
        return (
          <div
            key={opt.id}
            className={cn(
              "rounded-xl overflow-hidden border-2",
              "transition-all duration-[300ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
              "animate-fade-in-up",
              isSelected ? "border-[#2d1bd3] shadow-md" : "border-transparent"
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
              <img
                src={opt.imageUrl}
                alt={opt.label}
                className="w-full h-full object-cover"
              />
              <div
                className={cn(
                  "absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1",
                  "text-sm font-bold text-[#171717] tabular-nums",
                  "transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                  showBadges ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {result?.percentage ?? 0}%
              </div>
            </div>
            <div className={cn(
              "p-2 text-center transition-colors duration-[200ms]",
              isSelected ? "bg-[#2d1bd3]/5" : "bg-white"
            )}>
              <span className={cn(
                "text-sm font-medium",
                isSelected ? "text-[#2d1bd3]" : "text-[#171717]"
              )}>
                {opt.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
