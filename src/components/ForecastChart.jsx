import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "./Skeleton";

export function ForecastChart({ data, isLoading, unit }) {
  if (isLoading) {
    return (
      <div className="field-panel flex h-[350px] w-full flex-col p-5">
        <Skeleton className="mb-6 h-5 w-52" />
        <Skeleton className="w-full flex-1" />
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
    <section className="field-panel flex h-[350px] w-full flex-col p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="field-label">48-Hour Forecast</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">Temperature Trend</h3>
        </div>
        <p className="font-mono text-xs text-muted">{tempUnit}</p>
      </div>
      <div className="min-h-0 w-full flex-1 text-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#252B36" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#9AA0A6"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#252B36" }}
              tick={{ fill: "#9AA0A6", fontFamily: "JetBrains Mono" }}
              dy={10}
            />
            <YAxis
              stroke="#9AA0A6"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#252B36" }}
              tick={{ fill: "#9AA0A6", fontFamily: "JetBrains Mono" }}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              cursor={{ stroke: "#252B36", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-field border border-border bg-elevated px-3 py-2 text-foreground">
                      <p className="mb-1 text-xs text-muted">{payload[0].payload.fullDate}</p>
                      <p className="field-value text-lg font-semibold text-accent-sky">
                        {payload[0].value}
                        <span className="ml-1 text-xs text-muted">{tempUnit}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#7DD3FC"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#7DD3FC", stroke: "#0B0E13", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
