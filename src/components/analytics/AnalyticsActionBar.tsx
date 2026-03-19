"use client";

import { Button } from "@/components/ui/Button";

interface AnalyticsActionBarProps {
  onClosePoll: () => void;
  isClosed: boolean;
}

export function AnalyticsActionBar({ onClosePoll, isClosed }: AnalyticsActionBarProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <span className="flex items-center gap-2 text-sm text-[#1fc16b] font-medium">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M6 8l2 2 4-4" />
        </svg>
        Moderation: Approved
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: "Export Results", icon: "M4 12l4-8 4 8M6 8h4" },
          { label: "Archive", icon: "M3 4h10v2H3zM4 6v6h8V6" },
          { label: "Feature", icon: "M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" },
          { label: "Copy Summary", icon: "M5 2h6v12H5zM9 2h2v12H9" },
          { label: "Share Report", icon: "M4 12V7l4-3 4 3v5M8 8v4" },
        ].map((action) => (
          <Button key={action.label} variant="ghost" size="sm" className="border border-[#ebebeb] rounded-md text-xs">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d={action.icon} />
            </svg>
            {action.label}
          </Button>
        ))}
        {!isClosed && (
          <Button variant="danger" size="sm" onClick={onClosePoll} className="text-xs border border-[#ebebeb] rounded-md">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M6 6l4 4M10 6l-4 4" />
            </svg>
            Close Poll
          </Button>
        )}
      </div>
    </div>
  );
}
