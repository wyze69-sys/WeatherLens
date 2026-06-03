import { z } from "zod";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const WeatherSchema = z.object({
  coord: z.object({ lon: z.number().optional(), lat: z.number().optional() }).optional(),
  weather: z.array(
    z.object({
      id: z.number(),
      main: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ).default([]),
  main: z.object({
    temp: z.number(),
    feels_like: z.number().optional(),
    temp_min: z.number().optional(),
    temp_max: z.number().optional(),
    pressure: z.number().optional(),
    humidity: z.number().optional(),
  }),
  visibility: z.number().optional(),
  wind: z.object({
    speed: z.number().optional(),
    deg: z.number().optional(),
  }).optional(),
  dt: z.number(),
  sys: z.object({
    country: z.string().optional(),
    sunrise: z.number().optional(),
    sunset: z.number().optional(),
  }).optional(),
  timezone: z.number().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
});

export const ForecastSchema = z.object({
  list: z.array(
    z.object({
      dt: z.number(),
      main: z.object({
        temp: z.number(),
      }),
      pop: z.number().optional(),
      weather: z.array(
        z.object({
          id: z.number(),
          main: z.string(),
          icon: z.string(),
        })
      ).default([]),
      dt_txt: z.string().optional(),
    })
  ).default([]),
  city: z.object({
    name: z.string().optional(),
    country: z.string().optional(),
    timezone: z.number().optional(),
  }).optional(),
});

export const GeocodeSchema = z.array(
  z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    country: z.string().optional(),
    state: z.string().optional(),
  })
).default([]);

export const OneCallSchema = z.object({
  current: z.object({
    uvi: z.number().optional(),
  }).optional(),
  daily: z.array(z.object({ uvi: z.number().optional() })).optional(),
}).passthrough();

export const MinutelyPrecipSchema = z.object({
  lat: z.number().optional(),
  lon: z.number().optional(),
  timezone: z.string().optional(),
  timezone_offset: z.number().optional(),
  minutely: z.array(
    z.object({
      dt: z.number(),
      precipitation: z.number().nonnegative().default(0),
    })
  ).default([]),
});

export async function getCoordinatesByCity(query) {
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch geocoding data");
  const data = await res.json();
  return GeocodeSchema.parse(data);
}

export async function getCurrentWeather(lat, lon, units = "metric") {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  const data = await res.json();
  return WeatherSchema.parse(data);
}

export async function getForecast(lat, lon, units = "metric") {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  const data = await res.json();
  return ForecastSchema.parse(data);
}

export async function getOneCall(lat, lon, units = "metric") {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    units,
    exclude: "minutely,hourly,alerts",
    appid: API_KEY,
  });
  const url = `${ONE_CALL_URL}/onecall?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch One Call data");
  const data = await res.json();
  return OneCallSchema.parse(data);
}

export async function getMinutelyPrecip(lat, lon) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    exclude: "current,hourly,daily,alerts",
    appid: API_KEY,
  });
  const url = `${ONE_CALL_URL}/onecall?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch minutely precipitation");
  const data = await res.json();
  return MinutelyPrecipSchema.parse(data);
}

export const AirPollutionSchema = z.object({
  list: z.array(
    z.object({
      main: z.object({
        aqi: z.number(), // 1, 2, 3, 4, 5
      }),
      components: z.object({
        co: z.number().optional(),
        no2: z.number().optional(),
        oz: z.number().optional(),
        pm10: z.number().optional(),
        pm2_5: z.number().optional(),
        so2: z.number().optional(),
        nh3: z.number().optional(),
      }).optional()
    })
  ).default([]),
});

export async function getAirPollution(lat, lon) {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch air pollution data");
  const data = await res.json();
  return AirPollutionSchema.parse(data);
}
