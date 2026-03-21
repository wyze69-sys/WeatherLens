import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";


// Derive alerts from weather condition IDs when One Call API isn't available
function deriveAlertFromCondition(weather) {
  if (!weather) return null;

  const condition = weather.weather?.[0];
  const wind = weather.wind?.speed ?? 0;
  const temp = weather.main?.temp ?? 20;
  const id = condition?.id ?? 800;

  // Thunderstorm group
  if (id >= 200 && id < 300) {
    return {
      event: "Thunderstorm Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Thunderstorm conditions detected. Stay indoors and away from windows.",
    };
  }
  // Extreme rain
  if (id >= 500 && id < 502) {
    return null; // Light/moderate rain — not severe
  }
  if (id >= 502 && id < 532) {
    return {
      event: "Heavy Rain Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Heavy rainfall detected. Flooding risk in low-lying areas.",
    };
  }
  // Snow/sleet
  if (id >= 600 && id < 623) {
    return {
      event: "Winter Weather Advisory",
      sender_name: "WeatherLens Auto-Alert",
      description: "Snow or sleet conditions detected. Roads may be hazardous.",
    };
  }
  // Tornado / extreme
  if (id === 781) {
    return {
      event: "Tornado Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Tornado detected in the area. Seek shelter immediately.",
    };
  }
  // Squall / hurricane
  if (id === 771 || id === 762) {
    return {
      event: "Severe Wind Warning",
      sender_name: "WeatherLens Auto-Alert",
      description: "Squalls or ash conditions detected. Avoid unnecessary travel.",
    };
  }
  // High wind speed
  if (wind > 20) {
    return {
      event: "High Wind Alert",
      sender_name: "WeatherLens Auto-Alert",
      description: `Wind speeds of ${Math.round(wind)} m/s detected. Secure loose outdoor items.`,
    };
  }
  // Extreme heat
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

  // Init dismissed state from sessionStorage so we don't call setState inside an effect
  const [dismissed, setDismissed] = useState(() => {
    if (!alert) return false;
    return !!sessionStorage.getItem(`weatherlens_dismissed_${alert.event}`);
  });

  // When the alert changes (location change), re-check sessionStorage
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
      className="relative rounded-2xl overflow-hidden animate-pulse-slow"
      style={{
        background: "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #d97706 100%)",
        boxShadow: "0 4px 24px rgba(220, 38, 38, 0.4)",
      }}
    >
      {/* Pulsing glow ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-start gap-4 px-5 py-4">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm tracking-wide uppercase">
            {alert.event}
          </p>
          <p className="text-white/90 text-sm mt-0.5 leading-snug">
            {alert.description}
          </p>
          <p className="text-white/60 text-xs mt-1 italic">
            Source: {alert.sender_name}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
