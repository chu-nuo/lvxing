import { buildDiceVlogMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type DiceVlogResponse,
  DiceVlogResponseSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackDiceVlog } from "./fallbacks";

const travelDateToday = () => new Date().toISOString().slice(0, 10);

export class DiceService {
  constructor(private readonly deepseekClient: DeepSeekClient) {}

  async generateVlogScript(input: {
    city?: string;
    persona?: string;
    dice: Record<string, string>;
    travelDate?: string;
  }): Promise<DiceVlogResponse> {
    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildDiceVlogMessages({
      city: input.city ?? "未知目的地",
      persona: input.persona ?? "旅行博主",
      dice: input.dice,
    });

    try {
      return await retryStructured<DiceVlogResponse>({
        schema: DiceVlogResponseSchema,
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
      return fallbackDiceVlog({
        city: input.city ?? "未知目的地",
        persona: input.persona ?? "旅行博主",
        dice: input.dice,
        travelDate: input.travelDate,
      });
    }
  }
}

