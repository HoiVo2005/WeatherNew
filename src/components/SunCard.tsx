"use client";

import { useMemo } from "react";
import { Sunrise, Sunset } from "lucide-react";

export type SunCardHour = {
  time: string;
  temperature: number;
  rainChance: number;
  uvIndex: number;
};

type SunCardProps = {
  sunrise: string;
  sunset: string;
  uvIndex: number;
  hours: SunCardHour[];
  currentTime: Date;
  language: "vi" | "en";
};

function parseApiTime(value: string) {
  return new Date(value.length <= 16 ? `${value}:00` : value).getTime();
}

function formatTime(value: string, language: "vi" | "en") {
  const date = new Date(value.length <= 16 ? `${value}:00` : value);
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function uvLevel(uv: number) {
  if (uv < 3) return { label: "Thấp", en: "Low", color: "#22c55e" };
  if (uv < 6) return { label: "Trung bình", en: "Moderate", color: "#eab308" };
  if (uv < 8) return { label: "Cao", en: "High", color: "#f97316" };
  if (uv < 11) return { label: "Rất cao", en: "Very high", color: "#ef4444" };
  return { label: "Độc hại", en: "Extreme", color: "#a855f7" };
}

export default function SunCard({
  sunrise,
  sunset,
  uvIndex,
  hours,
  currentTime,
  language,
}: SunCardProps) {
  const vi = language === "vi";

  const sun = useMemo(() => {
    const rise = parseApiTime(sunrise);
    const set = parseApiTime(sunset);
    const now = currentTime.getTime();
    const progress = Math.max(0, Math.min(1, (now - rise) / Math.max(set - rise, 1)));
    const durationMs = Math.max(set - rise, 0);
    return {
      progress,
      durationHours: Math.floor(durationMs / 3600000),
      durationMinutes: Math.round((durationMs % 3600000) / 60000),
    };
  }, [sunrise, sunset, currentTime]);

  const chart = useMemo(() => {
    const points = hours.slice(0, 48);
    if (points.length < 2) return null;

    const width = points.length * 30;
    const chartTop = 22;
    const chartBottom = 92;
    const barBase = 122;

    const temps = points.map((p) => p.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = Math.max(maxTemp - minTemp, 1);

    const coords = points.map((point, index) => {
      const x = index * 30 + 15;
      const y = chartBottom - ((point.temperature - minTemp) / range) * (chartBottom - chartTop);
      return { x, y, point, index };
    });

    const linePath = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(" ");
    const areaPath = `${linePath} L${coords[coords.length - 1].x},${chartBottom} L${coords[0].x},${chartBottom} Z`;

    return { width, coords, linePath, areaPath, barBase, minTemp, maxTemp };
  }, [hours]);

  const level = uvLevel(uvIndex);
  const sunX = 40 + sun.progress * 320;
  const sunY = 125 - Math.sin(sun.progress * Math.PI) * 88;

  return (
    <article className="wn-panel wn-sun-card">
      <div className="wn-section-heading">
        <div>
          <span>SUN &amp; UV</span>
          <h2>{vi ? "Mặt trời & chỉ số UV" : "Sun path & UV index"}</h2>
        </div>
      </div>

      <div className="wn-sun-grid">
        <div className="wn-sun-path">
          <svg viewBox="0 0 400 150" className="wn-sun-svg" aria-hidden="true">
            <defs>
              <linearGradient id="sunArcFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M 40 125 Q 200 8 360 125 L 360 125 L 40 125 Z" fill="url(#sunArcFill)" />
            <path
              d="M 40 125 Q 200 8 360 125"
              fill="none"
              stroke="#f59e0b"
              strokeOpacity="0.55"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
            <line x1="16" y1="125" x2="384" y2="125" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
            <circle cx={sunX} cy={sunY} r="26" fill="url(#sunGlow)" />
            <circle cx={sunX} cy={sunY} r="10" fill="#fbbf24" stroke="#fde68a" strokeWidth="3" />
          </svg>

          <div className="wn-sun-times">
            <span className="wn-sun-time">
              <Sunrise size={16} />
              <strong>{formatTime(sunrise, language)}</strong>
              <small>{vi ? "mọc" : "rise"}</small>
            </span>
            <span className="wn-sun-duration">
              {vi
                ? `Ban ngày ${sun.durationHours}g ${sun.durationMinutes}p`
                : `${sun.durationHours}h ${sun.durationMinutes}m of daylight`}
            </span>
            <span className="wn-sun-time wn-sun-time--end">
              <Sunset size={16} />
              <strong>{formatTime(sunset, language)}</strong>
              <small>{vi ? "lặn" : "set"}</small>
            </span>
          </div>
        </div>

        <div className="wn-uv-box" style={{ borderColor: level.color }}>
          <span className="wn-uv-label">UV</span>
          <strong className="wn-uv-value" style={{ color: level.color }}>
            {uvIndex.toFixed(1)}
          </strong>
          <span className="wn-uv-level" style={{ color: level.color }}>
            {vi ? level.label : level.en}
          </span>
          <div className="wn-uv-scale">
            {[0, 1, 2, 3, 4].map((i) => {
              const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7"];
              return (
                <i
                  key={i}
                  style={{
                    background: colors[i],
                    opacity: i <= Math.min(Math.floor(uvIndex / 2.2), 4) ? 1 : 0.18,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {chart && (
        <div className="wn-chart">
          <div className="wn-chart-title">
            {vi ? "Dự báo 48 giờ tới" : "Next 48 hours"}
            <small>
              {vi
                ? `Nhiệt độ · khả năng mưa (thấp nhất ${Math.round(chart.minTemp)}° — cao nhất ${Math.round(chart.maxTemp)}°)`
                : `Temperature · rain chance (${Math.round(chart.minTemp)}° to ${Math.round(chart.maxTemp)}°)`}
            </small>
          </div>
          <div className="wn-chart-scroll">
            <svg
              viewBox={`0 0 ${chart.width} 132`}
              width={chart.width}
              height={132}
              className="wn-chart-svg"
              role="img"
            >
              <defs>
                <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {chart.coords.map((c) => (
                <g key={`bar-${c.point.time}`}>
                  <rect
                    x={c.x - 9}
                    y={chart.barBase - (c.point.rainChance / 100) * 34}
                    width={18}
                    height={(c.point.rainChance / 100) * 34}
                    rx={3}
                    fill={c.point.rainChance >= 20 ? "#3b82f6" : "#3b82f655"}
                  />
                  {c.index % 3 === 0 && c.point.rainChance >= 10 && (
                    <text
                      x={c.x}
                      y={chart.barBase - (c.point.rainChance / 100) * 34 - 3}
                      textAnchor="middle"
                      fontSize="8.5"
                      fill="#93c5fd"
                    >
                      {c.point.rainChance}%
                    </text>
                  )}
                </g>
              ))}

              <path d={chart.areaPath} fill="url(#tempArea)" />
              <path
                d={chart.linePath}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {chart.coords.map((c) => (
                <g key={`dot-${c.point.time}`}>
                  <circle cx={c.x} cy={c.y} r="2.6" fill="#f97316">
                    <title>
                      {formatTime(c.point.time, language)} — {Math.round(c.point.temperature)}° ·{" "}
                      {c.point.rainChance}%
                    </title>
                  </circle>
                  {c.index % 3 === 0 && (
                    <text
                      x={c.x}
                      y={c.y - 8}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="currentColor"
                      opacity="0.85"
                    >
                      {Math.round(c.point.temperature)}°
                    </text>
                  )}
                  {c.index % 6 === 0 && (
                    <text
                      x={c.x}
                      y={128}
                      textAnchor="middle"
                      fontSize="9"
                      fill="currentColor"
                      opacity="0.55"
                    >
                      {formatTime(c.point.time, language)}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

    </article>
  );
}

