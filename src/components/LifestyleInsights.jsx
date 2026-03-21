import { Sparkles } from "lucide-react";

function getInsights(weather, unit) {
  if (!weather) return [];

  const insights = [];
  const wind = weather.wind?.speed ?? 0;
  const humidity = weather.main?.humidity ?? 0;
  const conditionMain = weather.weather?.[0]?.main ?? "";
  const conditionId = weather.weather?.[0]?.id ?? 800;

  // Temperature in Celsius always (API returns metric internally)
  const tempCelsius = unit === "imperial"
    ? ((weather.main?.temp ?? 20) - 32) * (5 / 9)
    : (weather.main?.temp ?? 20);

  // UV — not available in basic API; derive from cloud cover + time range
  // Condition ID 800 = clear sky, daytime = high UV risk trigger
  const isCloudless = conditionId === 800;
  if (isCloudless) {
    insights.push({
      icon: "☀️",
      text: "Clear skies today — high UV likely. Apply sunscreen and wear sunglasses outdoors.",
    });
  }

  // Rain
  if (conditionMain === "Rain" || conditionMain === "Drizzle") {
    insights.push({
      icon: "☂️",
      text: "Rain expected — grab an umbrella before heading out.",
    });
  }

  // High wind
  if (wind > 20) {
    insights.push({
      icon: "🌬️",
      text: `High winds at ${Math.round(wind)} m/s — secure loose outdoor items and avoid umbrellas.`,
    });
  } else if (wind > 10) {
    insights.push({
      icon: "💨",
      text: "Moderate winds today — good kite-flying weather, but hold onto loose objects.",
    });
  }

  // Extreme heat
  if (tempCelsius > 35) {
    insights.push({
      icon: "🔥",
      text: `Extreme heat at ${Math.round(tempCelsius)}°C — stay hydrated and avoid strenuous outdoor activity between 10am–4pm.`,
    });
  } else if (tempCelsius > 28) {
    insights.push({
      icon: "🌡️",
      text: "Hot day ahead — carry water and take breaks in shaded areas.",
    });
  }

  // Cold
  if (tempCelsius < 5) {
    insights.push({
      icon: "🧥",
      text: "Cold temperatures — dress in layers and protect extremities (hands, ears).",
    });
  }

  // Humidity
  if (humidity > 80) {
    insights.push({
      icon: "💧",
      text: `High humidity at ${humidity}% — it'll feel hotter than it is. Light breathable clothing recommended.`,
    });
  }

  // Thunderstorm
  if (conditionMain === "Thunderstorm") {
    insights.push({
      icon: "⚡",
      text: "Thunderstorms active — avoid open fields, tall trees, and bodies of water.",
    });
  }

  // Fog / mist
  if (conditionMain === "Fog" || conditionMain === "Mist" || conditionMain === "Haze") {
    insights.push({
      icon: "🌫️",
      text: "Low visibility due to fog or haze — drive slowly and use fog lights if commuting.",
    });
  }

  // Default if nothing triggered
  if (insights.length === 0) {
    insights.push({
      icon: "✅",
      text: "Conditions look comfortable. A great day to spend time outdoors!",
    });
  }

  // Cap at 3 insights
  return insights.slice(0, 3);
}

export function LifestyleInsights({ weather, unit }) {
  const insights = getInsights(weather, unit);

  if (!weather) return null;

  return (
    <div
      className="rounded-2xl p-5 border border-white/20 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-sm uppercase tracking-widest opacity-80">
          Lifestyle Insights
        </h2>
      </div>

      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0 leading-none mt-0.5" aria-hidden>
              {insight.icon}
            </span>
            <span className="text-sm leading-snug opacity-90">{insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
