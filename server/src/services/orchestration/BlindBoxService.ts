import { buildBlindBoxMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type BlindBoxResponse,
  BlindBoxResponseSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackBlindBox } from "./fallbacks";

export class BlindBoxService {
  constructor(private readonly deepseekClient: DeepSeekClient) {}

  async recommend(input: {
    theme: string;
    budget: number;
    days: number;
    preferences?: string[];
    reveal?: boolean;
  }): Promise<BlindBoxResponse> {
    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildBlindBoxMessages({
      theme: input.theme,
      budget: input.budget,
      days: input.days,
      preferences: input.preferences ?? [],
      reveal: input.reveal ?? false,
    });

    try {
      return await retryStructured<BlindBoxResponse>({
        schema: BlindBoxResponseSchema,
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
      return fallbackBlindBox({
        theme: input.theme,
        budget: input.budget,
        days: input.days,
        preferences: input.preferences ?? [],
        reveal: input.reveal ?? false,
      });
    }
  }
}

