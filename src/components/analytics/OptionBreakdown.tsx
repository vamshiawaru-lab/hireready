"use client";

import { useEffect, useState } from "react";
import type { OptionBreakdown as OptionBreakdownType } from "@/types/poll";

interface OptionBreakdownProps {
  breakdown: OptionBreakdownType[];
}

const COLORS = [
  "bg-[#335cff]",
  "bg-[#1fc16b]",
  "bg-[#fa7319]",
  "bg-[#7d52f4]",
  "bg-[#fb3748]",
  "bg-[#2d1bd3]",
];

export function OptionBreakdown({ breakdown }: OptionBreakdownProps) {
  const sorted = [...breakdown].sort((a, b) => b.votes - a.votes);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#ebebeb] p-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <h3 className="text-lg font-medium text-[#171717] mb-4" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
        Quick Option Breakdown
      </h3>
      <div className="space-y-3">
        {sorted.map((opt, i) => (
          <div key={opt.optionId}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[#171717]">
                {i === 0 && (
                  <span className="inline-block mr-1.5 text-[#fa7319]">
                    &#9733;
                  </span>
                )}
                {opt.label}
              </span>
              <span className="text-sm text-[#5c5c5c]">
                <span className="font-semibold text-[#171717]">{opt.percentage}%</span>{" "}
                <span className="text-[#5c5c5c]">{opt.votes}</span>
              </span>
            </div>
            <div className="h-2 bg-[#ebebeb]/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${COLORS[i % COLORS.length]} transition-[width] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]`}
                style={{
                  width: animate ? `${opt.percentage}%` : "0%",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
