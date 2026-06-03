import { useAirPollution } from "../hooks/useWeather";
import { Activity, Gauge, Loader2 } from "lucide-react";
import clsx from "clsx";

const AQI_LEVELS = {
  1: { label: "Good", color: "bg-accent-sky", text: "text-accent-sky", desc: "Air quality is ideal for all." },
  2: { label: "Moderate", color: "bg-accent-sun", text: "text-accent-sun", desc: "Acceptable air quality." },
  3: { label: "Unhealthy", color: "bg-danger", text: "text-red-300", desc: "Sensitive groups should limit time outside." },
  4: { label: "Unhealthy", color: "bg-danger", text: "text-red-300", desc: "Unhealthy for everyone." },
  5: { label: "Very Unhealthy", color: "bg-danger", text: "text-red-300", desc: "Health alert: everyone may experience effects." },
};

const SEGMENTS = [
  { label: "Good", color: "bg-accent-sky" },
  { label: "Moderate", color: "bg-accent-sun" },
  { label: "Unhealthy", color: "bg-danger" },
  { label: "Very Unhealthy", color: "bg-danger" },
];

export function AirQualityDial({ lat, lon }) {
  const { data, isLoading, isError } = useAirPollution(lat, lon);

  if (isLoading) return (
    <div className="field-panel flex min-h-[300px] flex-col items-center justify-center gap-4 p-5">
      <Loader2 className="animate-spin text-muted" size={20} strokeWidth={1.75} />
      <p className="field-label">Analysing Air</p>
    </div>
  );

  if (isError || !data?.list?.[0]) return (
    <div className="field-panel flex min-h-[300px] flex-col items-center justify-center p-5 text-muted">
      <Activity className="mb-4" size={20} strokeWidth={1.75} />
      <p className="text-sm font-semibold">Station Offline</p>
    </div>
  );

  const { main, components } = data.list[0];
  const aqi = main.aqi;
  const level = AQI_LEVELS[aqi] || AQI_LEVELS[1];
  const activeSegment = Math.min(SEGMENTS.length - 1, Math.max(0, aqi - 1));
  const StatusIcon = aqi <= 2 ? Gauge : Activity;

  return (
    <section className="field-panel flex h-full min-h-[300px] flex-col p-5">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="text-muted" size={20} strokeWidth={1.75} />
          <div>
            <p className="field-label">Air Quality Gauge</p>
            <h3 className="text-base font-semibold tracking-tight">Live pollutants</h3>
          </div>
        </div>
        <span className={clsx("rounded-md border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", level.text)}>
          {level.label}
        </span>
      </div>

      <div className="mb-6">
        <p className="field-label">AQI</p>
        <p className="field-value mt-1 text-5xl font-semibold leading-none text-accent-sky">{aqi}</p>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-1" aria-label={`Air quality is ${level.label}`}>
        {SEGMENTS.map((segment, index) => (
          <div key={segment.label} className="space-y-2">
            <div className={clsx("h-3 rounded-sm border border-border", index <= activeSegment ? segment.color : "bg-elevated")} />
            <p className="truncate text-[9px] font-medium text-muted">{segment.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-field border border-border bg-elevated p-3">
        <StatusIcon className={aqi <= 2 ? "shrink-0 text-muted" : "shrink-0 text-accent-sun"} size={18} strokeWidth={1.75} />
        <p className="text-sm leading-snug text-foreground">{level.desc}</p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted">
        {[
          { val: components.pm2_5, lab: "PM2.5" },
          { val: components.pm10, lab: "PM10" },
          { val: components.no2, lab: "NO2" },
          { val: components.o3 || components.oz, lab: "O3" },
        ].map((p) => (
          <p key={p.lab}>
            <span className="font-semibold text-muted">{p.lab}</span>{" "}
            <span className="font-mono text-foreground">{Math.round(p.val ?? 0)}</span> µg/m³
          </p>
        ))}
      </div>
    </section>
  );
}
