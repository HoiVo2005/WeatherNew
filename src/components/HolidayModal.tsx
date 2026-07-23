"use client";

import Image from "next/image";
import { X } from "lucide-react";
import React from "react";

export default function HolidayModal({
  title,
  src,
  alt,
  onClose,
}: {
  title: string;
  src: string;
  alt?: string;
  onClose: () => void;
}) {
  return (
    <div className="wn-holiday-modal" role="dialog" aria-modal="true">
      <div className="wn-holiday-modal__backdrop" onClick={onClose} />

      <div className="wn-holiday-modal__card">
        <button
          className="wn-holiday-modal__close"
          aria-label="Close"
          onClick={onClose}
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
      </div>
    </div>
  );
}
