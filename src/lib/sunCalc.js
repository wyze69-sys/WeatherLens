const CIVIL_TWILIGHT_OFFSET = 30 * 60;
const GOLDEN_HOUR_OFFSET = 30 * 60;

export function getCivilTwilight(sunrise, sunset) {
  if (!sunrise || !sunset) return null;
  return {
    start: sunrise - CIVIL_TWILIGHT_OFFSET,
    end: sunset + CIVIL_TWILIGHT_OFFSET,
  };
}

export function getGoldenHourWindows(sunrise, sunset) {
  if (!sunrise || !sunset) return null;
  return {
    morning: { start: sunrise, end: sunrise + GOLDEN_HOUR_OFFSET },
    evening: { start: sunset - GOLDEN_HOUR_OFFSET, end: sunset },
  };
}

export function formatSolarTime(ts, timezoneOffset = 0) {
  const d = new Date((ts + timezoneOffset) * 1000);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
