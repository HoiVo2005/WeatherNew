"use client";

import React, { useEffect, useRef } from "react";

export default function Fireworks({ max = 3 }: { max?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    };
    const bursts: Particle[][] = [];
    const colors = ["#ffd700", "#ff6b6b", "#6bffb8", "#4d8cff", "#ff89d1"];

    function createBurst(x: number, y: number) {
      const n = 20 + Math.floor(Math.random() * 40);
      const arr: Particle[] = [];
      for (let i = 0; i < n; i++) {
        const speed = 1 + Math.random() * 4;
        const angle = Math.random() * Math.PI * 2;
        arr.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 40,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      bursts.push(arr);
    }

    // initial bursts
    for (let i = 0; i < max; i++) {
      createBurst(Math.random() * w, Math.random() * (h * 0.6));
    }

    let tick = 0;
    let raf = 0;

    function loop() {
      tick++;
      ctx.clearRect(0, 0, w, h);
      for (let b = bursts.length - 1; b >= 0; b--) {
        const arr = bursts[b];
        for (let i = arr.length - 1; i >= 0; i--) {
          const p = arr[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.02; // gravity
          p.life -= 1;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life / 80);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          if (p.life <= 0) arr.splice(i, 1);
        }
        if (arr.length === 0) bursts.splice(b, 1);
      }

      if (Math.random() < 0.02) {
        createBurst(Math.random() * w, Math.random() * (h * 0.5));
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [max]);

  return <canvas ref={ref} className="wn-fireworks-canvas" aria-hidden />;
}
