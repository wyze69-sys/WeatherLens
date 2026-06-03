import { format } from "date-fns";
import { Cloud, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";
import { Skeleton } from "./Skeleton";

function getWeatherIconColor(conditionId) {
  if (conditionId === 800 || (conditionId >= 600 && conditionId < 700)) return "text-accent-sun";
  if (conditionId >= 200 && conditionId < 600) return "text-accent-sky";
  return "text-muted";
}

function WeatherConditionIcon({ conditionId, description }) {
  const props = {
    "aria-label": description,
    className: getWeatherIconColor(conditionId),
    size: 20,
    strokeWidth: 1.75,
  };

  if (conditionId >= 200 && conditionId < 300) return <CloudLightning {...props} />;
  if (conditionId >= 300 && conditionId < 600) return <CloudRain {...props} />;
  if (conditionId >= 600 && conditionId < 700) return <CloudSnow {...props} />;
  if (conditionId >= 700 && conditionId < 800) return <Wind {...props} />;
  if (conditionId === 800) return <Sun {...props} />;
  return <Cloud {...props} />;
}

export function CurrentWeatherCard({ data, isLoading, unit }) {
  if (isLoading) {
    return (
      <div className="field-panel flex min-h-[280px] flex-col justify-between p-5">
        <Skeleton className="h-5 w-44" />
        <div>
          <Skeleton className="mb-3 h-16 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const { name, main, weather, sys, dt } = data;
  const condition = weather[0];
  return (
    <section className="field-panel min-h-[280px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="field-label">Current Status</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {name}{sys.country ? `, ${sys.country}` : ""}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {format(new Date(dt * 1000), "EEE, MMM d • p")}
          </p>
        </div>
        <WeatherConditionIcon conditionId={condition.id} description={condition.description} />
      </div>

      <div className="mt-8">
        <div className="field-value text-[56px] font-semibold leading-none tracking-[-0.08em] text-accent-sky">
          {Math.round(main.temp)}
          <span className="ml-2 align-baseline text-2xl font-medium tracking-tight text-accent-sky">{tempUnit}</span>
        </div>
        <p className="mt-2 field-label capitalize">{condition.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs text-muted">
        <div>
          <p className="field-label">Feels</p>
          <p className="field-value mt-1 text-base text-foreground">{Math.round(main.feels_like)}{tempUnit}</p>
        </div>
        <div>
          <p className="field-label">Range</p>
          <p className="field-value mt-1 text-base text-foreground">{Math.round(main.temp_min)}–{Math.round(main.temp_max)}{tempUnit}</p>
        </div>
      </div>
    </section>
  );
}
