"use client";

import { useEffect, useState } from "react";

interface VoteActivityChartProps {
  data: { hour: number; votes: number }[];
}

export function VoteActivityChart({ data }: VoteActivityChartProps) {
  const [drawn, setDrawn] = useState(false);
  const maxVotes = Math.max(...data.map((d) => d.votes), 1);
  const width = 400;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.votes / maxVotes) * chartH;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const yTicks = [0, Math.round(maxVotes / 4), Math.round(maxVotes / 2), Math.round((3 * maxVotes) / 4), maxVotes];

  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Calculate approximate path length for animation
  const pathLength = points.reduce((len, p, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return len + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
  }, 0);

  return (
    <div className="bg-white rounded-xl border border-[#ebebeb] p-5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <h3 className="text-lg font-medium text-[#171717] mb-4" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
        Vote Activity (Hourly)
      </h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxVotes) * chartH;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#ebebeb"
                strokeWidth="1"
              />
              <text x={padding.left - 5} y={y + 4} textAnchor="end" className="text-[10px] fill-[#5c5c5c]">
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={areaD}
          fill="url(#areaGradient)"
          className="transition-opacity duration-[800ms]"
          style={{ opacity: drawn ? 1 : 0 }}
        />
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#335cff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#335cff" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Line with draw animation */}
        <path
          d={pathD}
          fill="none"
          stroke="#335cff"
          strokeWidth="2"
          strokeDasharray={pathLength}
          strokeDashoffset={drawn ? 0 : pathLength}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={p.hour}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#335cff"
            className="transition-all duration-[400ms]"
            style={{
              opacity: drawn ? 1 : 0,
              transitionDelay: `${600 + i * 50}ms`,
            }}
          />
        ))}

        {/* X-axis labels */}
        {points.map((p) => (
          <text
            key={p.hour}
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            className="text-[9px] fill-[#5c5c5c]"
          >
            {p.hour > 12 ? `${p.hour - 12}pm` : p.hour === 12 ? "12pm" : `${p.hour}am`}
          </text>
        ))}
      </svg>
    </div>
  );
}
