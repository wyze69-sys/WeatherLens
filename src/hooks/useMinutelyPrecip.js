import { useQuery } from "@tanstack/react-query";
import { getMinutelyPrecip } from "../api/weatherApi";

const FIVE_MINUTES = 1000 * 60 * 5;

function hasCoords(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon);
}

export function useMinutelyPrecip(lat, lon) {
  return useQuery({
    queryKey: ["minutelyPrecip", lat, lon],
    queryFn: () => {
      if (!hasCoords(lat, lon)) throw new Error("Missing coordinates");
      return getMinutelyPrecip(lat, lon);
    },
    enabled: hasCoords(lat, lon),
    staleTime: FIVE_MINUTES,
    gcTime: FIVE_MINUTES,
  });
}
