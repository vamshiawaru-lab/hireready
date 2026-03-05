"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { Finding } from "@/lib/schema";

function severityColor(severity: number): string {
  switch (severity) {
    case 1:
      return "bg-blue-500 border-blue-300";
    case 2:
      return "bg-amber-500 border-amber-300";
    case 3:
      return "bg-orange-500 border-orange-300";
    case 4:
      return "bg-red-500 border-red-300";
    case 5:
      return "bg-red-800 border-red-600";
    default:
      return "bg-zinc-500 border-zinc-300";
  }
}

function severityBorderColor(severity: number): string {
  switch (severity) {
    case 1:
      return "border-blue-400";
    case 2:
      return "border-amber-400";
    case 3:
      return "border-orange-400";
    case 4:
      return "border-red-400";
    case 5:
      return "border-red-700";
    default:
      return "border-zinc-400";
  }
}

export default function AnnotatedViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    uploadedImage,
    analysis,
    selectedFinding,
    setSelectedFinding,
    isAdjustMode,
    markerOverrides,
    setMarkerOverride,
  } = useAppStore();

  const [dragging, setDragging] = useState<number | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  // Update container rect on resize
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [analysis]);

  const getMarkerPosition = useCallback(
    (finding: Finding) => {
      const override = markerOverrides.find((m) => m.marker_number === finding.marker_number);
      if (override) {
        return { x: override.x, y: override.y };
      }
      return {
        x: finding.bbox.x + finding.bbox.w / 2,
        y: finding.bbox.y + finding.bbox.h / 2,
      };
    },
    [markerOverrides]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, markerNumber: number) => {
      if (!isAdjustMode) return;
      e.preventDefault();
      e.stopPropagation();
      setDragging(markerNumber);
    },
    [isAdjustMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging === null || !containerRect) return;
      const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      setMarkerOverride({
        marker_number: dragging,
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    },
    [dragging, containerRect, setMarkerOverride]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  if (!uploadedImage || !analysis) return null;

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Original image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={uploadedImage}
        alt="Uploaded screenshot"
        className="block w-full h-auto"
        draggable={false}
      />

      {/* Bbox overlays */}
      {analysis.findings.map((finding) => (
        <div
          key={`bbox-${finding.marker_number}`}
          className={`absolute border-2 border-dashed pointer-events-none transition-opacity ${
            severityBorderColor(finding.severity)
          } ${
            selectedFinding === finding.marker_number ? "opacity-100" : "opacity-40"
          }`}
          style={{
            left: `${finding.bbox.x}%`,
            top: `${finding.bbox.y}%`,
            width: `${finding.bbox.w}%`,
            height: `${finding.bbox.h}%`,
          }}
        />
      ))}

      {/* Markers */}
      {analysis.findings.map((finding) => {
        const pos = getMarkerPosition(finding);
        const isSelected = selectedFinding === finding.marker_number;

        return (
          <button
            key={`marker-${finding.marker_number}`}
            onMouseDown={(e) => handleMouseDown(e, finding.marker_number)}
            onClick={() => {
              if (!isAdjustMode) {
                setSelectedFinding(isSelected ? null : finding.marker_number);
              }
            }}
            className={`absolute flex items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg transition-all ${
              severityColor(finding.severity)
            } ${isSelected ? "scale-125 ring-2 ring-indigo-400 ring-offset-1 z-20" : "z-10 hover:scale-110"} ${
              isAdjustMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
            }`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: "28px",
              height: "28px",
              transform: `translate(-50%, -50%)${isSelected ? " scale(1.25)" : ""}`,
            }}
            title={finding.title}
          >
            {finding.marker_number}
          </button>
        );
      })}

      {/* Leader lines for overridden markers */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full z-5">
        {analysis.findings.map((finding) => {
          const override = markerOverrides.find(
            (m) => m.marker_number === finding.marker_number
          );
          if (!override) return null;
          const origX = finding.bbox.x + finding.bbox.w / 2;
          const origY = finding.bbox.y + finding.bbox.h / 2;
          return (
            <line
              key={`line-${finding.marker_number}`}
              x1={`${origX}%`}
              y1={`${origY}%`}
              x2={`${override.x}%`}
              y2={`${override.y}%`}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity={0.6}
            />
          );
        })}
      </svg>
    </div>
  );
}
