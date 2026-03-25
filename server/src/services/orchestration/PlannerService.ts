import { getCrowdContext } from "../contexts/crowdContext";
import { getWeatherSnapshot } from "../contexts/weatherContext";
import { getRouteRulesContext } from "../contexts/routeRulesContext";
import { buildPlannerMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type TravelRoute,
  TravelRouteSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackPlanner } from "./fallbacks";

const travelDateToday = () => new Date().toISOString().slice(0, 10);

export class PlannerService {
  constructor(private readonly deepseekClient: DeepSeekClient) {}

  async plan(input: {
    destination: string;
    days?: number;
    budget?: number;
    pace?: string;
    localMode?: boolean;
    peopleCount?: number;
    travelDateStart?: string;
  }): Promise<TravelRoute> {
    const travelDate = input.travelDateStart ?? travelDateToday();
    const routeRules = getRouteRulesContext({ destination: input.destination });
    const weather = getWeatherSnapshot({
      city: input.destination,
      travelDate,
    });
    const crowd = getCrowdContext({
      destination: input.destination,
      travelDate,
      peopleCount: input.peopleCount ?? 2,
    });

    const days = input.days ?? routeRules.routeTemplate.days.length;
    const budget = input.budget ?? routeRules.routeTemplate.totalBudget;
    const pace = input.pace ?? "medium";
    const localMode = input.localMode ?? false;

    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildPlannerMessages({
      destination: input.destination,
      days,
      budget,
      pace,
      localMode,
      weather,
      routeTemplate: routeRules.routeTemplate,
      crowd,
    });

    try {
      return await retryStructured<TravelRoute>({
        schema: TravelRouteSchema,
        generateOnce: async () => {
          return this.deepseekClient.createChatCompletionJson({
            model,
            messages: messages as any,
          });
        },
        generateWithRepair: async (repairInstruction) => {
          const repairMessages = [
            ...messages,
            {
              role: "user",
              content:
                `你返回的 JSON 不符合目标结构。请仅修复并输出严格符合 schema 的 JSON。\n` +
                `修复原因：${repairInstruction}`,
            },
          ];
          return this.deepseekClient.createChatCompletionJson({
            model,
            messages: repairMessages as any,
          });
        },
        maxRetries: 2,
      });
    } catch {
      // 兜底：用规则模板生成行程
      return fallbackPlanner(input);
    }
  }
}

