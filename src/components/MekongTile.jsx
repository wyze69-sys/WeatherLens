import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getMekongLevels } from "../api/mekong";

function formatUpdateTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function MekongTile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mekongLevels"],
    queryFn: getMekongLevels,
    staleTime: 1000 * 60 * 60,
  });
  const phnomPenh = data?.find((level) => level.station === "Phnom Penh Port") ?? data?.[0];
  const waterLevel = phnomPenh?.water_level_m ?? null;
  const dangerLevel = phnomPenh?.danger_level_m ?? null;
  const percent = waterLevel !== null && dangerLevel ? Math.min(100, Math.max(0, (waterLevel / dangerLevel) * 100)) : 0;
  const danger = phnomPenh?.status === "flood";

  return (
    <section className="rounded-field border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">Mekong — Phnom Penh</h3>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Flood watch</span>
      </div>

      <p className="field-value text-[32px] font-semibold leading-none text-accent-sky">
        {isLoading || waterLevel === null ? "--" : waterLevel.toFixed(1)}<span className="text-lg">m</span>
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-sm bg-border">
        <div className={clsx("h-full", danger ? "bg-danger" : "bg-accent-sky")} style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>
          {waterLevel !== null && dangerLevel !== null
            ? `${waterLevel.toFixed(1)}m / ${dangerLevel.toFixed(1)}m danger`
            : isError
              ? "MRC station unavailable"
              : "-- / -- danger"}
        </span>
        <span>{phnomPenh?.timestamp ? `Updated ${formatUpdateTime(phnomPenh.timestamp)}` : "Updated --:--"}</span>
      </div>
    </section>
  );
}
