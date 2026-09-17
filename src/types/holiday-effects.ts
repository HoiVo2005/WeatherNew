// Kiểu dữ liệu cho cấu hình hiệu ứng theo ngày lễ (lưu trong localStorage
// với khóa "holiday-effects-config").

export type HolidayEffectSettings = {
  snow: { density: number; wind: number; layers: number };
  confetti: { count: number; colors: string[] };
  fireworks: { enabled: boolean };
  lanterns: { enabled: boolean };
};

export type HolidayEffectEntry = {
  enabled: boolean;
  effects: HolidayEffectSettings;
};

export type HolidayEffectsConfig = {
  holidays: Record<string, HolidayEffectEntry>;
};
