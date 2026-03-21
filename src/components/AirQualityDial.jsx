import { useAirPollution } from "../hooks/useWeather";
import { Loader2, Wind, ShieldCheck, AlertCircle, Activity } from "lucide-react";
import clsx from "clsx";

const AQI_LEVELS = {
  1: { label: "Good", color: "text-green-400", bg: "bg-green-400", desc: "Air quality is ideal for all." },
  2: { label: "Fair", color: "text-yellow-400", bg: "bg-yellow-400", desc: "Acceptable air quality." },
  3: { label: "Moderate", color: "text-orange-400", bg: "bg-orange-400", desc: "Sensitive groups should limit time outside." },
  4: { label: "Poor", color: "text-red-400", bg: "bg-red-400", desc: "Unhealthy for everyone." },
  5: { label: "Very Poor", color: "text-purple-400", bg: "bg-purple-400", desc: "Health alert: everyone may experience effects." },
};

export function AirQualityDial({ lat, lon }) {
  const { data, isLoading, isError } = useAirPollution(lat, lon);

  if (isLoading) return (
    <div className="glass-card flex flex-col items-center justify-center min-h-[300px] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-white/20" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Analysing Air...</p>
    </div>
  );

  if (isError || !data?.list?.[0]) return (
    <div className="glass-card flex flex-col items-center justify-center min-h-[300px] opacity-20">
      <Activity className="w-12 h-12 mb-4" />
      <p className="text-sm font-bold">Station Offline</p>
    </div>
  );

  const { main, components } = data.list[0];
  const aqi = main.aqi;
  const level = AQI_LEVELS[aqi] || AQI_LEVELS[1];
  
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (aqi / 5) * circumference;

  return (
    <div className="glass-card flex flex-col h-full group relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
            <Wind className="w-5 h-5 opacity-60" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Air Quality</h3>
            <p className="text-xs font-medium opacity-40">Live Pollutants</p>
          </div>
        </div>
        <div className={clsx("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 shadow-inner", level.color)}>
          INDEX {aqi}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center relative z-10">
        <div className="relative flex justify-center scale-110">
          <svg className="w-32 h-32 -rotate-90 overflow-visible" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="8" strokeOpacity="0.05" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={clsx("transition-all duration-1000", level.color.replace('text-', 'stroke-'))} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-4xl font-black leading-none">{aqi}</span>
            <span className={clsx("text-[9px] font-black uppercase tracking-widest mt-1", level.color)}>{level.label}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
            {aqi <= 2 ? <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />}
            <p className="text-xs font-semibold opacity-90 leading-snug">{level.desc}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: components.pm2_5, lab: "PM2.5" },
              { val: components.pm10, lab: "PM10" },
              { val: components.no2, lab: "NO2" },
              { val: components.o3 || components.oz, lab: "O3" }
            ].map((p, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:bg-white/10 transition-colors">
                <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.1em] mb-1">{p.lab}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold">{Math.round(p.val ?? 0)}</span>
                  <span className="text-[8px] opacity-40 font-medium">µg/m³</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={clsx("absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 group-hover:scale-125", level.bg)} />
    </div>
  );
}
