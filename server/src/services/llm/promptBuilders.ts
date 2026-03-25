import type { CrowdContextResult } from "../contexts/crowdContext";
import type { WeatherSnapshot } from "../contexts/weatherContext";
import type { TravelRoute } from "../../schemas/travelSchemas";

export type JsonOnly = { system: string; user: string };

function jsonOnlyInstruction() {
  return [
    "你是旅行规划助手。",
    "你必须只输出 JSON（不允许输出任何解释文字、markdown、前后缀）。",
    "输出内容必须能被 JSON.parse 解析。",
  ].join("\n");
}

export function buildRecommendMessages(input: {
  form: {
    origin: string;
    travelers: number;
    budget: number;
    days: number;
    transport: string[];
    preferences: string[];
    mood: string;
    specialNeeds?: string;
  };
  candidates: Array<{
    destination: string;
    weather: WeatherSnapshot;
    routeRules: {
      highlights: string[];
      routeTemplate: any;
    };
    crowd: CrowdContextResult;
  }>;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: input.form,
    context: {
      candidates: input.candidates.map((c) => ({
        destination: c.destination,
        weather: c.weather,
        routeRules: c.routeRules,
        crowd: c.crowd,
      })),
    },
    output: {
      destinations: [
        {
          id: "string(optional)",
          name: "string",
          image: "string(optional url)",
          tagline: "string(optional)",
          budget: 0,
          days: 0,
          weather: { temp: 0, condition: "sunny|cloudy|rainy" },
          crowdLevel: "cold|moderate|hot",
          matchScore: 0,
          highlights: ["string"],
        },
      ],
      compareEligible: true,
      warnings: ["string(optional)"],
      sourcesUsed: { weather: "string(optional)", routeRules: "string(optional)", crowd: "string(optional)" },
    },
  };

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: JSON.stringify(user) },
  ];
}

export function buildPlannerMessages(input: {
  destination: string;
  days: number;
  budget: number;
  pace: string;
  localMode: boolean;
  weather: WeatherSnapshot;
  routeTemplate: Omit<TravelRoute, "destination">;
  crowd: CrowdContextResult;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: {
      destination: input.destination,
      days: input.days,
      budget: input.budget,
      pace: input.pace,
      localMode: input.localMode,
    },
    context: {
      weather: input.weather,
      crowd: input.crowd,
      routeTemplate: input.routeTemplate,
    },
    output: {
      destination: input.destination,
      totalBudget: 0,
      budgetBreakdown: {
        transport: { amount: 0, percentage: 0 },
        accommodation: { amount: 0, percentage: 0 },
        food: { amount: 0, percentage: 0 },
        activities: { amount: 0, percentage: 0 },
      },
      days: [
        {
          day: 1,
          activities: [
            { time: "09:00", title: "string", description: "string", type: "sightseeing|food|transport|rest" },
          ],
        },
      ],
      accommodation: "string",
      tips: ["string"],
      assumptions: ["string(optional)"],
      warnings: ["string(optional)"],
      sourcesUsed: { weather: "string(optional)", routeRules: "string(optional)", crowd: "string(optional)" },
    },
  };

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: JSON.stringify(user) },
  ];
}

export function buildReverseMessages(input: {
  preferences: string[];
  crowdTolerance: number;
  weather: WeatherSnapshot;
  crowd: CrowdContextResult;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: {
      preferences: input.preferences,
      crowdTolerance: input.crowdTolerance,
    },
    context: { weather: input.weather, crowd: input.crowd },
    output: {
      alternatives: [
        {
          popular: "string",
          alternative: "string",
          reason: "string",
          reverseIndex: 0,
          image: "string(optional url)",
          highlights: ["string"],
        },
      ],
      crowdUsed: "degraded|high|medium|low",
      warnings: ["string(optional)"],
    },
  };
  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: JSON.stringify(user) },
  ];
}

export function buildDiceVlogMessages(input: {
  dice: Record<string, string>;
  city: string;
  persona: string;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: {
      city: input.city,
      persona: input.persona,
      dice: input.dice,
    },
    context: {},
    output: {
      script: {
        hook: "string",
        shots: [
          { scene: "string", visualDescription: "string", voiceover: "string", subtitle: "string" },
        ],
        cta: "string",
      },
      locationSuggestions: ["string(optional)"],
      warnings: ["string(optional)"],
    },
  };
  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: JSON.stringify(user) },
  ];
}

export function buildBlindBoxMessages(input: {
  theme: string;
  budget: number;
  days: number;
  preferences: string[];
  reveal?: boolean;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: {
      theme: input.theme,
      budget: input.budget,
      days: input.days,
      preferences: input.preferences,
      reveal: input.reveal ?? false,
    },
    output: {
      clues: ["string"],
      destination:
        "string(optional: only when reveal=true)",
      itinerary:
        "optional TravelRouteSchema (only when reveal=true)",
      warnings: ["string(optional)"],
    },
  };

  // 给模型明确约束：未揭晓不要编造目的地/行程
  const extraConstraint = input.reveal
    ? "当 reveal=true 时必须同时生成 destination 与 itinerary。"
    : "当 reveal=false 时只生成 clues，destination 与 itinerary 必须省略或保持 undefined。";

  return [
    { role: "system" as const, content: system },
    {
      role: "user" as const,
      content: JSON.stringify(user) + "\n" + extraConstraint,
    },
  ];
}

export function buildPhotoChallengeMessages(input: {
  locationChoice: string;
  travelDate?: string;
  peopleCount?: number;
  challengeTask: string; // e.g. selected challenge task from UI
  weather?: WeatherSnapshot;
  crowd?: CrowdContextResult;
}) {
  const system = jsonOnlyInstruction();
  const user = {
    request: {
      locationChoice: input.locationChoice,
      travelDate: input.travelDate,
      peopleCount: input.peopleCount,
      challengeTask: input.challengeTask,
    },
    context: {
      weather: input.weather,
      crowd: input.crowd,
    },
    output: {
      challengePlan: {
        missions: [
          {
            title: "string",
            task: "string",
            example: "string",
            whenToShoot: "string",
            routeSuggestion: "string",
          },
        ],
        route: {
          order: "1",
          places: ["string"],
        },
        weatherUsed: "string(optional)",
        crowdUsed: "string(optional)",
      },
    },
  };
  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: JSON.stringify(user) },
  ];
}

