"use client";

import React, { useEffect, useRef } from "react";

export default function AdvancedSnow({
  wind = 0.3,
  layers = 3,
  density = 1,
}: {
  wind?: number;
  layers?: number;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    type Flake = {
      x: number;
      y: number;
      r: number;
      d: number;
      vx: number;
      vy: number;
      layer: number;
    };
    const flakes: Flake[] = [];

    const layerCount = Math.max(1, Math.min(5, layers));
    for (let l = 0; l < layerCount; l++) {
      const base = 40 * (l + 1);
      const count = Math.max(6, Math.floor(base * Math.max(0.1, density)));
      for (let i = 0; i < count; i++) {
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * (2 + l * 1.5) + 1,
          d: Math.random() * 100,
          vx: (Math.random() - 0.5) * (0.2 + l * 0.3) + wind * (0.2 + l * 0.1),
          vy: 0.3 + Math.random() * (0.6 + l * 0.6),
          layer: l,
        });
      }
    }

    let last = performance.now();
    let raf = 0;

    function update(now: number) {
      const dt = (now - last) / 16.666;
      last = now;
      ctx.clearRect(0, 0, width, height);

      // draw layered flakes with parallax effect
      for (let l = 0; l < layerCount; l++) {
        ctx.save();
        const depth = 1 + l * 0.5;
        ctx.globalAlpha = 0.9 - l * 0.2;
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < flakes.length; i++) {
          const f = flakes[i];
          if (f.layer !== l) continue;
          f.x += f.vx * dt * (0.6 + l * 0.8);
          f.y += f.vy * dt * (0.6 + l * 0.8);
          if (f.x > width + 10) f.x = -10;
          if (f.x < -10) f.x = width + 10;
          if (f.y > height + 10) {
            f.y = -10;
            f.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * (1 + l * 0.15), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(update);
    }

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [wind, layers, density]);

  return <canvas ref={ref} className="wn-advanced-snow" aria-hidden />;
}
