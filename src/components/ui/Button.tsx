"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-[#2d1bd3] text-white hover:bg-[#2316a8] shadow-sm hover:shadow-md",
  outline: "border border-[rgba(45,27,211,0.3)] text-[#2d1bd3] hover:bg-[#2d1bd3]/5",
  danger: "bg-red-50 text-[#fb3748] hover:bg-red-100 border border-red-200",
  ghost: "text-[#5c5c5c] hover:bg-gray-100",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-[9px] text-sm",
  md: "px-4 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-all duration-[200ms]",
        "hover:scale-[1.02] active:scale-[0.97]",
        "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        loading && "pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
