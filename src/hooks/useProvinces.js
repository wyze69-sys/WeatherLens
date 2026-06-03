import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CAMBODIA_PROVINCES } from "../lib/provinces";

const MAX_PINNED = 3;

function sameProvinceCoords(a, b) {
  return Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;
}

function latestCachedData(queryClient, prefix, province, unit) {
  const matches = queryClient
    .getQueryCache()
    .findAll({ queryKey: [prefix] })
    .filter((query) => {
      const [, lat, lon, queryUnit] = query.queryKey;
      return queryUnit === unit && sameProvinceCoords({ lat, lon }, province);
    })
    .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt);

  return matches[0]?.state.data;
}

function provinceSnapshot(queryClient, province, unit) {
  const weather = latestCachedData(queryClient, "weather", province, unit);
  const forecast = latestCachedData(queryClient, "forecast", province, unit);
  const air = queryClient
    .getQueryCache()
    .findAll({ queryKey: ["airPollution"] })
    .filter((query) => {
      const [, lat, lon] = query.queryKey;
      return sameProvinceCoords({ lat, lon }, province);
    })
    .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt)[0]?.state.data;

  return {
    ...province,
    temp: weather?.main?.temp,
    wind: weather?.wind?.speed,
    rain: forecast?.list?.[0]?.pop,
    aqi: air?.list?.[0]?.main?.aqi,
  };
}

export function useProvinces(unit = "metric") {
  const queryClient = useQueryClient();
  const [pinnedProvinces, setPinnedProvinces] = useState([]);

  const togglePinnedProvince = (province) => {
    setPinnedProvinces((current) => {
      const isPinned = current.some((p) => p.name === province.name);
      if (isPinned) return current.filter((p) => p.name !== province.name);
      return [...current, province].slice(-MAX_PINNED);
    });
  };

  const pinnedProvinceData = useMemo(
    () => pinnedProvinces.map((province) => provinceSnapshot(queryClient, province, unit)),
    [pinnedProvinces, queryClient, unit]
  );

  return {
    provinces: CAMBODIA_PROVINCES,
    pinnedProvinces,
    pinnedProvinceData,
    togglePinnedProvince,
  };
}
