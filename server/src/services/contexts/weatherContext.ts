import { memoryCache } from "../../cache/cacheClient";

export type WeatherCondition = "sunny" | "cloudy" | "rainy";

export type WeatherSnapshot = {
  condition: WeatherCondition;
  temp: number; // for UI: a single representative temperature
  source: "rules_v1";
};

const TTL_WEATHER_MS = 3 * 60 * 60 * 1000;

function monthIndex(travelDate: string) {
  // travelDate: YYYY-MM-DD
  const m = Number(travelDate.slice(5, 7));
  if (!Number.isFinite(m) || m < 1 || m > 12) return 1;
  return m;
}

const cityOverrides: Record<
  string,
  { condition: WeatherCondition; temp: number }
> = {
  大理: { condition: "sunny", temp: 22 },
  丽江: { condition: "cloudy", temp: 18 },
  西双版纳: { condition: "sunny", temp: 28 },
  三亚: { condition: "sunny", temp: 30 },
  厦门: { condition: "cloudy", temp: 24 },
  西安: { condition: "cloudy", temp: 20 },
  洛阳: { condition: "cloudy", temp: 19 },
  泉州: { condition: "sunny", temp: 25 },
};

function seasonalFallback(month: number): { condition: WeatherCondition; temp: number } {
  // Simple rule-of-thumb.
  if (month >= 4 && month <= 10) return { condition: "sunny", temp: 24 };
  if (month >= 11 && month <= 2) return { condition: "cloudy", temp: 14 };
  return { condition: "cloudy", temp: 18 };
}

export function getWeatherSnapshot(input: {
  city: string;
  travelDate: string;
}): WeatherSnapshot {
  const cacheKey = `weather:${input.city}:${input.travelDate}`;
  const cached = memoryCache.get<WeatherSnapshot>(cacheKey);
  if (cached) return cached;

  const override = cityOverrides[input.city];
  if (override) {
    const res = { ...override, source: "rules_v1" as const };
    memoryCache.set(cacheKey, res, TTL_WEATHER_MS);
    return res;
  }

  const month = monthIndex(input.travelDate);
  const fallback = seasonalFallback(month);
  const res: WeatherSnapshot = { ...fallback, source: "rules_v1" };
  memoryCache.set(cacheKey, res, TTL_WEATHER_MS);
  return res;
}

