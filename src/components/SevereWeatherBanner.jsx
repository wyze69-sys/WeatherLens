import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

function deriveAlertFromCondition(weather) {
  if (!weather) return null;

  const condition = weather.weather?.[0];
  const wind = weather.wind?.speed ?? 0;
  const temp = weather.main?.temp ?? 20;
  const id = condition?.id ?? 800;

  if (id >= 200 && id < 300) {
    return {
      event: "Thunderstorm Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Thunderstorm conditions detected. Stay indoors and away from windows.",
    };
  }
  if (id >= 500 && id < 502) {
    return null;
  }
  if (id >= 502 && id < 532) {
    return {
      event: "Heavy Rain Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Heavy rainfall detected. Flooding risk in low-lying areas.",
    };
  }
  if (id >= 600 && id < 623) {
    return {
      event: "Winter Weather Advisory",
      sender_name: "WeatherLens Auto-Alert",
      description: "Snow or sleet conditions detected. Roads may be hazardous.",
    };
  }
  if (id === 781) {
    return {
      event: "Tornado Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Tornado detected in the area. Seek shelter immediately.",
    };
  }
  if (id === 771 || id === 762) {
    return {
      event: "Severe Wind Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Squalls or ash conditions detected. Avoid unnecessary travel.",
    };
  }
  if (wind > 20) {
    return {
      event: "High Wind Alert",
      sender_name: "WeatherLens Auto-Alert",
      description: `Wind speeds of ${Math.round(wind)} m/s detected. Secure loose outdoor items.`,
    };
  }
  if (temp > 38) {
    return {
      event: "Extreme Heat Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: `Temperature of ${Math.round(temp)}°C is dangerously high. Avoid outdoor activity between 10am–4pm.`,
    };
  }

  return null;
}

export function SevereWeatherBanner({ weather }) {
  const alert = deriveAlertFromCondition(weather);

  const [dismissed, setDismissed] = useState(() => {
    if (!alert) return false;
    return !!sessionStorage.getItem(`weatherlens_dismissed_${alert.event}`);
  });

  const alertKey = alert ? `weatherlens_dismissed_${alert.event}` : null;
  const isDismissedInSession = alertKey ? !!sessionStorage.getItem(alertKey) : false;

  if (!alert || dismissed || isDismissedInSession) return null;

  const handleDismiss = () => {
    const key = `weatherlens_dismissed_${alert.event}`;
    sessionStorage.setItem(key, "true");
    setDismissed(true);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-field border border-danger bg-elevated"
    >
      <div className="flex items-start gap-4 px-5 py-4">
        <AlertTriangle className="mt-0.5 shrink-0 text-accent-sun" size={20} strokeWidth={1.75} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-sun">
            {alert.event}
          </p>
          <p className="mt-1 text-sm leading-snug text-foreground">
            {alert.description}
          </p>
          <p className="mt-1 text-xs text-muted">
            Source: {alert.sender_name}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="flex-shrink-0 rounded-md p-1.5 text-muted transition-colors duration-150 hover:text-foreground"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
