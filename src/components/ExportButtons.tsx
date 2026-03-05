"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { renderAnnotatedImage, downloadDataUrl } from "@/lib/canvas";
import { generatePDF } from "@/lib/pdf";

export default function ExportButtons() {
  const { uploadedImage, uploadedFilename, analysis, markerOverrides } = useAppStore();
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);

  if (!uploadedImage || !analysis) return null;

  const handleExportPNG = async () => {
    setExporting("png");
    try {
      const annotated = await renderAnnotatedImage(uploadedImage, analysis.findings, markerOverrides);
      downloadDataUrl(annotated, (uploadedFilename || "screenshot") + "-annotated.png");
    } catch (err) {
      alert("Failed to export PNG: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const annotated = await renderAnnotatedImage(uploadedImage, analysis.findings, markerOverrides);
      await generatePDF(
        annotated,
        analysis.findings,
        analysis.summary,
        analysis.overall_score,
        uploadedFilename || "screenshot"
      );
    } catch (err) {
      alert("Failed to export PDF: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPNG}
        disabled={exporting !== null}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50"
      >
        {exporting === "png" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        Download PNG
      </button>

      <button
        onClick={handleExportPDF}
        disabled={exporting !== null}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {exporting === "pdf" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        Download PDF Report
      </button>
    </div>
  );
}
