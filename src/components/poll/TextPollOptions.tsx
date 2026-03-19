"use client";

import type { TextOption } from "@/types/poll";
import { cn } from "@/lib/utils";

interface TextPollOptionsProps {
  options: TextOption[];
  onVote: (optionId: string) => void;
  disabled?: boolean;
}

export function TextPollOptions({ options, onVote, disabled }: TextPollOptionsProps) {
  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => !disabled && onVote(opt.id)}
          disabled={disabled}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg border border-[#ebebeb] bg-white text-sm text-[#171717]",
            "transition-all duration-[200ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
            "animate-fade-in-up",
            !disabled && "hover:border-[#2d1bd3] hover:bg-[#2d1bd3]/5 cursor-pointer active:scale-[0.98]",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
