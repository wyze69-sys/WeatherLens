import { z } from "zod";

const MRC_STATIONS = {
  "phnom-penh-port": {
    station: "Phnom Penh Port",
    names: ["Phnom Penh Port"],
    shortNames: ["PPP"],
  },
  "kampong-cham": {
    station: "Kampong Cham",
    names: ["Kompong Cham", "Kampong Cham"],
    shortNames: ["KOM"],
  },
} as const;

type StationKey = keyof typeof MRC_STATIONS;
type StationConfig = (typeof MRC_STATIONS)[StationKey];
type QueryStation = string | string[] | undefined;
type MekongStatus = "normal" | "alarm" | "flood";
type MekongPayload = {
  station: string;
  water_level_m: number | null;
  status: MekongStatus;
  alert_level_m: number | null;
  danger_level_m: number | null;
  timestamp: string | null;
};
type JsonResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => { json: (payload: unknown) => void };
};

const MekongApiSchema = z.object({
  station: z.string(),
  water_level_m: z.number().nullable(),
  status: z.enum(["normal", "alarm", "flood"]),
  alert_level_m: z.number().nullable(),
  danger_level_m: z.number().nullable(),
  timestamp: z.string().nullable(),
});

const FALLBACK_STATUS: MekongStatus = "normal";
const STATIONS_XML_URL = "https://ffw.mrcmekong.org/Stations.xml";

function fallbackPayload(stationConfig?: StationConfig): MekongPayload {
  return {
    station: stationConfig?.station ?? "Mekong",
    water_level_m: null,
    status: FALLBACK_STATUS,
    alert_level_m: null,
    danger_level_m: null,
    timestamp: null,
  };
}

function tagValue(block: string, tagName: string): string | null {
  const match = block.match(new RegExp(`<${tagName}>\\s*([\\s\\S]*?)\\s*<\\/${tagName}>`, "i"));
  return match?.[1]?.trim() ?? null;
}

function numberOrNull(value: string | null): number | null {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function statusForLevel(waterLevel: number | null, alarmLevel: number | null, floodLevel: number | null): MekongStatus {
  if (waterLevel === null) return FALLBACK_STATUS;
  if (floodLevel !== null && waterLevel >= floodLevel) return "flood";
  if (alarmLevel !== null && waterLevel >= alarmLevel) return "alarm";
  return FALLBACK_STATUS;
}

function findStationBlock(xml: string, stationConfig: StationConfig): string | undefined {
  const blocks = xml.match(/<station>[\s\S]*?<\/station>/gi) ?? [];

  return blocks.find((block) => {
    const name = tagValue(block, "name");
    const shortName = tagValue(block, "shortName");
    return (
      (name !== null && stationConfig.names.some((stationName) => stationName === name)) ||
      (shortName !== null && stationConfig.shortNames.some((stationShortName) => stationShortName === shortName))
    );
  });
}

function parseStation(xml: string, stationConfig: StationConfig): MekongPayload {
  const block = findStationBlock(xml, stationConfig);
  if (!block) return fallbackPayload(stationConfig);

  const waterLevel = numberOrNull(tagValue(block, "waterLevel"));
  const alarmLevel = numberOrNull(tagValue(block, "alarmStage"));
  const floodLevel = numberOrNull(tagValue(block, "floodStage"));
  const payload = {
    station: stationConfig.station,
    water_level_m: waterLevel,
    status: statusForLevel(waterLevel, alarmLevel, floodLevel),
    alert_level_m: alarmLevel,
    danger_level_m: floodLevel,
    timestamp: tagValue(block, "DateTime"),
  };

  const parsed = MekongApiSchema.safeParse(payload);
  return parsed.success ? parsed.data : fallbackPayload(stationConfig);
}

function isStationKey(value: string | undefined): value is StationKey {
  return Boolean(value && value in MRC_STATIONS);
}

async function readStation(station: QueryStation): Promise<MekongPayload> {
  const stationKey = Array.isArray(station) ? station[0] : station;
  const stationConfig = isStationKey(stationKey) ? MRC_STATIONS[stationKey] : MRC_STATIONS["phnom-penh-port"];

  try {
    const response = await fetch(STATIONS_XML_URL, {
      headers: {
        "user-agent": "WeatherLens/1.0",
        accept: "application/xml,text/xml,text/plain,*/*",
      },
    });

    if (!response.ok) return fallbackPayload(stationConfig);
    const xml = await response.text();
    return parseStation(xml, stationConfig);
  } catch {
    return fallbackPayload(stationConfig);
  }
}

export default async function handler(request: { query?: { station?: QueryStation } }, response: JsonResponse) {
  const payload = await readStation(request.query?.station);
  response.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  response.status(200).json(payload);
}

export async function onRequest({ params }: { params: { station?: string } }) {
  const payload = await readStation(params.station);
  return Response.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
