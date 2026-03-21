import { format } from "date-fns";
import { Skeleton } from "./Skeleton";

export function CurrentWeatherCard({ data, isLoading, unit }) {
  if (isLoading) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-8 min-h-[300px]">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-24 w-48 mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (!data) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const { name, main, weather, sys, dt } = data;
  const condition = weather[0];

  return (
    <div className="glass-card flex flex-col items-center text-center p-8 min-h-[300px]">
      <div className="mb-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          {name}{sys.country ? `, ${sys.country}` : ""}
        </h2>
        <p className="text-sm opacity-80 mt-1">
          {format(new Date(dt * 1000), "EEEE, MMMM d, yyyy | p")}
        </p>
      </div>

      <div className="flex flex-col items-center my-6">
        <img
          src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
          alt={condition.description}
          className="w-32 h-32 drop-shadow-lg"
        />
        <div className="text-6xl font-bold tracking-tighter">
          {Math.round(main.temp)}
          <span className="text-4xl font-normal opacity-80 ml-1">{tempUnit}</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-medium capitalize">{condition.description}</p>
        <p className="text-sm opacity-80">
          Feels like {Math.round(main.feels_like)}{tempUnit} • 
          High {Math.round(main.temp_max)}{tempUnit} • 
          Low {Math.round(main.temp_min)}{tempUnit}
        </p>
      </div>
    </div>
  );
}
