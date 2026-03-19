"use client";

import { cn } from "@/lib/utils";
import type { PollType } from "@/types/poll";

interface PollTypeToggleProps {
  value: PollType;
  onChange: (type: PollType) => void;
}

export function PollTypeToggle({ value, onChange }: PollTypeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("text")}
        className={cn(
          "flex items-center gap-2 px-4 py-[9px] rounded-md text-sm font-medium",
          "transition-all duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          value === "text"
            ? "bg-[#2d1bd3] text-white shadow-sm border border-[#2d1bd3]"
            : "bg-white text-[#5c5c5c] border border-[#ebebeb] hover:border-[#2d1bd3]/30"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 4h10M3 8h6M3 12h8" />
        </svg>
        Text Poll
      </button>
      <button
        type="button"
        onClick={() => onChange("image")}
        className={cn(
          "flex items-center gap-2 px-4 py-[9px] rounded-md text-sm font-medium",
          "transition-all duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          value === "image"
            ? "bg-[#2d1bd3] text-white shadow-sm border border-[#2d1bd3]"
            : "bg-white text-[#5c5c5c] border border-[#ebebeb] hover:border-[#2d1bd3]/30"
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <circle cx="6" cy="6" r="1.5" />
          <path d="M2 11l4-4 3 3 2-2 3 3" />
        </svg>
        Image Poll
      </button>
    </div>
  );
}
