import { getCrowdContext } from "../contexts/crowdContext";
import { getWeatherSnapshot } from "../contexts/weatherContext";
import { buildReverseMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type ReverseResponse,
  ReverseResponseSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackReverse } from "./fallbacks";

const travelDateToday = () => new Date().toISOString().slice(0, 10);

export class ReverseService {
  constructor(private readonly deepseekClient: DeepSeekClient) {}

  async reverse(input: {
    preferences: string[];
    crowdTolerance: number;
    peopleCount?: number;
    travelDate?: string;
  }): Promise<ReverseResponse> {
    const travelDate = input.travelDate ?? travelDateToday();
    const crowd = getCrowdContext({
      destination: "默认",
      travelDate,
      peopleCount: input.peopleCount ?? 2,
    });
    const weather = getWeatherSnapshot({
      city: "默认",
      travelDate,
    });

    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildReverseMessages({
      preferences: input.preferences,
      crowdTolerance: input.crowdTolerance,
      weather,
      crowd,
    });

    try {
      return await retryStructured<ReverseResponse>({
        schema: ReverseResponseSchema,
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
      return fallbackReverse(input);
    }
  }
}

