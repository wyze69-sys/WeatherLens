import { Droplets, Wind, Gauge, Eye } from "lucide-react";
import { Skeleton } from "./Skeleton";

export function MetricCard({ title, value, icon, isLoading }) {
  return (
    <div className="glass-card flex items-center gap-4 p-5">
      <div className="p-3 bg-white/10 rounded-xl">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium opacity-70 uppercase tracking-wider">{title}</span>
        {isLoading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <span className="text-xl font-bold">{value}</span>
        )}
      </div>
    </div>
  );
}

export function MetricsGrid({ data, isLoading, unit }) {
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <MetricCard
        isLoading={isLoading}
        title="Humidity"
        value={data ? `${data.main.humidity}%` : ""}
        icon={<Droplets className="w-6 h-6 text-blue-300" />}
      />
      <MetricCard
        isLoading={isLoading}
        title="Wind"
        value={data ? `${data.wind.speed} ${speedUnit}` : ""}
        icon={<Wind className="w-6 h-6 text-teal-300" />}
      />
      <MetricCard
        isLoading={isLoading}
        title="Pressure"
        value={data ? `${data.main.pressure} hPa` : ""}
        icon={<Gauge className="w-6 h-6 text-purple-300" />}
      />
      <MetricCard
        isLoading={isLoading}
        title="Visibility"
        value={data ? `${(data.visibility / 1000).toFixed(1)} km` : ""}
        icon={<Eye className="w-6 h-6 text-amber-300" />}
      />
    </div>
  );
}
