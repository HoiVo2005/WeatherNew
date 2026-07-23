"use client";

import React, { useEffect, useState } from "react";

const DEFAULT_CONFIG = {
  holidays: {
    "12-24": { enabled: true, effects: { snow: { density: 1, wind: 0.3, layers: 3 }, confetti: { count: 40, colors: ["#ff6b6b", "#ffd93d"] }, fireworks: { enabled: false }, lanterns: { enabled: false } } },
    "12-25": { enabled: true, effects: { snow: { density: 1.2, wind: 0.25, layers: 3 }, confetti: { count: 60, colors: ["#ff6b6b","#ffd93d","#4d8cff"] }, fireworks: { enabled: false }, lanterns: { enabled: false } } },
    "12-31": { enabled: true, effects: { snow: { density: 0.6, wind: 0.45, layers: 2 }, confetti: { count: 80, colors: ["#ffd93d","#ff89d1"] }, fireworks: { enabled: true }, lanterns: { enabled: false } } },
    "01-01": { enabled: true, effects: { snow: { density: 0.4, wind: 0.2, layers: 2 }, confetti: { count: 70, colors: ["#ffd93d","#ff6b6b"] }, fireworks: { enabled: true }, lanterns: { enabled: true } } },
  },
};

export default function HolidayEffectsSettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [config, setConfig] = useState<any>(DEFAULT_CONFIG);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("holiday-effects-config");
      if (saved) setConfig(JSON.parse(saved));
    } catch {}
  }, []);

  function save() {
    try {
      window.localStorage.setItem("holiday-effects-config", JSON.stringify(config));
    } catch {}
    onClose();
  }

  if (!open) return null;

  return (
    <div className="wn-calendar-light-overlay" role="dialog" aria-modal>
      <div className="wn-calendar-light-modal" style={{ maxWidth: 720 }}>
        <header className="wn-calendar-light-header">
          <div>
            <span className="wn-calendar-light-kicker">Cài đặt hiệu ứng</span>
            <h3>Hiệu ứng theo ngày lễ</h3>
          </div>

          <button className="wn-calendar-light-close" onClick={onClose} aria-label="Đóng">×</button>
        </header>

        <div style={{ padding: 16 }}>
          {Object.keys(config.holidays).map((key) => {
            const item = config.holidays[key];
            return (
              <div key={key} style={{ marginBottom: 14, borderBottom: "1px solid var(--wn-border)", paddingBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{key}</strong>
                  <label>
                    <input type="checkbox" checked={item.enabled} onChange={(e) => { setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, enabled: e.target.checked } } })); }} />
                    &nbsp;Bật
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>
                    <label>Snow density: {Math.round((item.effects.snow.density||1)*100)}%</label>
                    <input type="range" min="0" max="2" step="0.05" value={item.effects.snow.density} onChange={(e) => { const val = Number(e.target.value); setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, snow: { ...item.effects.snow, density: val } } } })); }} />
                  </div>

                  <div>
                    <label>Wind: { (item.effects.snow.wind||0).toFixed(2) }</label>
                    <input type="range" min="-1" max="1" step="0.05" value={item.effects.snow.wind} onChange={(e) => { const val = Number(e.target.value); setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, snow: { ...item.effects.snow, wind: val } } } })); }} />
                  </div>

                  <div>
                    <label>Confetti count: {item.effects.confetti.count}</label>
                    <input type="range" min="0" max="200" step="1" value={item.effects.confetti.count} onChange={(e) => { const val = Number(e.target.value); setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, confetti: { ...item.effects.confetti, count: val } } } })); }} />
                  </div>

                  <div>
                    <label>Confetti colors (comma separated)</label>
                    <input type="text" value={item.effects.confetti.colors.join(",")} onChange={(e) => { const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean); setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, confetti: { ...item.effects.confetti, colors: arr } } } })); }} />
                  </div>

                  <div>
                    <label>
                      <input type="checkbox" checked={item.effects.fireworks.enabled} onChange={(e) => { setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, fireworks: { ...item.effects.fireworks, enabled: e.target.checked } } } })); }} />
                      &nbsp;Fireworks
                    </label>
                  </div>

                  <div>
                    <label>
                      <input type="checkbox" checked={item.effects.lanterns.enabled} onChange={(e) => { setConfig((prev:any) => ({ ...prev, holidays: { ...prev.holidays, [key]: { ...item, effects: { ...item.effects, lanterns: { ...item.effects.lanterns, enabled: e.target.checked } } } })); }} />
                      &nbsp;Lanterns
                    </label>
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="wn-popover__close" onClick={onClose}>Huỷ</button>
            <button className="wn-popover__primary" onClick={save}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}
