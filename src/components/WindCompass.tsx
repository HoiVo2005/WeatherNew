"use client";

export default function WindCompass({
  degrees,
  size = 26,
}: {
  degrees: number;
  size?: number;
}) {
  // Meteorological degrees = direction wind COMES FROM.
  // Needle points where the wind blows TO (degrees + 180).
  const flow = degrees + 180;

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label="Wind direction"
      style={{ transform: `rotate(${flow}deg)` }}
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {/* Arrow pointing with the wind flow */}
      <path
        d="M20 6 L25 24 L20 20 L15 24 Z"
        fill="#0876ed"
        stroke="#0ea5e9"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
