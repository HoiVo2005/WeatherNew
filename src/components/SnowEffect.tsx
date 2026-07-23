"use client";

import React from "react";

export default function SnowEffect({ count = 60 }: { count?: number }) {
  const flakes = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="wn-snow" aria-hidden>
      {flakes.map((i) => (
        <span key={i} className={`wn-snow__flake f${(i % 6) + 1}`} />
      ))}
    </div>
  );
}
