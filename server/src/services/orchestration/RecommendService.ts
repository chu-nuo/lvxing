import { getWeatherSnapshot } from "../contexts/weatherContext";
import { getCrowdContext } from "../contexts/crowdContext";
import { getRouteRulesContext } from "../contexts/routeRulesContext";
import { buildRecommendMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type RecommendResponse,
  RecommendResponseSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackRecommend } from "./fallbacks";

const travelDateToday = () => new Date().toISOString().slice(0, 10);

export class RecommendService {
  constructor(
    private readonly deepseekClient: DeepSeekClient & { createChatCompletionJson: any },
  ) {}

  async recommend(input: {
    origin: string;
    travelers: number;
    budget: number;
    days: number;
    transport: string[];
    preferences: string[];
    mood: string;
    specialNeeds?: string;
    travelDate?: string;
  }): Promise<RecommendResponse> {
    const travelDate = input.travelDate ?? travelDateToday();

    // Phase1 候选池（后续可扩展为更大的 POI/目的地库）
    const candidatesList = ["大理", "丽江", "西双版纳", "三亚", "厦门"];

    const candidates = candidatesList.map((destination) => {
      const weather = getWeatherSnapshot({ city: destination, travelDate });
      const crowd = getCrowdContext({
        destination,
        travelDate,
        peopleCount: input.travelers,
      });
      const routeRules = getRouteRulesContext({ destination });
      return { destination, weather, crowd, routeRules };
    });

    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildRecommendMessages({
      form: input,
      candidates,
    });

    const schema = RecommendResponseSchema;

    try {
      return await retryStructured<RecommendResponse>({
        schema,
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
    } catch (e) {
      // 保证接口稳定：DeepSeek失败时回退规则降级
      return fallbackRecommend(input);
    }
  }
}

