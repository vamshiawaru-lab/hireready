"use client";

import { useState } from "react";
import { AiImagePanel } from "./AiImagePanel";

interface ImageOptionInputProps {
  index: number;
  label: string;
  imageUrl: string;
  onLabelChange: (value: string) => void;
  onImageChange: (url: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ImageOptionInput({
  index,
  label,
  imageUrl,
  onLabelChange,
  onImageChange,
  onRemove,
  canRemove,
}: ImageOptionInputProps) {
  const [showAiPanel, setShowAiPanel] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-gray-400 cursor-grab">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>
        {/* Image preview/upload */}
        <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
              <rect x="2" y="2" width="14" height="14" rx="2" />
              <path d="M6 12l3-3 2 2 3-3" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder={`Option ${index + 1}`}
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <div className="pl-8">
        <button
          type="button"
          onClick={() => setShowAiPanel(!showAiPanel)}
          className="text-sm text-purple-600 hover:underline flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1v12M1 7h12" />
          </svg>
          Generate Image with AI
        </button>
      </div>
      {showAiPanel && (
        <div className="pl-8">
          <AiImagePanel
            optionLabel={label || `Option ${index + 1}`}
            onGenerate={(url) => {
              onImageChange(url);
              setShowAiPanel(false);
            }}
            onCancel={() => setShowAiPanel(false)}
          />
        </div>
      )}
    </div>
  );
}
