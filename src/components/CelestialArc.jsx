import { useState, useEffect } from "react";
import { Sun, Moon, Clock, ArrowDown, ArrowUp } from "lucide-react";

export function CelestialArc({ sunrise, sunset, timezoneOffset }) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!sunrise || !sunset) return null;
  
  const totalDaylight = sunset - sunrise;
  const timePassed = Math.max(0, Math.min(now - sunrise, totalDaylight));
  const percentage = timePassed / totalDaylight;
  const isNight = now < sunrise || now > sunset;

  const durationHours = Math.floor(totalDaylight / 3600);
  const durationMins = Math.floor((totalDaylight % 3600) / 60);

  const getLocalTime = (ts) => {
    const d = new Date((ts + timezoneOffset) * 1000);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  const angle = Math.PI - (percentage * Math.PI);
  const cx = 100 + 80 * Math.cos(angle);
  const cy = 90 - 80 * Math.sin(angle);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            {isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Day Tracker</h3>
            <p className="text-xs font-medium opacity-40">Solar Journey</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative pb-10">
        <div className="relative w-full max-w-[240px] aspect-[2/1] scale-110 mb-8">
          <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
            <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="4 4" />
            <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="white" strokeWidth="3" strokeDasharray="251.2" strokeDashoffset={251.2 - (percentage * 251.2)} className="transition-all duration-1000 ease-out" />
            <circle cx={cx} cy={cy} r="6" fill={isNight ? "#818cf8" : "#facc15"} className="shadow-lg transition-all duration-1000" />
            {!isNight && <circle cx={cx} cy={cy} r="12" fill="#facc15" opacity="0.2" className="animate-pulse" />}
          </svg>

          <div className="absolute top-[95%] left-0 right-0 flex justify-between px-1 text-[10px] font-black tracking-tighter opacity-50 uppercase">
            <div className="flex flex-col items-start leading-none gap-1">
              <div className="flex items-center gap-1"><ArrowUp className="w-2.5 h-2.5 text-green-400" /> {getLocalTime(sunrise)}</div>
              <span className="opacity-60 font-medium">Sunrise</span>
            </div>
            <div className="flex flex-col items-end leading-none gap-1">
              <div className="flex items-center gap-1">{getLocalTime(sunset)} <ArrowDown className="w-2.5 h-2.5 text-orange-400" /></div>
              <span className="opacity-60 font-medium">Sunset</span>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-wider">Daylight</span>
            </div>
            <p className="text-xl font-bold leading-none tracking-tight">
              {durationHours}h {durationMins}m
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2 opacity-50">
              {isNight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              <span className="text-[10px] font-black uppercase tracking-wider">{isNight ? "Status" : "Remaining"}</span>
            </div>
            <p className="text-xl font-bold leading-none tracking-tight">
              {isNight ? "Night" : `${Math.floor((sunset - now) / 3600)}h ${Math.floor(((sunset - now) % 3600) / 60)}m`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
