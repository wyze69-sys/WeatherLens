import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "./Skeleton";

export function ForecastChart({ data, isLoading, unit }) {
  if (isLoading) {
    return (
      <div className="glass-card w-full h-[350px] p-6 flex flex-col">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";

  const chartData = data.list.map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    fullDate: format(new Date(item.dt * 1000), "MMM d, h:mm a"),
    temp: Math.round(item.main.temp),
  })).slice(0, 16);

  return (
    <div className="glass-card w-full h-[350px] p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-6 tracking-tight">48-Hour Temperature Trend</h3>
      <div className="flex-1 w-full min-h-0 text-current">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", opacity: 0.7 }}
              dy={10}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", opacity: 0.7 }}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/90 text-white border border-white/10 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                      <p className="text-xs opacity-70 mb-1">{payload[0].payload.fullDate}</p>
                      <p className="font-semibold text-lg">
                        {payload[0].value}
                        <span className="text-sm font-normal opacity-80">{tempUnit}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="currentColor"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
