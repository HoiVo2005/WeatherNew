import { NextRequest, NextResponse } from "next/server";

export const revalidate = 900;

function numberAt(values: unknown, index = 0): number | null {
  return Array.isArray(values) && typeof values[index] === "number" ? values[index] : null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const latitude = Number(params.get("latitude"));
  const longitude = Number(params.get("longitude"));
  const name = params.get("name") || "Việt Nam";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Tọa độ không hợp lệ" }, { status: 400 });
  }

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("latitude", String(latitude));
  forecastUrl.searchParams.set("longitude", String(longitude));
  forecastUrl.searchParams.set("timezone", "Asia/Ho_Chi_Minh");
  forecastUrl.searchParams.set("forecast_days", "7");
  forecastUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility");
  forecastUrl.searchParams.set("hourly", "temperature_2m,precipitation_probability,weather_code");
  forecastUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset");

  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.searchParams.set("latitude", String(latitude));
  airUrl.searchParams.set("longitude", String(longitude));
  airUrl.searchParams.set("timezone", "Asia/Ho_Chi_Minh");
  airUrl.searchParams.set("forecast_days", "1");
  airUrl.searchParams.set("current", "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide");

  try {
    const [forecastRes, airRes] = await Promise.all([
      fetch(forecastUrl, { next: { revalidate: 900 } }),
      fetch(airUrl, { next: { revalidate: 900 } })
    ]);

    if (!forecastRes.ok) throw new Error("Không lấy được dữ liệu thời tiết");
    const forecast = await forecastRes.json();
    const air = airRes.ok ? await airRes.json() : null;

    const currentHour = forecast.current?.time;
    const startIndex = Math.max(0, forecast.hourly?.time?.findIndex((t: string) => t >= currentHour) ?? 0);
    const hourly = (forecast.hourly?.time || []).slice(startIndex, startIndex + 12).map((time: string, i: number) => ({
      time,
      temperature: forecast.hourly.temperature_2m[startIndex + i],
      weatherCode: forecast.hourly.weather_code[startIndex + i],
      rainChance: forecast.hourly.precipitation_probability[startIndex + i]
    }));

    return NextResponse.json({
      location: { name, latitude, longitude, timezone: forecast.timezone },
      current: {
        time: forecast.current.time,
        temperature: forecast.current.temperature_2m,
        apparentTemperature: forecast.current.apparent_temperature,
        humidity: forecast.current.relative_humidity_2m,
        precipitation: forecast.current.precipitation,
        weatherCode: forecast.current.weather_code,
        windSpeed: forecast.current.wind_speed_10m,
        windDirection: forecast.current.wind_direction_10m,
        pressure: forecast.current.surface_pressure,
        visibility: Math.round((forecast.current.visibility || 0) / 100) / 10
      },
      daily: forecast.daily.time.map((date: string, i: number) => ({
        date,
        weatherCode: forecast.daily.weather_code[i],
        max: forecast.daily.temperature_2m_max[i],
        min: forecast.daily.temperature_2m_min[i],
        rainChance: forecast.daily.precipitation_probability_max[i],
        sunrise: forecast.daily.sunrise[i],
        sunset: forecast.daily.sunset[i]
      })),
      hourly,
      air: {
        aqi: air?.current?.us_aqi ?? null,
        pm25: air?.current?.pm2_5 ?? null,
        pm10: air?.current?.pm10 ?? null,
        ozone: air?.current?.ozone ?? null,
        no2: air?.current?.nitrogen_dioxide ?? null,
        so2: air?.current?.sulphur_dioxide ?? null,
        co: air?.current?.carbon_monoxide ?? null
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Lỗi máy chủ" }, { status: 500 });
  }
}
