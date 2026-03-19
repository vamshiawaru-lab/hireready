"use client";

import type { ImageOption } from "@/types/poll";
import { cn } from "@/lib/utils";

interface ImagePollOptionsProps {
  options: ImageOption[];
  onVote: (optionId: string) => void;
  disabled?: boolean;
}

export function ImagePollOptions({ options, onVote, disabled }: ImagePollOptionsProps) {
  return (
    <div className={cn(
      "grid gap-4",
      options.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"
    )}>
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => !disabled && onVote(opt.id)}
          disabled={disabled}
          className={cn(
            "group text-left rounded-xl overflow-hidden border-2 border-transparent",
            "transition-all duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
            "animate-fade-in-up",
            !disabled && "hover:border-[#2d1bd3] hover:shadow-lg cursor-pointer active:scale-[0.97]",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
            <img
              src={opt.imageUrl}
              alt={opt.label}
              className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
            />
          </div>
          <div className="p-2 text-center transition-colors duration-[200ms] group-hover:bg-[#2d1bd3]/5">
            <span className="text-sm font-medium text-[#171717]">{opt.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
