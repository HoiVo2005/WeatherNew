export type WeatherCondition = "sunny" | "cloudy" | "rain" | "storm";

export type DailyForecast = {
  day: string;
  date: string;
  condition: WeatherCondition;
  max: number;
  min: number;
  rainChance: number;
};

export type HourlyForecast = {
  time: string;
  temperature: number;
  rainChance: number;
  condition: WeatherCondition;
};

export const dailyForecast: DailyForecast[] = [
  { day: "CN", date: "25/05", condition: "sunny", max: 32, min: 24, rainChance: 10 },
  { day: "T2", date: "26/05", condition: "sunny", max: 31, min: 24, rainChance: 10 },
  { day: "T3", date: "27/05", condition: "rain", max: 29, min: 23, rainChance: 60 },
  { day: "T4", date: "28/05", condition: "storm", max: 28, min: 22, rainChance: 70 },
  { day: "T5", date: "29/05", condition: "cloudy", max: 30, min: 23, rainChance: 20 },
  { day: "T6", date: "30/05", condition: "sunny", max: 31, min: 24, rainChance: 10 },
  { day: "T7", date: "31/05", condition: "sunny", max: 32, min: 25, rainChance: 10 }
];

export const hourlyForecast: HourlyForecast[] = [
  { time: "08:00", temperature: 28, rainChance: 0, condition: "cloudy" },
  { time: "09:00", temperature: 29, rainChance: 0, condition: "cloudy" },
  { time: "10:00", temperature: 30, rainChance: 10, condition: "cloudy" },
  { time: "11:00", temperature: 31, rainChance: 10, condition: "cloudy" },
  { time: "12:00", temperature: 32, rainChance: 20, condition: "cloudy" },
  { time: "13:00", temperature: 32, rainChance: 20, condition: "cloudy" },
  { time: "14:00", temperature: 31, rainChance: 20, condition: "cloudy" },
  { time: "15:00", temperature: 30, rainChance: 20, condition: "cloudy" },
  { time: "16:00", temperature: 29, rainChance: 10, condition: "cloudy" },
  { time: "17:00", temperature: 28, rainChance: 10, condition: "cloudy" }
];
