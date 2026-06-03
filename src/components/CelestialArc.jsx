import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function CelestialArc({ sunrise, sunset, timezoneOffset }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!sunrise || !sunset) return null;

  const totalDaylight = sunset - sunrise;
  const timePassed = Math.max(0, Math.min(now - sunrise, totalDaylight));
  const percentage = timePassed / totalDaylight;
  const isNight = now < sunrise || now > sunset;

  const durationHours = Math.floor(totalDaylight / 3600);
  const durationMins = Math.floor((totalDaylight % 3600) / 60);
  const remainingSeconds = Math.max(0, sunset - now);

  const getLocalTime = (ts) => {
    const d = new Date((ts + timezoneOffset) * 1000);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  const angle = Math.PI - (percentage * Math.PI);
  const cx = 100 + 80 * Math.cos(angle);
  const cy = 90 - 80 * Math.sin(angle);

  return (
    <section className="field-panel flex h-full min-h-[300px] flex-col p-5">
      <div className="mb-8 flex items-center gap-2">
        {isNight ? (
          <Moon className="text-accent-sky" size={20} strokeWidth={1.75} />
        ) : (
          <Sun className="text-accent-sun" size={20} strokeWidth={1.75} />
        )}
        <div>
          <p className="field-label">Daylight Tracker</p>
          <h3 className="text-base font-semibold tracking-tight">Solar arc</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="mx-auto mb-7 w-full max-w-[240px]">
          <svg viewBox="0 0 200 100" className="h-full w-full overflow-visible">
            <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="#252B36" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="251.2" strokeDashoffset={251.2 - (percentage * 251.2)} />
            <circle cx={cx} cy={cy} r="5" fill={isNight ? "#7DD3FC" : "#FACC15"} />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-field border border-border bg-elevated p-3">
            <p className="field-label">Sunrise</p>
            <p className="field-value mt-2 text-lg font-semibold">{getLocalTime(sunrise)}</p>
          </div>
          <div className="rounded-field border border-border bg-elevated p-3">
            <p className="field-label">Sunset</p>
            <p className="field-value mt-2 text-lg font-semibold">{getLocalTime(sunset)}</p>
          </div>
        </div>

        <div className="mt-3 rounded-field border border-border bg-surface p-3">
          <p className="field-label">Total daylight</p>
          <p className="mt-2 text-sm text-muted">
            <span className="field-value text-base font-semibold text-foreground">{durationHours}h {durationMins}m</span>
            {!isNight && <span> • {Math.floor(remainingSeconds / 3600)}h {Math.floor((remainingSeconds % 3600) / 60)}m remaining</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
