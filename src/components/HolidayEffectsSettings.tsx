"use client";

import { useState } from "react";
import type {
  HolidayEffectSettings,
  HolidayEffectsConfig,
} from "@/types/holiday-effects";

// Bộ hiệu ứng dùng chung mặc định (khi bật chế độ cài chung)
const DEFAULT_EFFECTS: HolidayEffectSettings = {
  snow: { density: 1, wind: 0.3, layers: 3 },
  confetti: { count: 60, colors: ["#ff6b6b", "#ffd93d", "#4d8cff"] },
  fireworks: { enabled: true },
  lanterns: { enabled: true },
};

const DEFAULT_CONFIG: HolidayEffectsConfig = {
  // Mặc định tắt để giữ nguyên hành vi cài riêng từng ngày như cũ
  global: { enabled: false, effects: DEFAULT_EFFECTS },
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

// Kiểu khung hộp điều khiển dùng chung cho khối "Cài đặt chung"
const BOX_STYLE = {
  padding: "10px 10px 8px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(255,255,255,0.32)",
};

const FLEX_BOX_STYLE = {
  ...BOX_STYLE,
  display: "flex",
  alignItems: "center",
};

const LABEL_STYLE = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 700,
} as const;

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
      if (saved) {
        const parsed = JSON.parse(saved) as HolidayEffectsConfig;
        // Ghép với mặc định để tương thích cấu hình cũ chưa có mục "global"
        return {
          ...parsed,
          global: parsed.global ?? DEFAULT_CONFIG.global,
          holidays: parsed.holidays ?? DEFAULT_CONFIG.holidays,
        };
      }
    } catch {
      // window chưa sẵn sàng (SSR) hoặc dữ liệu localStorage lỗi → dùng mặc định
    }
    return DEFAULT_CONFIG;
  });

  // Cập nhật toàn bộ thông số hiệu ứng chung
  function updateGlobal(next: HolidayEffectSettings) {
    setConfig((prev) => ({
      ...prev,
      global: {
        enabled: prev.global?.enabled ?? false,
        effects: next,
      },
    }));
  }

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
          {/* Cài đặt chung: một bộ hiệu ứng áp dụng cho tất cả ngày lễ */}
          <div
            style={{
              marginBottom: 18,
              border: "1px solid rgba(245,158,11,0.35)",
              borderRadius: 20,
              padding: "12px 14px 14px",
              background:
                "linear-gradient(180deg, rgba(255,251,235,0.9), rgba(255,237,213,0.8))",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.16), rgba(251,191,36,0.1))",
                  border: "1px solid rgba(245,158,11,0.28)",
                  color: "#92400e",
                  fontWeight: 800,
                }}
              >
                Cài đặt chung (tất cả ngày lễ)
              </div>

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: config.global?.enabled
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(148,163,184,0.12)",
                  border: config.global?.enabled
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(148,163,184,0.2)",
                  color: config.global?.enabled ? "#166534" : "#475569",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={config.global?.enabled ?? false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setConfig((prev) => ({
                      ...prev,
                      global: {
                        enabled: checked,
                        effects: prev.global?.effects ?? DEFAULT_EFFECTS,
                      },
                    }));
                  }}
                />
                Áp dụng cho tất cả
              </label>
            </div>

            {config.global?.enabled && config.global.effects ? (
              <>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#92400e",
                  }}
                >
                  Một bộ hiệu ứng duy nhất sẽ được dùng cho mọi ngày lễ. Riêng
                  từng ngày vẫn có thể tắt bằng nút &quot;Bật&quot; bên dưới.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div style={BOX_STYLE}>
                    <label style={LABEL_STYLE}>
                      Mật độ tuyết:{" "}
                      {Math.round(
                        (config.global.effects.snow.density || 1) * 100,
                      )}
                      %
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={config.global.effects.snow.density}
                      style={{ width: "100%", accentColor: "#0ea5e9" }}
                      onChange={(e) =>
                        updateGlobal({
                          ...config.global!.effects,
                          snow: {
                            ...config.global!.effects.snow,
                            density: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <div style={BOX_STYLE}>
                    <label style={LABEL_STYLE}>
                      Gió: {(config.global.effects.snow.wind || 0).toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.05"
                      value={config.global.effects.snow.wind}
                      style={{ width: "100%", accentColor: "#0ea5e9" }}
                      onChange={(e) =>
                        updateGlobal({
                          ...config.global!.effects,
                          snow: {
                            ...config.global!.effects.snow,
                            wind: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <div style={BOX_STYLE}>
                    <label style={LABEL_STYLE}>
                      Số pháo giấy: {config.global.effects.confetti.count}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="1"
                      value={config.global.effects.confetti.count}
                      style={{ width: "100%", accentColor: "#f59e0b" }}
                      onChange={(e) =>
                        updateGlobal({
                          ...config.global!.effects,
                          confetti: {
                            ...config.global!.effects.confetti,
                            count: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>

                  <div style={BOX_STYLE}>
                    <label style={LABEL_STYLE}>Màu pháo giấy</label>
                    <input
                      type="text"
                      value={config.global.effects.confetti.colors.join(",")}
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
                        updateGlobal({
                          ...config.global!.effects,
                          confetti: {
                            ...config.global!.effects.confetti,
                            colors: arr,
                          },
                        });
                      }}
                    />
                  </div>

                  <div style={FLEX_BOX_STYLE}>
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
                        checked={config.global.effects.fireworks.enabled}
                        onChange={(e) =>
                          updateGlobal({
                            ...config.global!.effects,
                            fireworks: {
                              ...config.global!.effects.fireworks,
                              enabled: e.target.checked,
                            },
                          })
                        }
                      />
                      Pháo hoa
                    </label>
                  </div>

                  <div style={FLEX_BOX_STYLE}>
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
                        checked={config.global.effects.lanterns.enabled}
                        onChange={(e) =>
                          updateGlobal({
                            ...config.global!.effects,
                            lanterns: {
                              ...config.global!.effects.lanterns,
                              enabled: e.target.checked,
                            },
                          })
                        }
                      />
                      Đèn lồng
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Bật để cấu hình hiệu ứng một lần chung cho tất cả ngày lễ, thay
                vì phải cài riêng cho từng ngày.
              </p>
            )}
          </div>

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

                {config.global?.enabled ? (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 14,
                      border: "1px dashed rgba(245,158,11,0.5)",
                      background: "rgba(255,251,235,0.7)",
                      color: "#92400e",
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Đang dùng cài đặt hiệu ứng chung cho ngày này — tắt nút
                    &quot;Bật&quot; nếu muốn vô hiệu hóa riêng ngày lễ này.
                  </div>
                ) : (
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
                )}
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
              Hủy
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
