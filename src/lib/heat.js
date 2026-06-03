export function computeHeatIndex(temp, humidity, unit = "metric") {
  if (!Number.isFinite(temp) || !Number.isFinite(humidity)) return null;

  const tempF = unit === "imperial" ? temp : (temp * 9) / 5 + 32;
  if (tempF < 80 || humidity < 40) {
    return unit === "imperial" ? temp : ((tempF - 32) * 5) / 9;
  }

  const hiF =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;

  return unit === "imperial" ? hiF : ((hiF - 32) * 5) / 9;
}

export function computeApproximateWbgt(temp, humidity, windSpeed = 0, unit = "metric") {
  if (!Number.isFinite(temp) || !Number.isFinite(humidity)) return null;

  const tempC = unit === "imperial" ? ((temp - 32) * 5) / 9 : temp;
  const windMs = unit === "imperial" ? windSpeed * 0.44704 : windSpeed;
  const vaporPressure = (humidity / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  const wbgt = 0.567 * tempC + 0.393 * vaporPressure + 3.94 - Math.min(Math.max(windMs, 0), 8) * 0.25;

  return unit === "imperial" ? (wbgt * 9) / 5 + 32 : wbgt;
}

export function extractUvIndex(oneCallData) {
  const value = oneCallData?.current?.uvi ?? oneCallData?.daily?.[0]?.uvi ?? oneCallData?.uvi;
  return Number.isFinite(value) ? value : null;
}

export function estimateUvBurnTime(uvi) {
  if (!Number.isFinite(uvi) || uvi <= 0) return "--";
  if (uvi >= 11) return "10 min";
  if (uvi >= 8) return "15 min";
  if (uvi >= 6) return "25 min";
  if (uvi >= 3) return "40 min";
  return "60+ min";
}
