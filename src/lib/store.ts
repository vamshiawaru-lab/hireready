import { create } from "zustand";
import type { AnalysisResponse, Finding } from "./schema";

export interface MarkerPosition {
  marker_number: number;
  x: number; // percentage
  y: number; // percentage
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;

  // Upload
  uploadedImage: string | null; // base64 data URL
  uploadedFilename: string | null;
  imageDimensions: { width: number; height: number } | null;
  setUploadedImage: (dataUrl: string, filename: string) => void;
  setImageDimensions: (dims: { width: number; height: number }) => void;
  clearUpload: () => void;

  // Analysis
  analysis: AnalysisResponse | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisStep: string;
  setAnalysis: (analysis: AnalysisResponse) => void;
  setAnalyzing: (val: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalysisStep: (step: string) => void;

  // Marker adjustments
  markerOverrides: MarkerPosition[];
  setMarkerOverride: (marker: MarkerPosition) => void;
  resetMarkerOverrides: () => void;

  // UI state
  selectedFinding: number | null; // marker_number
  setSelectedFinding: (num: number | null) => void;
  isAdjustMode: boolean;
  setAdjustMode: (val: boolean) => void;

  // Computed: get finding with adjusted position
  getAdjustedFindings: () => Finding[];

  // Reset all
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  setAuthenticated: (val) => set({ isAuthenticated: val }),

  // Upload
  uploadedImage: null,
  uploadedFilename: null,
  imageDimensions: null,
  setUploadedImage: (dataUrl, filename) =>
    set({ uploadedImage: dataUrl, uploadedFilename: filename }),
  setImageDimensions: (dims) => set({ imageDimensions: dims }),
  clearUpload: () =>
    set({
      uploadedImage: null,
      uploadedFilename: null,
      imageDimensions: null,
      analysis: null,
      analysisError: null,
      markerOverrides: [],
      selectedFinding: null,
    }),

  // Analysis
  analysis: null,
  isAnalyzing: false,
  analysisError: null,
  analysisStep: "",
  setAnalysis: (analysis) => set({ analysis, isAnalyzing: false, analysisError: null }),
  setAnalyzing: (val) => set({ isAnalyzing: val }),
  setAnalysisError: (error) => set({ analysisError: error, isAnalyzing: false }),
  setAnalysisStep: (step) => set({ analysisStep: step }),

  // Marker adjustments
  markerOverrides: [],
  setMarkerOverride: (marker) =>
    set((state) => ({
      markerOverrides: [
        ...state.markerOverrides.filter((m) => m.marker_number !== marker.marker_number),
        marker,
      ],
    })),
  resetMarkerOverrides: () => set({ markerOverrides: [] }),

  // UI state
  selectedFinding: null,
  setSelectedFinding: (num) => set({ selectedFinding: num }),
  isAdjustMode: false,
  setAdjustMode: (val) => set({ isAdjustMode: val }),

  // Get findings with adjusted marker positions
  getAdjustedFindings: () => {
    const { analysis, markerOverrides } = get();
    if (!analysis) return [];
    return analysis.findings.map((f) => {
      const override = markerOverrides.find((m) => m.marker_number === f.marker_number);
      if (override) {
        return {
          ...f,
          bbox: {
            ...f.bbox,
            x: override.x - f.bbox.w / 2,
            y: override.y - f.bbox.h / 2,
          },
        };
      }
      return f;
    });
  },

  resetAll: () =>
    set({
      uploadedImage: null,
      uploadedFilename: null,
      imageDimensions: null,
      analysis: null,
      isAnalyzing: false,
      analysisError: null,
      analysisStep: "",
      markerOverrides: [],
      selectedFinding: null,
      isAdjustMode: false,
    }),
}));
