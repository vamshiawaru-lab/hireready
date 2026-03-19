"use client";

import { useState, useRef, useEffect } from "react";
import { Toggle } from "@/components/ui/Toggle";
import type { PollSettings } from "@/types/poll";

interface AdvancedSettingsProps {
  settings: PollSettings;
  onChange: (settings: PollSettings) => void;
}

export function AdvancedSettings({ settings, onChange }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  const update = (key: keyof PollSettings, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-medium text-[#171717] hover:text-[#171717]/80 transition-colors duration-[150ms]"
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.4 1.4M11.55 11.55l1.4 1.4M3.05 12.95l1.4-1.4M11.55 4.45l1.4-1.4" />
          </svg>
          Advanced Settings
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="transition-transform duration-[300ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ maxHeight: open ? `${height}px` : "0px", opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pt-3 space-y-1">
          <Toggle
            checked={settings.allowComments}
            onChange={(v) => update("allowComments", v)}
            label="Allow comments"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 3h12v8H5l-3 3V3z" />
              </svg>
            }
          />
          <Toggle
            checked={settings.allowVoteChanges}
            onChange={(v) => update("allowVoteChanges", v)}
            label="Allow vote changes"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4l-6 6-3-3" />
              </svg>
            }
          />
          <Toggle
            checked={settings.anonymousVoting}
            onChange={(v) => update("anonymousVoting", v)}
            label="Anonymous voting"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="5" r="3" />
                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
            }
          />
          <Toggle
            checked={settings.randomiseOptions}
            onChange={(v) => update("randomiseOptions", v)}
            label="Randomise polls"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4h4l3 4-3 4H2M10 4h4M10 12h4M12 2v4M12 10v4" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
