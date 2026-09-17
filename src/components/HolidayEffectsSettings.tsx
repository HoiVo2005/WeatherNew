"use client";

import { useState } from "react";
import type { HolidayEffectsConfig } from "@/types/holiday-effects";

const DEFAULT_CONFIG: HolidayEffectsConfig = {
  holidays: {
    "12-24": {
      enabled: true,
      effects: {
        snow: { density: 1, wind: 0.3, layers: 3 },
        confetti: { count: 40, colors: ["#ff6b6b", "#ffd93d"] },
        fireworks: { enabled: false },
        lanterns: { enabled: false },
      },
    },
    "12-25": {
      enabled: true,
      effects: {
        snow: { density: 1.2, wind: 0.25, layers: 3 },
        confetti: { count: 60, colors: ["#ff6b6b", "#ffd93d", "#4d8cff"] },
        fireworks: { enabled: false },
        lanterns: { enabled: false },
      },
    },
    "12-31": {
      enabled: true,
      effects: {
        snow: { density: 0.6, wind: 0.45, layers: 2 },
        confetti: { count: 80, colors: ["#ffd93d", "#ff89d1"] },
        fireworks: { enabled: true },
        lanterns: { enabled: false },
      },
    },
    "01-01": {
      enabled: true,
      effects: {
        snow: { density: 0.4, wind: 0.2, layers: 2 },
        confetti: { count: 70, colors: ["#ffd93d", "#ff6b6b"] },
        fireworks: { enabled: true },
        lanterns: { enabled: true },
      },
    },
  },
};

export default function HolidayEffectsSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [config, setConfig] = useState<HolidayEffectsConfig>(() => {
    try {
      const saved = window.localStorage.getItem("holiday-effects-config");
      if (saved) return JSON.parse(saved) as HolidayEffectsConfig;
    } catch {
      // window chưa sẵn sàng (SSR) hoặc dữ liệu localStorage lỗi → dùng mặc định
    }
    return DEFAULT_CONFIG;
  });

  function save() {
    try {
      window.localStorage.setItem(
        "holiday-effects-config",
        JSON.stringify(config),
      );
    } catch {}
    onClose();
  }

  if (!open) return null;

  return (
    <div className="wn-calendar-light-overlay" role="dialog" aria-modal>
      <div
        className="wn-calendar-light-modal"
        style={{
          maxWidth: 760,
          background:
            "radial-gradient(circle at top right, rgba(125, 211, 252, 0.24), transparent 32%), linear-gradient(135deg, #f0f8ff 0%, #eaf3ff 45%, #e4f0ff 100%)",
          border: "1px solid rgba(96, 165, 250, 0.22)",
          boxShadow:
            "0 32px 90px rgba(37, 99, 235, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <header
          className="wn-calendar-light-header"
          style={{ padding: "12px 22px 14px" }}
        >
          <div>
            <span className="wn-calendar-light-kicker">Cài đặt hiệu ứng</span>
            <h3
              style={{
                margin: "8px 0 0",
                fontSize: 30,
                letterSpacing: "-0.04em",
              }}
            >
              Hiệu ứng theo ngày lễ
            </h3>
          </div>

          <button
            className="wn-calendar-light-close"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: "rgba(255,255,255,0.9)",
            }}
          >
            ×
          </button>
        </header>

        <div style={{ padding: 18 }}>
          {Object.keys(config.holidays).map((key) => {
            const item = config.holidays[key];
            return (
              <div
                key={key}
                style={{
                  marginBottom: 16,
                  border: "1px solid rgba(96, 165, 250, 0.18)",
                  borderRadius: 20,
                  padding: "12px 14px 10px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.62), rgba(233,244,255,0.82))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: 999,
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(56,189,248,0.08))",
                      border: "1px solid rgba(59,130,246,0.16)",
                      color: "#0d47a1",
                      fontWeight: 800,
                    }}
                  >
                    {key}
                  </div>

                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: item.enabled
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(148,163,184,0.12)",
                      border: item.enabled
                        ? "1px solid rgba(34,197,94,0.2)"
                        : "1px solid rgba(148,163,184,0.2)",
                      color: item.enabled ? "#166534" : "#475569",
                      fontWeight: 700,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          holidays: {
                            ...prev.holidays,
                            [key]: { ...item, enabled: e.target.checked },
                          },
                        }));
                      }}
                    />
                    Bật
                  </label>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 10px 8px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Mật độ tuyết:{" "}
                      {Math.round((item.effects.snow.density || 1) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={item.effects.snow.density}
                      style={{ width: "100%", accentColor: "#0ea5e9" }}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setConfig((prev) => ({
                          ...prev,
                          holidays: {
                            ...prev.holidays,
                            [key]: {
                              ...item,
                              effects: {
                                ...item.effects,
                                snow: {
                                  ...item.effects.snow,
                                  density: val,
                                },
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px 10px 8px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Gió: {(item.effects.snow.wind || 0).toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={item.effects.snow.wind}
                      style={{ width: "100%", accentColor: "#0ea5e9" }}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setConfig((prev) => ({
                          ...prev,
                          holidays: {
                            ...prev.holidays,
                            [key]: {
                              ...item,
                              effects: {
                                ...item.effects,
                                snow: {
                                  ...item.effects.snow,
                                  wind: val,
                                },
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px 10px 8px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Số pháo hoa: {item.effects.confetti.count}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="1"
                      value={item.effects.confetti.count}
                      style={{ width: "100%", accentColor: "#f59e0b" }}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setConfig((prev) => ({
                          ...prev,
                          holidays: {
                            ...prev.holidays,
                            [key]: {
                              ...item,
                              effects: {
                                ...item.effects,
                                confetti: {
                                  ...item.effects.confetti,
                                  count: val,
                                },
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "10px 10px 8px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      Màu pháo hoa
                    </label>
                    <input
                      type="text"
                      value={item.effects.confetti.colors.join(",")}
                      style={{
                        width: "100%",
                        border: "1px solid rgba(148,163,184,0.25)",
                        borderRadius: 10,
                        padding: "8px 10px",
                        background: "rgba(255,255,255,0.8)",
                        color: "#0f172a",
                        fontSize: 12,
                      }}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setConfig((prev) => ({
                          ...prev,
                          holidays: {
                            ...prev.holidays,
                            [key]: {
                              ...item,
                              effects: {
                                ...item.effects,
                                confetti: {
                                  ...item.effects.confetti,
                                  colors: arr,
                                },
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.effects.fireworks.enabled}
                        onChange={(e) => {
                          setConfig((prev) => ({
                            ...prev,
                            holidays: {
                              ...prev.holidays,
                              [key]: {
                                ...item,
                                effects: {
                                  ...item.effects,
                                  fireworks: {
                                    ...item.effects.fireworks,
                                    enabled: e.target.checked,
                                  },
                                },
                              },
                            },
                          }));
                        }}
                      />
                      Pháo hoa
                    </label>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.18)",
                      background: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.effects.lanterns.enabled}
                        onChange={(e) => {
                          setConfig((prev) => ({
                            ...prev,
                            holidays: {
                              ...prev.holidays,
                              [key]: {
                                ...item,
                                effects: {
                                  ...item.effects,
                                  lanterns: {
                                    ...item.effects.lanterns,
                                    enabled: e.target.checked,
                                  },
                                },
                              },
                            },
                          }));
                        }}
                      />
                      Đèn lồng
                    </label>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 6,
            }}
          >
            <button
              className="wn-popover__close"
              onClick={onClose}
              style={{ width: 92, height: 42, borderRadius: 12 }}
            >
              Há»§y
            </button>
            <button
              className="wn-popover__primary"
              onClick={save}
              style={{
                width: 92,
                minHeight: 42,
                marginBottom: 0,
                borderRadius: 12,
              }}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
