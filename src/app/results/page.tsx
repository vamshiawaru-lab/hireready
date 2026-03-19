"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AnnotatedViewer from "@/components/AnnotatedViewer";
import FindingsPanel from "@/components/FindingsPanel";
import ExportButtons from "@/components/ExportButtons";
import LoadingProgress from "@/components/LoadingProgress";
import { useAppStore } from "@/lib/store";

export default function ResultsPage() {
  const router = useRouter();
  const {
    uploadedImage,
    analysis,
    isAnalyzing,
    analysisError,
    isAdjustMode,
    setAdjustMode,
    resetMarkerOverrides,
    clearUpload,
  } = useAppStore();

  // Redirect if no image uploaded
  if (!uploadedImage && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="mb-4 text-zinc-500">No screenshot uploaded yet.</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />

      {/* Toolbar */}
      <div className="border-b border-zinc-200 bg-white px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearUpload();
                router.push("/");
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Analysis
            </button>

            {analysis && (
              <>
                <div className="h-5 w-px bg-zinc-200" />
                <button
                  onClick={() => setAdjustMode(!isAdjustMode)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    isAdjustMode
                      ? "bg-amber-100 text-amber-800"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {isAdjustMode ? "Done Adjusting" : "Adjust Markers"}
                </button>

                {isAdjustMode && (
                  <button
                    onClick={resetMarkerOverrides}
                    className="text-sm text-zinc-500 hover:text-zinc-700"
                  >
                    Reset positions
                  </button>
                )}
              </>
            )}
          </div>

          {analysis && <ExportButtons />}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {isAnalyzing ? (
          <div className="flex flex-1 items-center justify-center">
            <LoadingProgress />
          </div>
        ) : analysisError ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <svg className="mx-auto mb-3 h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="mb-1 text-sm font-semibold text-red-900">Analysis Failed</h3>
              <p className="mb-4 text-sm text-red-700">{analysisError}</p>
              <button
                onClick={() => {
                  clearUpload();
                  router.push("/");
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Image viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="mx-auto max-w-4xl">
                {isAdjustMode && (
                  <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                    Drag markers to adjust their position. Click &quot;Done Adjusting&quot; when finished.
                  </div>
                )}
                <AnnotatedViewer />
              </div>
            </div>

            {/* Side panel */}
            <div className="w-96 shrink-0 border-l border-zinc-200 bg-white overflow-hidden">
              <FindingsPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
