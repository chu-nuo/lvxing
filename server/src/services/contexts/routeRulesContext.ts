import { memoryCache } from "../../cache/cacheClient";
import type { TravelRoute, ItineraryDay, ItineraryActivity } from "../../schemas/travelSchemas";

type RouteRulesContextResult = {
  destination: string;
  highlights: string[];
  routeTemplate: Omit<TravelRoute, "destination">;
};

const TTL_ROUTE_RULES_MS = 6 * 60 * 60 * 1000;

const activity = (a: {
  time: string;
  title: string;
  description: string;
  type: ItineraryActivity["type"];
}): ItineraryActivity => a;

const templateByDestination: Record<string, RouteRulesContextResult["routeTemplate"] & { highlights: string[] }> = {
  大理: {
    highlights: ["洱海骑行", "古城漫步", "苍山索道"],
    accommodation: "大理古城内特色民宿，靠近人民路，交通便利",
    tips: ["大理紫外线较强，请做好防晒", "古城内禁止机动车通行，建议穿舒适的鞋子", "最佳旅游季节是3-5月和9-11月", "可以尝试白族扎染体验"],
    totalBudget: 3500,
    budgetBreakdown: {
      transport: { amount: 1200, percentage: 35 },
      accommodation: { amount: 1000, percentage: 28 },
      food: { amount: 700, percentage: 20 },
      activities: { amount: 600, percentage: 17 },
    },
    days: [
      {
        day: 1,
        activities: [
          activity({ time: "09:00", title: "抵达大理", description: "从机场/高铁站前往古城", type: "transport" }),
          activity({ time: "11:00", title: "入住客栈", description: "大理古城内特色民宿", type: "rest" }),
          activity({ time: "14:00", title: "古城漫步", description: "探索大理古城的历史街巷", type: "sightseeing" }),
          activity({ time: "18:00", title: "白族晚餐", description: "品尝酸辣鱼和乳扇", type: "food" }),
        ],
      },
      {
        day: 2,
        activities: [
          activity({ time: "08:00", title: "环洱海骑行", description: "从才村码头出发，骑行至喜洲", type: "sightseeing" }),
          activity({ time: "12:00", title: "喜洲午餐", description: "喜洲粑粑和凉鸡米线", type: "food" }),
          activity({ time: "15:00", title: "双廊古镇", description: "欣赏洱海日落最佳地点", type: "sightseeing" }),
          activity({ time: "19:00", title: "海景晚餐", description: "海边餐厅，人均150元", type: "food" }),
        ],
      },
      {
        day: 3,
        activities: [
          activity({ time: "09:00", title: "苍山索道", description: "乘坐洗马潭索道，俯瞰洱海", type: "sightseeing" }),
          activity({ time: "13:00", title: "寂照庵素斋", description: "最美尼姑庵的精致素斋", type: "food" }),
          activity({ time: "16:00", title: "三月街", description: "体验白族传统集市", type: "sightseeing" }),
          activity({ time: "20:00", title: "酒吧街", description: "感受大理夜生活", type: "food" }),
        ],
      },
    ] satisfies ItineraryDay[],
  },
  丽江: {
    highlights: ["玉龙雪山", "束河古镇", "纳西文化"],
    accommodation: "丽江古城周边舒适客栈，步行可达景点",
    tips: ["雨天注意保暖与防滑", "建议早出发避开热门排队时段", "古城巷道较窄，穿防滑鞋更舒服", "晚上可以安排轻量散步与纳西风情"],
    totalBudget: 4200,
    budgetBreakdown: {
      transport: { amount: 1400, percentage: 33 },
      accommodation: { amount: 1200, percentage: 29 },
      food: { amount: 900, percentage: 21 },
      activities: { amount: 700, percentage: 17 },
    },
    days: [
      {
        day: 1,
        activities: [
          activity({ time: "10:00", title: "抵达丽江", description: "从交通枢纽前往古城", type: "transport" }),
          activity({ time: "12:00", title: "午餐：纳西风味", description: "品尝当地特色菜肴", type: "food" }),
          activity({ time: "15:00", title: "束河古镇漫步", description: "慢逛小巷与河岸风景", type: "sightseeing" }),
          activity({ time: "19:00", title: "晚餐与夜景", description: "看夜色下的古城灯光", type: "food" }),
        ],
      },
      {
        day: 2,
        activities: [
          activity({ time: "07:30", title: "玉龙雪山出发", description: "早时段更舒适，体验雪山风光", type: "transport" }),
          activity({ time: "12:30", title: "雪山周边午餐", description: "补给能量，注意防寒", type: "food" }),
          activity({ time: "15:30", title: "蓝月谷/观景点", description: "拍照与轻度徒步", type: "sightseeing" }),
          activity({ time: "19:30", title: "返程休息", description: "安排轻松晚间散步", type: "rest" }),
        ],
      },
      {
        day: 3,
        activities: [
          activity({ time: "09:00", title: "木府/古城文化", description: "了解纳西历史与人文", type: "sightseeing" }),
          activity({ time: "12:00", title: "特色午餐", description: "继续探索当地美食", type: "food" }),
          activity({ time: "16:00", title: "拍照与小店体验", description: "选择一条喜欢的巷子慢走", type: "sightseeing" }),
          activity({ time: "20:00", title: "夜晚收尾", description: "咖啡或小酒馆放松", type: "food" }),
        ],
      },
    ] satisfies ItineraryDay[],
  },
};

function fallbackTemplate() {
  const res = {
    highlights: ["城市漫步", "特色美食", "经典景点"],
    accommodation: "市中心舒适酒店/民宿，交通方便",
    tips: ["尽量早出发，避开拥挤时段", "留出机动时间应对临时变化", "做好防晒与补水"],
    totalBudget: 3000,
    budgetBreakdown: {
      transport: { amount: 900, percentage: 30 },
      accommodation: { amount: 900, percentage: 30 },
      food: { amount: 600, percentage: 20 },
      activities: { amount: 600, percentage: 20 },
    },
    days: [
      {
        day: 1,
        activities: [
          activity({ time: "09:00", title: "到达与安顿", description: "从交通枢纽前往住宿并熟悉周边", type: "transport" }),
          activity({ time: "12:00", title: "午餐：本地美食", description: "尝试一个招牌菜", type: "food" }),
          activity({ time: "15:00", title: "经典景点轻逛", description: "安排不太赶的步行段", type: "sightseeing" }),
          activity({ time: "19:00", title: "晚餐与夜生活", description: "选择一个舒适的餐厅或街区", type: "food" }),
        ],
      },
    ] satisfies ItineraryDay[],
  };

  return res;
}

export function getRouteRulesContext(input: {
  destination: string;
}): RouteRulesContextResult {
  const cacheKey = `routeRules:${input.destination}`;
  const cached = memoryCache.get<RouteRulesContextResult>(cacheKey);
  if (cached) return cached;

  const template = templateByDestination[input.destination] ?? fallbackTemplate();
  const result: RouteRulesContextResult = {
    destination: input.destination,
    highlights: template.highlights,
    routeTemplate: {
      accommodation: template.accommodation,
      tips: template.tips,
      totalBudget: template.totalBudget,
      budgetBreakdown: template.budgetBreakdown,
      days: template.days,
    },
  };

  memoryCache.set(cacheKey, result, TTL_ROUTE_RULES_MS);
  return result;
}

