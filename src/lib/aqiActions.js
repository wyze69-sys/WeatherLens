export function getAqiAction(aqi, pm25 = 0) {
  const roundedPm25 = Math.round(pm25 || 0);
  const prefix = `PM2.5 ${roundedPm25}`;

  if (pm25 >= 75 || aqi >= 5) return `${prefix} — stay indoors, run filtration, N95 if outside`;
  if (pm25 >= 55 || aqi >= 4) return `${prefix} — close windows 2-5pm, N95 if biking`;
  if (pm25 >= 35 || aqi >= 3) return `${prefix} — reduce outdoor exertion, mask on motos`;
  if (pm25 >= 15 || aqi >= 2) return `${prefix} — sensitive groups take breaks outdoors`;
  return `${prefix} — good ventilation, normal outdoor activity`;
}
