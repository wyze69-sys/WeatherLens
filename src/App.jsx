import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import { SearchAutocomplete } from "./components/SearchAutocomplete";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { MetricsGrid } from "./components/MetricsGrid";
import { ForecastChart } from "./components/ForecastChart";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SevereWeatherBanner } from "./components/SevereWeatherBanner";
import { LifestyleInsights } from "./components/LifestyleInsights";
import { AirQualityDial } from "./components/AirQualityDial";
import { CelestialArc } from "./components/CelestialArc";
import { NowcastStrip } from "./components/NowcastStrip";
import { useWeather, useForecast } from "./hooks/useWeather";
import { useUnit } from "./hooks/useUnit";
import { getIconTintForWeather } from "./lib/theme";
import { CAMBODIA_PROVINCES } from "./lib/provinces";

const DEFAULT_PP = { lat: 11.5564, lon: 104.9282 };

export default function App() {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem("weatherlens_coords");
    return saved ? JSON.parse(saved) : DEFAULT_PP;
  });

  const { unit, setUnit } = useUnit();
  const { data: weather, isLoading: loadingWeather, error: weatherError } = useWeather(coords.lat, coords.lon, unit);
  const { data: forecast, isLoading: loadingForecast } = useForecast(coords.lat, coords.lon, unit);

  if (weatherError) throw weatherError;

  useEffect(() => {
    localStorage.setItem("weatherlens_coords", JSON.stringify(coords));
  }, [coords]);

  const iconTint = getIconTintForWeather(weather?.weather[0]?.id || 800);

  return (
    <div className="min-h-screen w-full bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="relative z-50 flex flex-col items-stretch justify-between gap-5 border-b border-border pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Cloud className={iconTint} size={20} strokeWidth={1.75} />
            <div>
              <p className="field-label">Field Station</p>
              <h1 className="text-3xl font-semibold tracking-tight">WeatherLens</h1>
            </div>
          </div>

          <div className="w-full md:max-w-md">
            <SearchAutocomplete onLocationSelect={(lat, lon) => setCoords({ lat, lon })} />
          </div>

          <div className="flex w-full rounded-field border border-border bg-surface p-1 md:w-auto">
            {[
              ["metric", "°C"],
              ["imperial", "°F"],
            ].map(([u, label]) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`flex-1 rounded-md px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-150 md:flex-none ${
                  unit === u ? "bg-accent-sky text-black" : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <section className="relative">
          <div className="mb-3 flex items-center justify-between gap-4 px-1">
            <h2 className="field-label">Cambodia Provinces</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {CAMBODIA_PROVINCES.map((p) => {
              const active = Math.abs(coords.lat - p.lat) < 0.01;
              return (
                <button
                  key={p.name}
                  onClick={() => setCoords({ lat: p.lat, lon: p.lon })}
                  className={`flex-shrink-0 rounded-md border p-2 px-3 text-xs font-medium transition-colors duration-150 ${
                    active
                      ? "border-accent-sky bg-accent-sky text-black"
                      : "border-border bg-surface text-muted hover:border-accent-sky hover:text-foreground"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </section>

        <SevereWeatherBanner weather={weather} />

        <ErrorBoundary>
          <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <CurrentWeatherCard data={weather} isLoading={loadingWeather} unit={unit} />
              <NowcastStrip lat={coords.lat} lon={coords.lon} />
              <MetricsGrid data={weather} isLoading={loadingWeather} unit={unit} />
              <LifestyleInsights weather={weather} unit={unit} />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-8">
              <ForecastChart data={forecast} isLoading={loadingForecast} unit={unit} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CelestialArc sunrise={weather?.sys?.sunrise} sunset={weather?.sys?.sunset} timezoneOffset={weather?.timezone || 0} />
                <AirQualityDial lat={coords.lat} lon={coords.lon} />
              </div>
            </div>
          </main>
        </ErrorBoundary>

        <footer className="border-t border-border pb-8 pt-6 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          Powered by OpenWeather • Updated {weather ? new Date(weather.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
        </footer>
      </div>
    </div>
  );
}
