import { Cloud, CloudLightning, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react";

function getInsights(weather, unit) {
  if (!weather) return [];

  const insights = [];
  const wind = weather.wind?.speed ?? 0;
  const humidity = weather.main?.humidity ?? 0;
  const conditionMain = weather.weather?.[0]?.main ?? "";
  const conditionId = weather.weather?.[0]?.id ?? 800;

  const tempCelsius = unit === "imperial"
    ? ((weather.main?.temp ?? 20) - 32) * (5 / 9)
    : (weather.main?.temp ?? 20);

  const isCloudless = conditionId === 800;
  if (isCloudless) {
    insights.push({
      icon: "sun",
      iconColor: "text-accent-sun",
      text: "Clear skies today — high UV likely. Apply sunscreen and wear sunglasses outdoors.",
    });
  }

  if (conditionMain === "Rain" || conditionMain === "Drizzle") {
    insights.push({
      icon: "rain",
      iconColor: "text-accent-sky",
      text: "Rain expected — grab an umbrella before heading out.",
    });
  }

  if (wind > 20) {
    insights.push({
      icon: "wind",
      iconColor: "text-accent-sun",
      text: `High winds at ${Math.round(wind)} m/s — secure loose outdoor items and avoid umbrellas.`,
    });
  } else if (wind > 10) {
    insights.push({
      icon: "wind",
      iconColor: "text-muted",
      text: "Moderate winds today — good kite-flying weather, but hold onto loose objects.",
    });
  }

  if (tempCelsius > 35) {
    insights.push({
      icon: "thermometer",
      iconColor: "text-accent-sun",
      text: `Extreme heat at ${Math.round(tempCelsius)}°C — stay hydrated and avoid strenuous outdoor activity between 10am–4pm.`,
    });
  } else if (tempCelsius > 28) {
    insights.push({
      icon: "thermometer",
      iconColor: "text-accent-sun",
      text: "Hot day ahead — carry water and take breaks in shaded areas.",
    });
  }

  if (tempCelsius < 5) {
    insights.push({
      icon: "thermometer",
      iconColor: "text-accent-sky",
      text: "Cold temperatures — dress in layers and protect extremities (hands, ears).",
    });
  }

  if (humidity > 80) {
    insights.push({
      icon: "droplets",
      iconColor: "text-accent-sky",
      text: `High humidity at ${humidity}% — it'll feel hotter than it is. Light breathable clothing recommended.`,
    });
  }

  if (conditionMain === "Thunderstorm") {
    insights.push({
      icon: "lightning",
      iconColor: "text-accent-sun",
      text: "Thunderstorms active — avoid open fields, tall trees, and bodies of water.",
    });
  }

  if (conditionMain === "Fog" || conditionMain === "Mist" || conditionMain === "Haze") {
    insights.push({
      icon: "cloud",
      iconColor: "text-muted",
      text: "Low visibility due to fog or haze — drive slowly and use fog lights if commuting.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: "cloud",
      iconColor: "text-muted",
      text: "Conditions look comfortable. A great day to spend time outdoors!",
    });
  }

  return insights.slice(0, 3);
}

function InsightIcon({ icon, iconColor }) {
  const props = {
    className: `mt-0.5 shrink-0 ${iconColor}`,
    size: 18,
    strokeWidth: 1.75,
    "aria-hidden": true,
  };

  if (icon === "sun") return <Sun {...props} />;
  if (icon === "rain") return <CloudRain {...props} />;
  if (icon === "wind") return <Wind {...props} />;
  if (icon === "thermometer") return <Thermometer {...props} />;
  if (icon === "droplets") return <Droplets {...props} />;
  if (icon === "lightning") return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

export function LifestyleInsights({ weather, unit }) {
  const insights = getInsights(weather, unit);

  if (!weather) return null;

  return (
    <section className="rounded-field border border-accent-sky bg-elevated p-5">
      <div className="mb-4 flex items-center gap-2">
        <Cloud className="text-accent-sky" size={20} strokeWidth={1.75} />
        <div>
          <p className="field-label">Alert / Insight</p>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Lifestyle Notes
          </h2>
        </div>
      </div>

      <ul className="space-y-3">
        {insights.map(({ icon, iconColor, text }, i) => (
          <li key={i} className="flex items-start gap-3">
            <InsightIcon icon={icon} iconColor={iconColor} />
            <span className="text-sm leading-snug text-foreground">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
