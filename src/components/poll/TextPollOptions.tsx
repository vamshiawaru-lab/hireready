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
    <div className="space-y-2.5">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => !disabled && onVote(opt.id)}
          disabled={disabled}
          className={cn(
            "w-full text-left px-4 py-3.5 rounded-xl border border-[#ebebeb] bg-white",
            "text-[14px] font-medium text-[#171717] leading-[21px]",
            "transition-all duration-[200ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
            "animate-fade-in-up",
            !disabled && "hover:border-[#2d1bd3] hover:bg-[#2d1bd3]/[0.03] hover:shadow-[0_0_0_1px_rgba(45,27,211,0.15)] cursor-pointer active:scale-[0.98]",
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
