"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 10;

export default function UploadDropzone() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUploadedImage, setImageDimensions, setAnalyzing, setAnalysis, setAnalysisError, setAnalysisStep } =
    useAppStore();

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a PNG, JPG, or WebP image.");
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      // Sanitize filename
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadedImage(dataUrl, safeName);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          // Start analysis
          startAnalysis(dataUrl, file.type as "image/png" | "image/jpeg" | "image/webp", safeName);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const startAnalysis = async (
    dataUrl: string,
    mimeType: "image/png" | "image/jpeg" | "image/webp",
    filename: string
  ) => {
    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStep("Uploading image...");

    // Navigate to results page
    router.push("/results");

    try {
      // Extract base64 data (remove data URL prefix)
      const base64 = dataUrl.split(",")[1];

      setAnalysisStep("Analyzing UI patterns...");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType, filename }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis failed (${res.status})`);
      }

      setAnalysisStep("Processing findings...");
      const analysis = await res.json();
      setAnalysis(analysis);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-zinc-300 bg-zinc-50 hover:border-indigo-400 hover:bg-indigo-50/50"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="mb-4 flex justify-center">
          <svg
            className={`h-12 w-12 ${isDragging ? "text-indigo-500" : "text-zinc-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <p className="text-base font-medium text-zinc-700">
          {isDragging ? "Drop your screenshot here" : "Drop a screenshot here, or click to browse"}
        </p>
        <p className="mt-2 text-sm text-zinc-500">PNG, JPG, or WebP up to {MAX_SIZE_MB}MB</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
