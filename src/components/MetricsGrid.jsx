import { Droplets, Wind } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { HeatTile } from "./HeatTile";
import { UVTile } from "./UVTile";

export function MetricCard({ title, value, icon, isLoading }) {
  return (
    <div className="field-panel flex min-h-24 flex-col justify-between p-4">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="field-label">{title}</span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-4 h-7 w-20" />
      ) : (
        <span className="field-value mt-4 text-2xl font-semibold">{value}</span>
      )}
    </div>
  );
}

const tileIconProps = {
  size: 16,
  strokeWidth: 1.75,
  className: "text-muted",
};

export function MetricsGrid({ data, isLoading, unit, oneCall, isLoadingOneCall }) {
  const speedUnit = unit === "metric" ? "m/s" : "mph";
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <HeatTile data={data} unit={unit} isLoading={isLoading} />
      <UVTile oneCall={oneCall} isLoading={isLoadingOneCall} />
      <MetricCard
        isLoading={isLoading}
        title="Humidity"
        value={data ? `${data.main.humidity}%` : ""}
        icon={<Droplets {...tileIconProps} />}
      />
      <MetricCard
        isLoading={isLoading}
        title="Wind"
        value={data ? `${data.wind.speed} ${speedUnit}` : ""}
        icon={<Wind {...tileIconProps} />}
      />
    </div>
  );
}
