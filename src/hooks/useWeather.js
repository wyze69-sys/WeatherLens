import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getForecast, getCoordinatesByCity, getOneCall, getAirPollution } from "../api/weatherApi";

export function useWeather(lat, lon, units = "metric") {
  return useQuery({
    queryKey: ["weather", lat, lon, units],
    queryFn: () => {
      if (lat === null || lon === null) throw new Error("Missing coordinates");
      return getCurrentWeather(lat, lon, units);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 10,
  });
}

export function useForecast(lat, lon, units = "metric") {
  return useQuery({
    queryKey: ["forecast", lat, lon, units],
    queryFn: () => {
      if (lat === null || lon === null) throw new Error("Missing coordinates");
      return getForecast(lat, lon, units);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 10,
  });
}

export function useOneCall(lat, lon, units = "metric") {
  return useQuery({
    queryKey: ["oneCall", lat, lon, units],
    queryFn: () => {
      if (lat === null || lon === null) throw new Error("Missing coordinates");
      return getOneCall(lat, lon, units);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCitySearch(query) {
  return useQuery({
    queryKey: ["citySearch", query],
    queryFn: () => {
      if (!query.trim()) return [];
      return getCoordinatesByCity(query);
    },
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 60,
  });
}

export function useAirPollution(lat, lon) {
  return useQuery({
    queryKey: ["airPollution", lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) throw new Error("Missing coordinates");
      return getAirPollution(lat, lon);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 30, // Air pollution doesn't change as rapidly
  });
}
