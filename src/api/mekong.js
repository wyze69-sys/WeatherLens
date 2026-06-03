import { z } from "zod";

const MRC_STATIONS = [
  {
    station: "Phnom Penh Port",
    slug: "phnom-penh-port",
  },
  {
    station: "Kampong Cham",
    slug: "kampong-cham",
  },
];

export const MekongLevelSchema = z.object({
  station: z.string(),
  water_level_m: z.number().nullable(),
  status: z.enum(["normal", "alarm", "flood"]).default("normal"),
  alert_level_m: z.number().nullable().default(null),
  danger_level_m: z.number().nullable().default(null),
  timestamp: z.string().nullable().default(null),
});

export const MekongLevelsSchema = z.array(MekongLevelSchema);

function fallbackLevel(stationConfig) {
  return {
    station: stationConfig.station,
    water_level_m: null,
    status: "normal",
    alert_level_m: null,
    danger_level_m: null,
    timestamp: null,
  };
}

async function fetchStationLevel(stationConfig) {
  try {
    const res = await fetch(`/api/mekong/${stationConfig.slug}`);
    if (!res.ok) return fallbackLevel(stationConfig);

    const payload = await res.json();
    const parsed = MekongLevelSchema.safeParse(payload);
    return parsed.success ? parsed.data : fallbackLevel(stationConfig);
  } catch {
    return fallbackLevel(stationConfig);
  }
}

export async function getMekongLevels() {
  const levels = await Promise.all(MRC_STATIONS.map(fetchStationLevel));
  const parsed = MekongLevelsSchema.safeParse(levels);
  return parsed.success ? parsed.data : MRC_STATIONS.map((stationConfig) => fallbackLevel(stationConfig));
}
