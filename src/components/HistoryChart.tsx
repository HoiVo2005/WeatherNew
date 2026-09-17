"use client";

import { useMemo } from "react";

export type HistoryEntry = {
  date: string; // YYYY-MM-DD
  max: number;
  min: number;
};

type HistoryChartProps = {
  entries: HistoryEntry[];
  language: "vi" | "en";
};

export default function HistoryChart({
  entries,
  language,
}: HistoryChartProps) {
  const vi = language === "vi";

  const chart = useMemo(() => {
    const points = entries.slice(-30);
    if (points.length < 2) return null;

    const allMins = points.map((p) => p.min);
    const allMaxs = points.map((p) => p.max);
    const lo = Math.min(...allMins);
    const hi = Math.max(...allMaxs);
    const range = Math.max(hi - lo, 2);

    const width = points.length * 34;
    const top = 18;
    const bottom = 86;
    const base = 118;

    const coords = points.map((point, index) => {
      const x = index * 34 + 17;
      const yMax = bottom - ((point.max - lo) / range) * (bottom - top);
      const yMin = bottom - ((point.min - lo) / range) * (bottom - top);
      return { x, yMax, yMin, point, index };
    });

    const avg =
      points.reduce((sum, p) => sum + (p.max + p.min) / 2, 0) / points.length;
    const avgY = bottom - ((avg - lo) / range) * (bottom - top);

    return { width, coords, base, avg, avgY, lo, hi };
  }, [entries]);

  if (!chart) {
    return (
      <p className="wn-history-empty">
        {vi
          ? "Đang ghi lại dữ liệu… quay lại sau vài ngày để thấy biểu đồ."
          : "Collecting data… come back in a few days to see the chart."}
      </p>
    );
  }

  return (
    <div className="wn-history-chart">
      <div className="wn-chart-scroll">
        <svg
          viewBox={`0 0 ${chart.width} 122`}
          width={chart.width}
          height={122}
          className="wn-chart-svg"
          role="img"
        >
          <defs>
            <linearGradient id="histBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Average line */}
          <line
            x1="0"
            y1={chart.avgY}
            x2={chart.width}
            y2={chart.avgY}
            stroke="#8b5cf6"
            strokeWidth="1.4"
            strokeDasharray="4 5"
            strokeOpacity="0.7"
          />
          <text
            x="4"
            y={chart.avgY - 4}
            fontSize="9"
            fill="#8b5cf6"
          >
            {Math.round(chart.avg)}°
          </text>

          {/* Min–max bars */}
          {chart.coords.map((c) => (
            <g key={c.point.date}>
              <rect
                x={c.x - 9}
                y={c.yMax}
                width={18}
                height={Math.max(c.yMin - c.yMax, 3)}
                rx={5}
                fill="url(#histBar)"
                opacity="0.85"
              >
                <title>
                  {c.point.date} — ↑{Math.round(c.point.max)}° ↓
                  {Math.round(c.point.min)}°
                </title>
              </rect>
              <text
                x={c.x}
                y={c.yMax - 5}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                opacity="0.8"
              >
                {Math.round(c.point.max)}°
              </text>
              {c.index % 4 === 0 && (
                <text
                  x={c.x}
                  y={116}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="currentColor"
                  opacity="0.55"
                >
                  {c.point.date.slice(5)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="wn-history-note">
        {vi
          ? `Cao nhất ${Math.round(chart.hi)}° · Thấp nhất ${Math.round(
              chart.lo,
            )}° · Trung bình ${Math.round(chart.avg)}°`
          : `Max ${Math.round(chart.hi)}° · Min ${Math.round(
              chart.lo,
            )}° · Average ${Math.round(chart.avg)}°`}
      </p>
    </div>
  );
}
