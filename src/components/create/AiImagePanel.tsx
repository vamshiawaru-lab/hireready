"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AiImagePanelProps {
  optionLabel: string;
  onGenerate: (imageUrl: string) => void;
  onCancel: () => void;
}

const STYLES = ["Photorealistic", "Illustration", "Flat Vector", "3D Render", "Minimal"];
const RATIOS = ["1:1", "4:3", "16:9"];

export function AiImagePanel({ optionLabel, onGenerate, onCancel }: AiImagePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [ratio, setRatio] = useState("1:1");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    // Mock: assign a random placeholder image after a brief delay
    setTimeout(() => {
      const seed = `${prompt}-${style}-${Date.now()}`.replace(/\s+/g, "");
      const url = `https://picsum.photos/seed/${seed}/400/300`;
      onGenerate(url);
      setGenerating(false);
    }, 800);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">
          Generate image for {optionLabel}
        </h4>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image for this option..."
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button type="button" className="text-sm text-purple-600 hover:underline">
        Enhance prompt with AI
      </button>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Style
        </label>
        <div className="flex flex-wrap gap-2 mt-1">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                style === s
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Aspect Ratio
        </label>
        <div className="flex gap-2 mt-1">
          {RATIOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatio(r)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                ratio === r
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerate}
          disabled={generating || !prompt}
        >
          {generating ? "Generating..." : "Generate"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
