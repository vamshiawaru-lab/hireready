import type { Finding } from "./schema";
import type { MarkerPosition } from "./store";

const MARKER_RADIUS = 16;
const MARKER_FONT_SIZE = 14;

function getMarkerCenter(finding: Finding, overrides: MarkerPosition[]): { x: number; y: number } {
  const override = overrides.find((m) => m.marker_number === finding.marker_number);
  if (override) {
    return { x: override.x, y: override.y };
  }
  // Center of bbox
  return {
    x: finding.bbox.x + finding.bbox.w / 2,
    y: finding.bbox.y + finding.bbox.h / 2,
  };
}

function severityColor(severity: number): string {
  switch (severity) {
    case 1:
      return "#3B82F6"; // blue
    case 2:
      return "#F59E0B"; // amber
    case 3:
      return "#F97316"; // orange
    case 4:
      return "#EF4444"; // red
    case 5:
      return "#991B1B"; // dark red
    default:
      return "#6B7280"; // gray
  }
}

export async function renderAnnotatedImage(
  imageDataUrl: string,
  findings: Finding[],
  markerOverrides: MarkerPosition[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Scale marker size based on image dimensions
      const scale = Math.max(1, Math.min(img.naturalWidth, img.naturalHeight) / 800);
      const radius = MARKER_RADIUS * scale;
      const fontSize = MARKER_FONT_SIZE * scale;

      // Draw markers
      findings.forEach((finding) => {
        const center = getMarkerCenter(finding, markerOverrides);
        const px = (center.x / 100) * img.naturalWidth;
        const py = (center.y / 100) * img.naturalHeight;
        const color = severityColor(finding.severity);

        // Draw bbox rectangle
        const bx = (finding.bbox.x / 100) * img.naturalWidth;
        const by = (finding.bbox.y / 100) * img.naturalHeight;
        const bw = (finding.bbox.w / 100) * img.naturalWidth;
        const bh = (finding.bbox.h / 100) * img.naturalHeight;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([6 * scale, 3 * scale]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        // Leader line from bbox center to marker if overridden
        const override = markerOverrides.find((m) => m.marker_number === finding.marker_number);
        if (override) {
          const origX = ((finding.bbox.x + finding.bbox.w / 2) / 100) * img.naturalWidth;
          const origY = ((finding.bbox.y + finding.bbox.h / 2) / 100) * img.naturalHeight;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5 * scale;
          ctx.setLineDash([4 * scale, 2 * scale]);
          ctx.beginPath();
          ctx.moveTo(origX, origY);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw circle marker
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5 * scale;
        ctx.stroke();

        // Draw number
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(finding.marker_number), px, py + 1);
      });

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageDataUrl;
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
