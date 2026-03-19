"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, icon }: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="flex items-center gap-2 text-sm text-[#5c5c5c]">
        {icon}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full",
          "transition-colors duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          checked ? "bg-[#2d1bd3]" : "bg-gray-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
