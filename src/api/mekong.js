import { z } from "zod";

const MRC_STATIONS = [
  {
    station: "Phnom Penh Port",
    code: "020101",
    url: "https://api.tsmon2.mrcmekong.org/api/telemetry/water-level/020101/latest",
    alertLevel: 9.5,
    dangerLevel: 10.5,
  },
  {
    station: "Kampong Cham",
    code: "019802",
    url: "https://api.tsmon2.mrcmekong.org/api/telemetry/water-level/019802/latest",
    alertLevel: 14.2,
    dangerLevel: 15.2,
  },
];

export const MekongLevelSchema = z.object({
  station: z.string(),
  level: z.number(),
  alertLevel: z.number(),
  dangerLevel: z.number(),
  timestamp: z.string(),
});

export const MekongLevelsSchema = z.array(MekongLevelSchema);

function findNumber(...values) {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

function findTimestamp(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
    if (Number.isFinite(value)) return new Date(value * 1000).toISOString();
  }
  return new Date().toISOString();
}

function normalizeMrcPayload(payload, stationConfig) {
  const record = Array.isArray(payload) ? payload.at(-1) : payload?.data?.at?.(-1) ?? payload?.data ?? payload?.result ?? payload;
  const level = findNumber(record?.level, record?.waterLevel, record?.water_level, record?.wl, record?.value, record?.Value, record?.H);
  const timestamp = findTimestamp(record?.timestamp, record?.datetime, record?.dateTime, record?.date, record?.DateTime, payload?.timestamp);

  return MekongLevelSchema.parse({
    station: stationConfig.station,
    level: level ?? 0,
    alertLevel: findNumber(record?.alertLevel, record?.alarmLevel, payload?.alertLevel, stationConfig.alertLevel),
    dangerLevel: findNumber(record?.dangerLevel, record?.floodLevel, payload?.dangerLevel, stationConfig.dangerLevel),
    timestamp,
  });
}

async function fetchStationLevel(stationConfig) {
  const res = await fetch(stationConfig.url);
  if (!res.ok) throw new Error(`Failed to fetch MRC river level for ${stationConfig.station}`);
  const payload = await res.json();
  return normalizeMrcPayload(payload, stationConfig);
}

export async function getMekongLevels() {
  const levels = await Promise.all(MRC_STATIONS.map(fetchStationLevel));
  return MekongLevelsSchema.parse(levels);
}
