export type WeatherResponse = {
  location: { name: string; latitude: number; longitude: number; timezone: string };
  current: {
    time: string; temperature: number; apparentTemperature: number; humidity: number;
    precipitation: number; weatherCode: number; windSpeed: number; windDirection: number;
    pressure: number; visibility: number;
  };
  daily: Array<{ date: string; weatherCode: number; max: number; min: number; rainChance: number; sunrise: string; sunset: string }>;
  hourly: Array<{ time: string; temperature: number; weatherCode: number; rainChance: number }>;
  air: { aqi: number | null; pm25: number | null; pm10: number | null; ozone: number | null; no2: number | null; so2: number | null; co: number | null };
};
