"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  color?: string;
  label: string;
  showPercentage?: boolean;
  isSelected?: boolean;
  className?: string;
  animationDelay?: number;
}

export function ProgressBar({
  percentage,
  color = "bg-[#2d1bd3]",
  label,
  showPercentage = true,
  isSelected = false,
  className,
  animationDelay = 0,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
      // Animate the counter
      const duration = 400;
      const steps = 20;
      const increment = percentage / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setDisplayPercentage(percentage);
          clearInterval(interval);
        } else {
          setDisplayPercentage(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, animationDelay);
    return () => clearTimeout(timer);
  }, [percentage, animationDelay]);

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border px-4 py-3.5 overflow-hidden",
        "transition-all duration-[300ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
        isSelected ? "border-[#2d1bd3] bg-[#2d1bd3]/5" : "border-[#ebebeb] bg-white",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-xl opacity-[0.12]",
          "transition-[width] duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          color
        )}
        style={{ width: `${width}%` }}
      />
      <div className="relative flex items-center justify-between">
        <span className={cn(
          "text-[14px] font-medium leading-[21px]",
          isSelected ? "text-[#2d1bd3]" : "text-[#171717]"
        )}>
          {label}
        </span>
        {showPercentage && (
          <span className="text-[14px] font-semibold text-[#171717] tabular-nums leading-[21px]">
            {displayPercentage}%
          </span>
        )}
      </div>
    </div>
  );
}
