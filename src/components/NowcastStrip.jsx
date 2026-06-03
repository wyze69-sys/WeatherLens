import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMinutelyPrecip } from "../hooks/useMinutelyPrecip";
import { Skeleton } from "./Skeleton";

const RAIN_THRESHOLD_MM = 0;
const POINT_COUNT = 60;

function buildChartData(minutely = []) {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const point = minutely[index];

    return {
      minute: index,
      precipitation: point?.precipitation ?? 0,
    };
  });
}

function getRainSummary(chartData) {
  const firstRainIndex = chartData.findIndex((point) => point.precipitation > RAIN_THRESHOLD_MM);

  if (firstRainIndex === -1) return "No rain next hour";
  if (firstRainIndex === 0) return "Rain now";
  return `Rain in ${firstRainIndex} min`;
}

export function NowcastStrip({ lat, lon }) {
  const { data, isLoading, isError } = useMinutelyPrecip(lat, lon);

  if (isError) return null;

  if (isLoading) {
    return (
      <section className="field-panel p-3" aria-label="60-minute rain nowcast">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mt-2 h-4 w-32" />
      </section>
    );
  }

  const chartData = buildChartData(data?.minutely);
  const rainSummary = getRainSummary(chartData);

  return (
    <section className="field-panel p-3" aria-label="60-minute rain nowcast">
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
            <XAxis dataKey="minute" hide />
            <YAxis hide domain={[0, (dataMax) => Math.max(dataMax, 0.1)]} />
            <Line
              type="monotone"
              dataKey="precipitation"
              stroke="#7DD3FC"
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 font-mono text-xs text-muted">{rainSummary}</p>
    </section>
  );
}
