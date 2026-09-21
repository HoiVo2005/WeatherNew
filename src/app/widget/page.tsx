"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudFog, CloudLightning, CloudRain, CloudSun, Moon, Sun, X } from "lucide-react";

type WidgetData = {
  name: string;
  temperature: number;
  apparent: number;
  weatherCode: number;
  isDay: boolean;
  max: number;
  min: number;
  rainChance: number;
  updatedAt: number;
};

function WidgetIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const size = 46;
  if ([95, 96, 99].includes(code)) return <CloudLightning size={size} className="storm" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain size={size} className="rain" />;
  if ([45, 48].includes(code)) return <CloudFog size={size} className="fog" />;
  if ([1, 2, 3].includes(code))
    return isDay ? <CloudSun size={size} className="cloudy" /> : <Moon size={size} className="night" />;
  return isDay ? <Sun size={size} className="sunny" /> : <Moon size={size} className="night" />;
}

function describe(code: number) {
  if ([95, 96, 99].includes(code)) return "Có dông";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Có mưa";
  if ([51, 53, 55].includes(code)) return "Mưa phùn";
  if ([45, 48].includes(code)) return "Sương mù";
  if ([2, 3].includes(code)) return "Nhiều mây";
  if (code === 1) return "Ít mây";
  if (code === 0) return "Trời quang";
  return "Thay đổi";
}

export default function WidgetPage() {
  const [data, setData] = useState<WidgetData | null>(null);
  const [error, setError] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  const load = useCallback(async () => {
    try {
      let latitude = 10.8231;
      let longitude = 106.6297;
      let name = "TP. Hồ Chí Minh";

      try {
        const saved = window.localStorage.getItem("weather-location");
        if (saved) {
          const parsed = JSON.parse(saved) as {
            latitude: number;
            longitude: number;
            name?: string;
          };
          if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
            latitude = parsed.latitude;
            longitude = parsed.longitude;
            if (parsed.name) name = parsed.name;
          }
        }
      } catch {
        // keep defaults
      }

      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
        "&timezone=auto&forecast_days=1";

      const response = await fetch(url);
      if (!response.ok) throw new Error("fetch failed");
      const json = (await response.json()) as {
        current: {
          temperature_2m: number;
          apparent_temperature: number;
          weather_code: number;
          is_day: number;
        };
        daily: {
          temperature_2m_max: number[];
          temperature_2m_min: number[];
          precipitation_probability_max: number[];
        };
      };

      setData({
        name,
        temperature: json.current.temperature_2m,
        apparent: json.current.apparent_temperature,
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day === 1,
        max: json.daily.temperature_2m_max[0] ?? json.current.temperature_2m,
        min: json.daily.temperature_2m_min[0] ?? json.current.temperature_2m,
        rainChance: json.daily.precipitation_probability_max[0] ?? 0,
        updatedAt: Date.now(),
      });
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void load();
    }, 0);

    const interval = window.setInterval(() => void load(), 10 * 60 * 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [load]);

  useEffect(() => {
    const clockTimer = window.setInterval(() => setClock(new Date()), 30 * 1000);
    return () => window.clearInterval(clockTimer);
  }, []);

  return (
    <div className="wn-widget">
      <div className="wn-widget__bar">
        <span>WeatherNow</span>
        <button
          type="button"
          onClick={() => window.close()}
          aria-label="Đóng widget"
        >
          <X size={13} />
        </button>
      </div>

      {error && !data ? (
        <div className="wn-widget__error">Không tải được thời tiết</div>
      ) : !data ? (
        <div className="wn-widget__error">Đang tải…</div>
      ) : (
        <div className="wn-widget__body">
          <div className="wn-widget__place">{data.name}</div>
          <div className="wn-widget__time">
            {new Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(clock)}
            {" · "}
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "2-digit",
            }).format(clock)}
          </div>

          <div className="wn-widget__main">
            <WidgetIcon code={data.weatherCode} isDay={data.isDay} />
            <strong>{Math.round(data.temperature)}°</strong>
            <div className="wn-widget__cond">
              <span>{describe(data.weatherCode)}</span>
              <small>Cảm giác {Math.round(data.apparent)}°</small>
            </div>
          </div>

          <div className="wn-widget__footer">
            <span>↑{Math.round(data.max)}° ↓{Math.round(data.min)}°</span>
            <span>☔ {data.rainChance}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
