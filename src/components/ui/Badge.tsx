"use client";

import { cn } from "@/lib/utils";

type Variant = "filled" | "outline" | "success" | "warning" | "purple" | "trending";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  filled: "bg-[#ebebeb] text-[#171717]",
  outline: "border border-[#ebebeb] text-[#5c5c5c]",
  success: "bg-[#1fc16b]/10 text-[#1fc16b]",
  warning: "bg-[#fa7319]/10 text-[#fa7319]",
  purple: "bg-[#2d1bd3]/10 text-[#2d1bd3]",
  trending: "bg-[#335cff]/10 text-[#335cff]",
};

export function Badge({ children, variant = "filled", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
