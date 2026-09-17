"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function HolidayModal({
  title,
  src,
  alt,
  onClose,
  celebration = false,
  greeting,
  subtitle,
}: {
  title: string;
  src: string;
  alt?: string;
  onClose: () => void;
  /** Bật chế độ chúc mừng cho ngày lễ quan trọng: pháo hoa + lời chúc */
  celebration?: boolean;
  greeting?: string;
  subtitle?: string;
}) {

  // Dùng portal để render ra <body>, tránh việc header (có backdrop-filter/transform)
  // trở thành containing block khiến position: fixed bị sai vị trí.
  // Component chỉ render sau khi đã mount (holidayModalOpen = true) nên document luôn tồn tại.
  return createPortal(
    <div className="wn-holiday-modal" role="dialog" aria-modal="true">
      <div className="wn-holiday-modal__backdrop" onClick={onClose} />

      <div
        className={`wn-holiday-modal__card${celebration ? " is-celebration" : ""}`}
      >
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
            quality={90}
            priority
          />
        </div>

        <div className="wn-holiday-modal__content">
          <h3>{title}</h3>
          {celebration && greeting ? (
            <p className="wn-holiday-modal__greeting">{greeting}</p>
          ) : null}
          {celebration && subtitle ? (
            <p className="wn-holiday-modal__subtitle">{subtitle}</p>
          ) : null}
        </div>

        {celebration ? (
          <div className="wn-fireworks" aria-hidden>
            <span className="fw fw1" />
            <span className="fw fw2" />
            <span className="fw fw3" />
            <span className="fw fw4" />
            <span className="fw fw5" />
            <span className="fw fw6" />
          </div>
        ) : null}

        <div className="wn-holiday-modal__effects">
          <div className="wn-balloons">
            <span className="balloon b1">
              <span className="balloon-string" />
            </span>
            <span className="balloon b2">
              <span className="balloon-string" />
            </span>
            <span className="balloon b3">
              <span className="balloon-string" />
            </span>
            <span className="balloon b4">
              <span className="balloon-string" />
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
