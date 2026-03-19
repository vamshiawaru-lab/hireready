"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-50 min-w-[200px] bg-white rounded-lg shadow-lg border border-[#ebebeb] py-1",
            "animate-scale-in origin-top-right",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setOpen(false);
                }
              }}
              disabled={item.disabled}
              className={cn(
                "w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-start gap-3",
                "transition-colors duration-[150ms]",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {item.icon && <span className="mt-0.5 text-[#5c5c5c]">{item.icon}</span>}
              <div>
                <div className="text-sm font-medium text-[#171717]">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-[#5c5c5c]">{item.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
