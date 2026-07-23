"use client";

import React from "react";

export default function ConfettiSVG({
  count = 30,
  colors: customColors,
}: {
  count?: number;
  colors?: string[];
}) {
  const colors =
    customColors && customColors.length > 0
      ? customColors
      : ["#ff6b6b", "#ffd93d", "#6bffb8", "#4d8cff", "#ff89d1", "#9b59b6"];
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    dur: 2 + Math.random() * 2,
    size: 6 + Math.random() * 12,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotate: Math.random() * 360,
  }));

  return (
    <svg
      className="wn-confetti-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <g id="conf-piece">
          <rect x="-0.5" y="-0.5" width="1" height="1" rx="0.15" />
        </g>
      </defs>
      {pieces.map((p) => (
        <use
          key={p.id}
          href="#conf-piece"
          x={`${p.left}%`}
          y="-5%"
          width={p.size / 4}
          height={p.size / 4}
          transform={`rotate(${p.rotate})`}
          fill={p.color}
          style={{
            animation: `confettiFall ${p.dur}s linear ${p.delay}s infinite`,
            transformOrigin: "center",
            opacity: 0.95,
          }}
        />
      ))}
    </svg>
  );
}
