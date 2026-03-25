import { memoryCache } from "../../cache/cacheClient";

export type CrowdLevel = "cold" | "moderate" | "hot";

export type CrowdContextResult = {
  crowdLevel: CrowdLevel;
  crowdIndex: number; // 0..1
  source: "rules_v1";
};

const TTL_CROWD_MS = 60 * 60 * 1000; // 1h

const crowdOverrides: Partial<
  Record<string, { crowdLevel: CrowdLevel; crowdIndex: number }>
> = {
  丽江: { crowdLevel: "hot", crowdIndex: 0.85 },
  大理: { crowdLevel: "moderate", crowdIndex: 0.55 },
  西双版纳: { crowdLevel: "cold", crowdIndex: 0.25 },
  三亚: { crowdLevel: "hot", crowdIndex: 0.8 },
  厦门: { crowdLevel: "moderate", crowdIndex: 0.6 },
  西安: { crowdLevel: "hot", crowdIndex: 0.75 },
  洛阳: { crowdLevel: "moderate", crowdIndex: 0.5 },
  泉州: { crowdLevel: "cold", crowdIndex: 0.3 },
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function getCrowdContext(input: {
  destination: string;
  travelDate: string;
  peopleCount: number;
}): CrowdContextResult {
  const cacheKey = `crowd:${input.destination}:${input.travelDate}:${input.peopleCount}`;
  const cached = memoryCache.get<CrowdContextResult>(cacheKey);
  if (cached) return cached;

  const base = crowdOverrides[input.destination];
  let crowdLevel: CrowdLevel = "moderate";
  let crowdIndex = 0.5;

  if (base) {
    crowdLevel = base.crowdLevel;
    crowdIndex = base.crowdIndex;
  } else {
    // Fallback: estimate by month
    const month = Number(input.travelDate.slice(5, 7));
    if (month >= 6 && month <= 8) {
      crowdLevel = "hot";
      crowdIndex = 0.72;
    } else if (month >= 3 && month <= 5) {
      crowdLevel = "moderate";
      crowdIndex = 0.55;
    } else {
      crowdLevel = "cold";
      crowdIndex = 0.35;
    }
  }

  // peopleCount acts as a "group factor": larger groups choose more popular time slots,
  // which increases the perceived crowd index.
  const peopleFactor = Math.max(0, (input.peopleCount - 2) / 20); // 2->0, 22->1
  crowdIndex = clamp01(crowdIndex + peopleFactor * 0.12);

  const result: CrowdContextResult = { crowdLevel, crowdIndex, source: "rules_v1" };
  memoryCache.set(cacheKey, result, TTL_CROWD_MS);
  return result;
}

