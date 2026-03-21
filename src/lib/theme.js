export function getThemeForWeather(conditionId) {
  if (conditionId >= 200 && conditionId < 300) {
    return { bgGradient: "from-slate-800 to-indigo-900", textColor: "text-slate-100" };
  }
  if (conditionId >= 300 && conditionId < 400) {
    return { bgGradient: "from-blue-400 to-slate-400", textColor: "text-slate-800" };
  }
  if (conditionId >= 500 && conditionId < 600) {
    return { bgGradient: "from-slate-600 to-blue-800", textColor: "text-slate-100" };
  }
  if (conditionId >= 600 && conditionId < 700) {
    return { bgGradient: "from-blue-100 to-slate-200", textColor: "text-slate-800" };
  }
  if (conditionId >= 700 && conditionId < 800) {
    return { bgGradient: "from-slate-400 to-gray-500", textColor: "text-slate-800" };
  }
  if (conditionId === 800) {
    return { bgGradient: "from-sky-400 to-blue-500", textColor: "text-slate-50" };
  }
  if (conditionId > 800 && conditionId < 900) {
    if (conditionId === 801 || conditionId === 802) {
      return { bgGradient: "from-sky-200 to-slate-400", textColor: "text-slate-800" };
    }
    return { bgGradient: "from-slate-500 to-gray-700", textColor: "text-slate-100" };
  }
  return { bgGradient: "from-blue-500 to-cyan-500", textColor: "text-white" };
}
