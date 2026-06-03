import { Thermometer } from "lucide-react";
import { computeApproximateWbgt } from "../lib/heat";

export function HeatTile({ data, unit, isLoading }) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const wbgt = data ? computeApproximateWbgt(data.main.temp, data.main.humidity, data.wind?.speed ?? 0, unit) : null;

  return (
    <div className="flex min-h-24 flex-col justify-between rounded-field border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-muted">
        <Thermometer size={16} strokeWidth={1.75} />
        <span className="field-label">Heat Stress</span>
      </div>
      <p className="field-value text-center text-2xl font-semibold text-foreground">
        {isLoading || wbgt === null ? "--" : `${Math.round(wbgt)}° WBGT`}
      </p>
      <p className="text-center text-[11px] text-muted">Feels {data ? `${Math.round(data.main.feels_like)}${tempUnit}` : "--"}</p>
    </div>
  );
}
