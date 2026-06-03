import clsx from "clsx";
import { Sun } from "lucide-react";
import { estimateUvBurnTime, extractUvIndex } from "../lib/heat";

const UV_SEGMENTS = Array.from({ length: 11 }, (_, index) => index + 1);

export function UVTile({ oneCall, isLoading }) {
  const uv = extractUvIndex(oneCall);
  const roundedUv = uv === null ? null : Math.round(uv);

  return (
    <div className="flex min-h-24 flex-col justify-between rounded-field border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-muted">
        <Sun size={16} strokeWidth={1.75} />
        <span className="field-label">UV Index</span>
      </div>
      <p className="field-value text-center text-2xl font-semibold text-accent-sun">{isLoading || roundedUv === null ? "--" : roundedUv}</p>
      <div className="grid grid-cols-11 gap-0.5" aria-label="UV index segmented bar">
        {UV_SEGMENTS.map((segment) => (
          <div key={segment} className={clsx("h-2 rounded-sm", roundedUv !== null && segment <= roundedUv ? "bg-accent-sun" : "bg-border")} />
        ))}
      </div>
      <p className="text-center text-[11px] text-muted">{estimateUvBurnTime(uv)} burn time</p>
    </div>
  );
}
