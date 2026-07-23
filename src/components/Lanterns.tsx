"use client";

import React, { useEffect, useRef } from "react";

export default function Lanterns({ count = 8 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const d = document.createElement("div");
      d.className = "wn-lantern";
      d.style.left = `${10 + Math.random() * 80}%`;
      d.style.animationDelay = `${Math.random() * 3}s`;
      d.style.transform = `translateY(${20 + Math.random() * 20}vh)`;
      el.appendChild(d);
      pieces.push(d);
    }

    return () => {
      pieces.forEach((p) => p.remove());
    };
  }, [count]);

  return <div ref={containerRef} className="wn-lanterns" aria-hidden />;
}
