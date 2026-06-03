export function getIconTintForWeather(conditionId) {
  if (conditionId === 800 || (conditionId >= 600 && conditionId < 700)) {
    return "text-accent-sun";
  }

  if ((conditionId >= 200 && conditionId < 600) || conditionId >= 700) {
    return "text-accent-sky";
  }

  return "text-muted";
}
