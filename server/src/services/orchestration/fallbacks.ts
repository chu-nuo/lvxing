import {
  type Destination,
  type PhotoChallengePlanResponse,
  type DiceVlogResponse,
  type BlindBoxResponse,
  type ReverseResponse,
  type RecommendResponse,
  type TravelRoute,
} from "../../schemas/travelSchemas";
import {
  getWeatherSnapshot,
  type WeatherSnapshot,
} from "../contexts/weatherContext";
import { getCrowdContext, type CrowdContextResult } from "../contexts/crowdContext";
import { getRouteRulesContext } from "../contexts/routeRulesContext";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeMatchScore(weather: WeatherSnapshot, crowd: CrowdContextResult) {
  // 简单可解释：拥挤度越低分越高；天气条件给一个小幅增量。
  const crowdPenalty = crowd.crowdIndex * 40; // 0..40
  const weatherBonus =
    weather.condition === "sunny" ? 6 : weather.condition === "rainy" ? -2 : 2;
  return clamp(Math.round(100 - crowdPenalty + weatherBonus), 30, 99);
}

const candidateDestinationList = ["大理", "丽江", "西双版纳", "三亚", "厦门"];

export function fallbackRecommend(input: {
  origin: string;
  travelers: number;
  budget: number;
  days: number;
  transport: string[];
  preferences: string[];
  mood: string;
  specialNeeds?: string;
  travelDate?: string;
}): RecommendResponse {
  const travelDate = input.travelDate ?? todayISO();

  const destinations: Destination[] = candidateDestinationList.map(
    (destination) => {
      const weather = getWeatherSnapshot({ city: destination, travelDate });
      const crowd = getCrowdContext({
        destination,
        travelDate,
        peopleCount: input.travelers,
      });
      const routeRules = getRouteRulesContext({ destination });
      return {
        id: undefined,
        name: destination,
        image: undefined,
        tagline: undefined,
        budget: routeRules.routeTemplate.totalBudget,
        days: routeRules.routeTemplate.days.length,
        weather: { temp: weather.temp, condition: weather.condition },
        crowdLevel: crowd.crowdLevel,
        matchScore: computeMatchScore(weather, crowd),
        highlights: routeRules.highlights.length ? routeRules.highlights : ["城市漫步"],
      };
    },
  );

  return {
    destinations,
    compareEligible: false,
    warnings: ["DeepSeek 生成失败，已使用规则降级结果（Phase1）。"],
    sourcesUsed: { weather: "rules_v1", routeRules: "rules_v1", crowd: "rules_v1" },
  };
}

export function fallbackPlanner(input: {
  destination: string;
  days?: number;
  budget?: number;
  pace?: string;
  localMode?: boolean;
  peopleCount?: number;
}): TravelRoute {
  const routeRules = getRouteRulesContext({ destination: input.destination });
  return {
    destination: input.destination,
    totalBudget: routeRules.routeTemplate.totalBudget,
    budgetBreakdown: routeRules.routeTemplate.budgetBreakdown,
    days: routeRules.routeTemplate.days,
    accommodation: routeRules.routeTemplate.accommodation,
    tips: routeRules.routeTemplate.tips,
  };
}

const reverseFallback = [
  {
    popular: "三亚",
    alternative: "万宁",
    reason: "同样碧海蓝天，海岸更开阔",
    reverseIndex: 92,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    highlights: ["石梅湾", "日月湾", "兴隆热带植物园"],
  },
  {
    popular: "丽江",
    alternative: "沙溪古镇",
    reason: "纳西风情更原生态，游客更少",
    reverseIndex: 88,
    image: "https://images.unsplash.com/photo-1527684651001-731c474bbb5a?w=800&q=80",
    highlights: ["沙溪老街", "古戏台", "云贵小巷"],
  },
  {
    popular: "西安",
    alternative: "洛阳",
    reason: "同样的古都底蕴，更适合慢游",
    reverseIndex: 85,
    image: "https://images.unsplash.com/photo-1564596823821-79b0dead95f3?w=800&q=80",
    highlights: ["龙门石窟", "白马寺", "洛邑古城"],
  },
  {
    popular: "厦门",
    alternative: "泉州",
    reason: "闽南文化更地道，节奏更从容",
    reverseIndex: 90,
    image: "https://images.unsplash.com/photo-1598890777032-bde83547de50?w=800&q=80",
    highlights: ["开元寺", "西街", "清源山"],
  },
];

export function fallbackReverse(input: {
  preferences: string[];
  crowdTolerance: number;
  peopleCount?: number;
  travelDate?: string;
}): ReverseResponse {
  const sorted = [...reverseFallback].sort((a, b) => {
    // crowdTolerance 越低越偏向“更冷门”（reverseIndex 更高）
    if (input.crowdTolerance >= 50) return a.reverseIndex - b.reverseIndex;
    return b.reverseIndex - a.reverseIndex;
  });

  return {
    alternatives: sorted.slice(0, 4).map((d) => ({
      popular: d.popular,
      alternative: d.alternative,
      reason: d.reason,
      reverseIndex: d.reverseIndex,
      image: d.image,
      highlights: d.highlights,
    })),
    crowdUsed: "degraded",
    warnings: ["DeepSeek 生成失败，已使用规则降级结果（Phase1）。"],
  };
}

export function fallbackDiceVlog(input: {
  dice: Record<string, string>;
  city: string;
  persona: string;
  travelDate?: string;
}): DiceVlogResponse {
  const city = input.city || "未知目的地";
  const dice = input.dice;
  const hook = `今天让骰子决定一切：在${city}开启一段不走寻常路的旅行。`;

  const shots = [
    {
      scene: `开场镜头：街头找到你的${dice.where ?? "目的地"}节奏`,
      visualDescription: `在${city}地标前快速切镜，展示今天的主线任务`,
      voiceover: `骰子说，我们先从“去哪儿”开始！`,
      subtitle: `${dice.where ?? "去哪"}.`,
    },
    {
      scene: `美食镜头：${dice.food ?? "当地小吃"}`,
      visualDescription: `从招牌菜到第一口特写，配热气腾腾B-roll`,
      voiceover: `来${city}当然要先吃！`,
      subtitle: `吃什么：${dice.food ?? "当地小吃"}`,
    },
    {
      scene: `交通镜头：用${dice.transport ?? "公交"}穿城`,
      visualDescription: `车窗外景+进站字幕，强调速度与氛围`,
      voiceover: `交通也要有仪式感！`,
      subtitle: `交通：${dice.transport ?? "公交"}`,
    },
    {
      scene: `停留镜头：停${dice.time ?? "半天"}感受细节`,
      visualDescription: `咖啡馆/街角慢镜头，镜头停留在表情与光影`,
      voiceover: `不赶路，才有故事。`,
      subtitle: `停留：${dice.time ?? "半天"}`,
    },
    {
      scene: `预算镜头：控制预算不丢体验`,
      visualDescription: `用小账本/票据拼贴展示“精打细算”`,
      voiceover: `预算有边界，但快乐没有。`,
      subtitle: `消费：${dice.budget ?? "¥100以内"}`,
    },
    {
      scene: `任务镜头：${dice.task ?? "买纪念品"}`,
      visualDescription: `完成任务的瞬间特写 + 轻微反应表情`,
      voiceover: `任务完成，今天的旅行就算赢了！`,
      subtitle: `任务：${dice.task ?? "买一件纪念品"}`,
    },
  ];

  return {
    script: { hook, shots, cta: `把你的骰子旅行发出来，我们一起解锁下一集！` },
    locationSuggestions: [dice.where ?? `${city}`],
    warnings: ["DeepSeek 生成失败，已使用规则脚本降级（Phase1）。"],
  };
}

export function fallbackBlindBox(input: {
  theme: string;
  budget: number;
  days: number;
  preferences: string[];
  reveal: boolean;
}): BlindBoxResponse {
  const theme = input.theme;

  const map: Record<string, { destination: string; clues: string[] }> = {
    seaside: {
      destination: "厦门",
      clues: ["你即将去一个以猫闻名的海滨城市", "海风与夜色会把你推向小巷", "你会遇到一段轻松的旅行节奏"],
    },
    mountain: {
      destination: "昆明",
      clues: ["一座不用空调的城市，空气会很温柔", "山与花把时间拉慢", "你会发现最适合散步的街区"],
    },
    ancient: {
      destination: "大理",
      clues: ["古街的石路会让你慢下来", "你会遇到一段洱海边的故事", "记得留意夕阳的角度"],
    },
    city: {
      destination: "成都",
      clues: ["这座城的烟火气很浓", "你会遇见一碗让人心安的味道", "夜晚会有比想象更漂亮的灯光"],
    },
  };

  const picked = map[theme] ?? map.seaside;
  if (!input.reveal) {
    return {
      clues: picked.clues.slice(0, 3),
      destination: undefined,
      itinerary: undefined,
      warnings: ["DeepSeek 生成失败，已使用规则线索降级（Phase1）。"],
    };
  }

  const itinerary = fallbackPlanner({ destination: picked.destination, days: input.days });
  // 强制把 itinerary.days 使用 input.days（避免 LLM/规则模板天数不一致）
  const forcedDays = itinerary.days.slice(0, input.days);
  return {
    clues: picked.clues.slice(0, 3),
    destination: picked.destination,
    itinerary: {
      ...itinerary,
      days: forcedDays.length ? forcedDays : itinerary.days,
    },
    warnings: ["DeepSeek 生成失败，已使用规则行程降级（Phase1）。"],
  };
}

export function fallbackPhotoChallenge(input: {
  locationChoice: string;
  challengeTask: string;
}): PhotoChallengePlanResponse {
  const location = input.locationChoice || "旅行城市";
  const routeRules = getRouteRulesContext({ destination: location });
  const highlights = routeRules.highlights.length ? routeRules.highlights : ["城市漫步", "光影街区"];

  const missions = [
    {
      title: "任务 1：主题元素特写",
      task: `围绕“${input.challengeTask}”拍摄 1 个明确的主题元素（形状/颜色/光影/纹理）`,
      example: `例如用前景遮挡制造层次，或用强对比突出主题。`,
      whenToShoot: "上午或傍晚光线柔和时段",
      routeSuggestion: `优先从 ${highlights[0]} 附近开始`,
    },
    {
      title: "任务 2：氛围场景",
      task: `拍一张能体现“旅行氛围”的场景照，让画面讲故事而不是只记录地点`,
      example: `抓住人/风/烟火气的动态，配合慢门或运动模糊。`,
      whenToShoot: "日落前后（天空颜色更丰富）",
      routeSuggestion: `衔接到 ${highlights[1] ?? highlights[0]} 做情绪延续`,
    },
    {
      title: "任务 3：路线收尾点",
      task: `完成一张“收尾镜头”，让整组照片形成从 A 到 Z 的叙事闭环`,
      example: `用倒影/拱门/街道透视做终点构图。`,
      whenToShoot: "夜晚灯光开启后 30-60 分钟",
      routeSuggestion: `用 ${highlights[2] ?? highlights[0]} 作为收尾地点`,
    },
  ];

  return {
    challengePlan: {
      missions,
      route: { order: "1", places: highlights.slice(0, 3) },
      weatherUsed: "rules_v1",
      crowdUsed: "high/med/low(rules_v1)",
    },
  };
}

