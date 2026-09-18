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

// Bộ cài đặt chung: áp dụng một bộ hiệu ứng duy nhất cho mọi ngày lễ.
// Khi bật, thông số hiệu ứng riêng theo từng ngày (holidays) không còn
// được dùng nữa — mỗi ngày chỉ còn dùng để bật/tắt riêng.
export type HolidayGlobalConfig = {
  enabled: boolean;
  effects: HolidayEffectSettings;
};

export type HolidayEffectsConfig = {
  /** Tùy chọn để tương thích với cấu hình cũ đã lưu trong localStorage */
  global?: HolidayGlobalConfig;
  holidays: Record<string, HolidayEffectEntry>;
};
