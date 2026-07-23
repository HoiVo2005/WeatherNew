"use client";

import Image from "next/image";
import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function HolidayModal({
  title,
  src,
  alt,
  onClose,
  dismissKey,
}: {
  title: string;
  src: string;
  alt?: string;
  onClose: () => void;
  dismissKey?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [doNotShowAgain, setDoNotShowAgain] = React.useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vr: number;
    };

    const colors = ["#ff6b6b", "#ffd93d", "#6bffb8", "#4d8cff", "#ff89d1"];

    const particles: Particle[] = [];

    function spawn(n = 60) {
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * -height * 0.5,
          vx: (Math.random() - 0.5) * 2.4,
          vy: 2 + Math.random() * 3,
          size: 6 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.2,
        });
      }
    }

    spawn(100);

    let rafId = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        if (p.y - p.size > height) {
          particles.splice(i, 1);
        }
      }

      if (particles.length < 40) spawn(40);

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="wn-holiday-modal" role="dialog" aria-modal="true">
      <div className="wn-holiday-modal__backdrop" onClick={onClose} />

      <div className="wn-holiday-modal__card">
        <button
          className="wn-holiday-modal__close"
          aria-label="Close"
          onClick={() => {
            if (doNotShowAgain && dismissKey) {
              try {
                window.localStorage.setItem(`${dismissKey}-forever`, "1");
              } catch {}
            }

            onClose();
          }}
        >
          <X size={18} />
        </button>

        <div className="wn-holiday-modal__visual">
          <Image
            src={src}
            alt={alt ?? title}
            width={900}
            height={360}
            priority
          />
        </div>

        <div className="wn-holiday-modal__content">
          <h3>{title}</h3>
          <p className="wn-holiday-modal__subtitle">Chúc mừng ngày lễ!</p>
          <label style={{ display: "block", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Không hiển thị nữa cho ngày này
          </label>
        </div>

        <div className="wn-holiday-modal__effects">
          <div className="wn-balloons">
            <span className="balloon b1" />
            <span className="balloon b2" />
            <span className="balloon b3" />
            <span className="balloon b4" />
          </div>

          <div className="wn-fireworks">
            <span className="fw fw1" />
            <span className="fw fw2" />
            <span className="fw fw3" />
          </div>
        </div>
        <canvas ref={canvasRef} className="wn-confetti-canvas" aria-hidden />
      </div>
    </div>
  );
}
