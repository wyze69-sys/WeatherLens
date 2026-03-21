import { useState, useEffect } from "react";
import { SearchAutocomplete } from "./components/SearchAutocomplete";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { MetricsGrid } from "./components/MetricsGrid";
import { ForecastChart } from "./components/ForecastChart";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SevereWeatherBanner } from "./components/SevereWeatherBanner";
import { LifestyleInsights } from "./components/LifestyleInsights";
import { AirQualityDial } from "./components/AirQualityDial";
import { CelestialArc } from "./components/CelestialArc";
import { useWeather, useForecast } from "./hooks/useWeather";
import { useUnit } from "./hooks/useUnit";
import { getThemeForWeather } from "./lib/theme";
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

  const theme = getThemeForWeather(weather?.weather[0]?.id || 800);

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${theme.bgGradient} ${theme.textColor} px-4 py-8 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-50">
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M17.5 19a3 3 0 0 0-2.4-4.8c-.8-2.4-3.5-3.8-5.9-3-2 .7-3.2 2.7-3.2 4.8A3 3 0 0 0 6.5 22h11a3 3 0 0 0 0-6Z"/><path d="M8 12a4 4 0 0 1 8 0"/></svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">WeatherLens</h1>
          </div>
          
          <div className="flex-1 w-full md:max-w-md relative z-50">
            <SearchAutocomplete onLocationSelect={(lat, lon) => setCoords({ lat, lon })} />
          </div>

          <div className="flex bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
            {["metric", "imperial"].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  unit === u ? "bg-white text-slate-900 shadow-xl scale-100" : "hover:bg-white/10 opacity-40 hover:opacity-100 scale-95"
                }`}
              >
                {u === "metric" ? "°C" : "°F"}
              </button>
            ))}
          </div>
        </header>

        {/* Horizontal Province Scroll */}
        <section className="relative group">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Quick Locations</h2>
            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1 snap-x scroll-smooth">
            {CAMBODIA_PROVINCES.map((p) => {
              const active = Math.abs(coords.lat - p.lat) < 0.01;
              return (
                <button
                  key={p.name}
                  onClick={() => setCoords({ lat: p.lat, lon: p.lon })}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all snap-start ${
                    active ? "bg-white text-slate-900 border-white shadow-2xl scale-105" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          {/* Edge Fades */}
          <div className="absolute top-8 bottom-4 left-0 w-12 bg-gradient-to-r from-[#0f172a] to-transparent pointer-events-none opacity-40" />
          <div className="absolute top-8 bottom-4 right-0 w-12 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none opacity-40" />
        </section>

        <SevereWeatherBanner weather={weather} />

        <ErrorBoundary>
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-4 space-y-8 animate-in [animation-delay:100ms]">
              <CurrentWeatherCard data={weather} isLoading={loadingWeather} unit={unit} />
              <MetricsGrid data={weather} isLoading={loadingWeather} unit={unit} />
              <LifestyleInsights weather={weather} unit={unit} />
            </div>
            
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="animate-in [animation-delay:200ms]">
                <ForecastChart data={forecast} isLoading={loadingForecast} unit={unit} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full animate-in [animation-delay:300ms]">
                <CelestialArc sunrise={weather?.sys?.sunrise} sunset={weather?.sys?.sunset} timezoneOffset={weather?.timezone || 0} />
                <AirQualityDial lat={coords.lat} lon={coords.lon} />
              </div>
            </div>
          </main>
        </ErrorBoundary>
        
        <footer className="flex flex-col items-center gap-4 mt-16 pb-12 opacity-30 group">
          <div className="w-12 h-[1px] bg-white/20 transition-all group-hover:w-24" />
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-center">
            Powered by OpenWeather • Updated {weather ? new Date(weather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </div>
        </footer>
      </div>
    </div>
  );
}
