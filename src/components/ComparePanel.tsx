"use client";

import { useCallback, useEffect, useState } from "react";
import { Droplets, Thermometer, Wind } from "lucide-react";
import {
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";

export type CompareFavorite = {
  latitude: number;
  longitude: number;
  name: string;
};

export type CompareCurrent = {
  name: string;
  temperature: number;
  feels: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
};

type ComparePanelProps = {
  favorites: CompareFavorite[];
  current: CompareCurrent;
  windUnit: "kmh" | "ms";
  language: "vi" | "en";
};

type RemoteWeather = {
  temperature: number;
  feels: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
};

function ConditionIcon({ code, size = 40 }: { code: number; size?: number }) {
  if ([95, 96, 99].includes(code)) return <CloudLightning size={size} className="storm" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain size={size} className="rain" />;
  if ([45, 48].includes(code)) return <CloudFog size={size} className="fog" />;
  if ([1, 2, 3].includes(code)) return <CloudSun size={size} className="cloudy" />;
  return <Sun size={size} className="sunny" />;
}

function describe(code: number, language: "vi" | "en") {
  const vi = language === "vi";
  if ([95, 96, 99].includes(code)) return vi ? "Có dông" : "Thunderstorm";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return vi ? "Có mưa" : "Rainy";
  if ([51, 53, 55].includes(code)) return vi ? "Mưa phùn" : "Drizzle";
  if ([45, 48].includes(code)) return vi ? "Sương mù" : "Foggy";
  if ([2, 3].includes(code)) return vi ? "Nhiều mây" : "Cloudy";
  if (code === 1) return vi ? "Ít mây" : "Mostly clear";
  return vi ? "Trời quang" : "Clear sky";
}

// __BODY__

export default function ComparePanel({
  favorites,
  current,
  windUnit,
  language,
}: ComparePanelProps) {
  const vi = language === "vi";
  const [selected, setSelected] = useState(0);
  const [remote, setRemote] = useState<RemoteWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const target = favorites[selected];

  const load = useCallback(async () => {
    if (!target) return;
    setLoading(true);
    setError(false);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${target.latitude}&longitude=${target.longitude}` +
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&daily=precipitation_probability_max&forecast_days=1&timezone=auto";
      const response = await fetch(url);
      if (!response.ok) throw new Error("fetch failed");
      const json = (await response.json()) as {
        current: {
          temperature_2m: number;
          apparent_temperature: number;
          relative_humidity_2m: number;
          weather_code: number;
          wind_speed_10m: number;
        };
        daily: { precipitation_probability_max: number[] };
      };
      setRemote({
        temperature: json.current.temperature_2m,
        feels: json.current.apparent_temperature,
        humidity: json.current.relative_humidity_2m,
        windSpeed: json.current.wind_speed_10m,
        weatherCode: json.current.weather_code,
      });
    } catch {
      setError(true);
      setRemote(null);
    } finally {
      setLoading(false);
    }
  }, [target]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  if (favorites.length === 0) {
    return (
      <p className="wn-compare-empty">
        {vi
          ? "Chưa có địa điểm để so sánh. Hãy bấm ❤️ trên thanh công cụ để lưu địa điểm yêu thích trước nhé!"
          : "No location to compare yet. Tap ❤️ on the toolbar to save a favorite location first!"}
      </p>
    );
  }

  const unit = windUnit === "kmh" ? "km/h" : "m/s";
  const delta = remote ? remote.temperature - current.temperature : 0;

  return (
    <div className="wn-compare">
      <div className="wn-compare__picker">
        <select
          className="wn-select"
          value={selected}
          onChange={(event) => setSelected(Number(event.target.value))}
          aria-label={vi ? "Chọn địa điểm so sánh" : "Pick location to compare"}
        >
          {favorites.map((item, index) => (
            <option key={`${item.latitude}-${item.longitude}`} value={index}>
              {item.name}
            </option>
          ))}
        </select>
        {loading ? <small>{vi ? "Đang tải…" : "Loading…"}</small> : null}
        {error ? (
          <small className="wn-compare__error">
            {vi ? "Không tải được dữ liệu" : "Failed to load"}
          </small>
        ) : null}
      </div>

      <div className="wn-compare__grid">
        <div className="wn-compare__card wn-compare__card--active">
          <span className="wn-compare__name">{current.name}</span>
          <div className="wn-compare__main">
            <ConditionIcon code={current.weatherCode} />
            <strong>{Math.round(current.temperature)}°</strong>
          </div>
          <span className="wn-compare__desc">
            {describe(current.weatherCode, language)}
          </span>
          <div className="wn-compare__meta">
            <span>
              <Thermometer size={13} /> {Math.round(current.feels)}°
            </span>
            <span>
              <Droplets size={13} /> {Math.round(current.humidity)}%
            </span>
            <span>
              <Wind size={13} /> {Math.round(current.windSpeed)} {unit}
            </span>
          </div>
        </div>

        <div className="wn-compare__delta">
          {remote ? (
            <>
              <strong>
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}°
              </strong>
              <small>
                {delta === 0
                  ? vi
                    ? "bằng nhau"
                    : "the same"
                  : delta > 0
                    ? vi
                      ? `${current.name} ấm hơn`
                      : `${current.name} is warmer`
                    : vi
                      ? `${current.name} mát hơn`
                      : `${current.name} is cooler`}
              </small>
            </>
          ) : (
            <strong>…</strong>
          )}
        </div>

        <div className="wn-compare__card">
          <span className="wn-compare__name">{target?.name ?? "—"}</span>
          <div className="wn-compare__main">
            {remote ? (
              <ConditionIcon code={remote.weatherCode} />
            ) : (
              <Moon size={40} className="night" />
            )}
            <strong>{remote ? `${Math.round(remote.temperature)}°` : "—"}</strong>
          </div>
          <span className="wn-compare__desc">
            {remote ? describe(remote.weatherCode, language) : "—"}
          </span>
          <div className="wn-compare__meta">
            <span>
              <Thermometer size={13} /> {remote ? `${Math.round(remote.feels)}°` : "—"}
            </span>
            <span>
              <Droplets size={13} /> {remote ? `${Math.round(remote.humidity)}%` : "—"}
            </span>
            <span>
              <Wind size={13} />{" "}
              {remote ? `${Math.round(remote.windSpeed)} ${unit}` : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
