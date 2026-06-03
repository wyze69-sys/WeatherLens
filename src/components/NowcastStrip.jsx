import { useMinutelyPrecip } from "../hooks/useMinutelyPrecip";
import { Skeleton } from "./Skeleton";

const RAIN_THRESHOLD_MM = 0;
const POINT_COUNT = 60;
const SVG_WIDTH = 300;
const SVG_HEIGHT = 48;
const SVG_PADDING_Y = 4;

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

function buildPolylinePoints(chartData) {
  const maxPrecip = Math.max(0.1, ...chartData.map((point) => point.precipitation));
  const drawableHeight = SVG_HEIGHT - SVG_PADDING_Y * 2;

  return chartData
    .map((point, index) => {
      const x = (index / (POINT_COUNT - 1)) * SVG_WIDTH;
      const y = SVG_HEIGHT - SVG_PADDING_Y - (point.precipitation / maxPrecip) * drawableHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
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
  const polylinePoints = buildPolylinePoints(chartData);

  return (
    <section className="field-panel p-3" aria-label="60-minute rain nowcast">
      <div className="h-12 w-full">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={rainSummary}
        >
          <polyline
            fill="none"
            points={polylinePoints}
            stroke="#7DD3FC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <p className="mt-2 font-mono text-xs text-muted">{rainSummary}</p>
    </section>
  );
}
