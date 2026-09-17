"use client";

import { useEffect, useRef } from "react";

export type WeatherFxScene =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "storm";

type Drop = {
  x: number;
  y: number;
  length: number;
  speed: number;
  drift: number;
  opacity: number;
};

type Star = { x: number; y: number; radius: number; phase: number; twinkleSpeed: number };

type FogBlob = { x: number; y: number; radius: number; speed: number; opacity: number };

type FlashState = { until: number; next: number };

const INTENSITY: Record<
  "drizzle" | "rain" | "heavy-rain" | "storm",
  { count: number; speed: number; length: number; width: number }
> = {
  drizzle: { count: 90, speed: 220, length: 9, width: 1 },
  rain: { count: 170, speed: 380, length: 14, width: 1.2 },
  "heavy-rain": { count: 300, speed: 560, length: 20, width: 1.5 },
  storm: { count: 320, speed: 640, length: 22, width: 1.7 },
};

function createDrop(width: number, height: number, cfg: (typeof INTENSITY)["rain"], random: boolean): Drop {
  return {
    x: Math.random() * (width + 120) - 60,
    y: random ? Math.random() * height : -30 - Math.random() * 80,
    length: cfg.length * (0.6 + Math.random() * 0.8),
    speed: cfg.speed * (0.7 + Math.random() * 0.6),
    drift: 0.35 + Math.random() * 0.5,
    opacity: 0.18 + Math.random() * 0.4,
  };
}

function createStar(width: number, height: number): Star {
  return {
    x: Math.random() * width,
    y: Math.random() * height * 0.75,
    radius: 0.5 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.4 + Math.random() * 1.4,
  };
}

function createFogBlob(width: number, height: number): FogBlob {
  return {
    x: Math.random() * width,
    y: height * (0.3 + Math.random() * 0.65),
    radius: 140 + Math.random() * 260,
    speed: (6 + Math.random() * 14) * (Math.random() > 0.5 ? 1 : -1),
    opacity: 0.05 + Math.random() * 0.08,
  };
}

function intensityFor(scene: WeatherFxScene) {
  if (scene === "drizzle") return INTENSITY.drizzle;
  if (scene === "rain") return INTENSITY.rain;
  if (scene === "heavy-rain") return INTENSITY["heavy-rain"];
  if (scene === "storm") return INTENSITY.storm;
  return null;
}

export default function WeatherFX({ scene }: { scene: WeatherFxScene }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<WeatherFxScene>(scene);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let drops: Drop[] = [];
    let stars: Star[] = [];
    let fogBlobs: FogBlob[] = [];
    const flash: FlashState = { until: 0, next: 0 };
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rebuildParticles = () => {
      const current = sceneRef.current;
      const cfg = intensityFor(current);

      drops = cfg
        ? Array.from({ length: cfg.count }, () => createDrop(width, height, cfg, true))
        : [];

      stars =
        current === "clear-night" || current === "partly-cloudy-night"
          ? Array.from({ length: 90 }, () => createStar(width, height))
          : [];

      fogBlobs =
        current === "fog"
          ? Array.from({ length: 14 }, () => createFogBlob(width, height))
          : [];

      flash.next = performance.now() + 1500 + Math.random() * 4000;
    };

    resize();
    rebuildParticles();

    const onResize = () => {
      resize();
      rebuildParticles();
    };

    window.addEventListener("resize", onResize);

    const render = (now: number) => {
      frame = window.requestAnimationFrame(render);

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const current = sceneRef.current;
      context.clearRect(0, 0, width, height);

      if (stars.length > 0) {
        for (const star of stars) {
          const twinkle =
            0.35 + 0.65 * (0.5 + 0.5 * Math.sin((now / 1000) * star.twinkleSpeed + star.phase));
          context.beginPath();
          context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${0.55 * twinkle})`;
          context.fill();
        }
      }

      if (fogBlobs.length > 0) {
        for (const blob of fogBlobs) {
          blob.x += blob.speed * delta;
          if (blob.x < -blob.radius) blob.x = width + blob.radius;
          if (blob.x > width + blob.radius) blob.x = -blob.radius;

          const gradient = context.createRadialGradient(
            blob.x,
            blob.y,
            blob.radius * 0.1,
            blob.x,
            blob.y,
            blob.radius,
          );
          gradient.addColorStop(0, `rgba(226, 236, 245, ${blob.opacity})`);
          gradient.addColorStop(1, "rgba(226, 236, 245, 0)");
          context.fillStyle = gradient;
          context.fillRect(
            blob.x - blob.radius,
            blob.y - blob.radius,
            blob.radius * 2,
            blob.radius * 2,
          );
        }
      }

      if (drops.length > 0) {
        const cfg = intensityFor(current) ?? INTENSITY.rain;
        context.lineWidth = cfg.width;
        context.lineCap = "round";

        for (const drop of drops) {
          drop.y += drop.speed * delta;
          drop.x += drop.speed * drop.drift * delta * 0.35;

          if (drop.y > height + 40) {
            const fresh = createDrop(width, height, cfg, false);
            drop.x = fresh.x;
            drop.y = fresh.y;
            drop.length = fresh.length;
            drop.speed = fresh.speed;
            drop.drift = fresh.drift;
            drop.opacity = fresh.opacity;
          }

          context.beginPath();
          context.moveTo(drop.x, drop.y);
          context.lineTo(drop.x - drop.drift * drop.length * 0.4, drop.y + drop.length);
          context.strokeStyle = `rgba(174, 205, 235, ${drop.opacity})`;
          context.stroke();
        }
      }

      if (current === "storm") {
        if (now > flash.next) {
          flash.until = now + 90 + Math.random() * 120;
          flash.next = now + 3500 + Math.random() * 7000;
        }

        if (now < flash.until) {
          const strength = 0.08 + Math.random() * 0.1;
          context.fillStyle = `rgba(255, 255, 255, ${strength})`;
          context.fillRect(0, 0, width, height);
        }
      }
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`wn-fx-canvas wn-fx-canvas--${scene}`}
      aria-hidden="true"
    />
  );
}

