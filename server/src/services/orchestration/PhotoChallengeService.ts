import { getCrowdContext } from "../contexts/crowdContext";
import { getWeatherSnapshot } from "../contexts/weatherContext";
import { buildPhotoChallengeMessages } from "../llm/promptBuilders";
import type { DeepSeekClient } from "../llm/deepseekClient";
import {
  type PhotoChallengePlanResponse,
  PhotoChallengePlanSchema,
} from "../../schemas/travelSchemas";
import { retryStructured } from "../llm/retryStructured";
import { fallbackPhotoChallenge } from "./fallbacks";

const travelDateToday = () => new Date().toISOString().slice(0, 10);

export class PhotoChallengeService {
  constructor(private readonly deepseekClient: DeepSeekClient) {}

  async plan(input: {
    locationChoice: string;
    challengeTask: string;
    travelDate?: string;
    peopleCount?: number;
  }): Promise<PhotoChallengePlanResponse> {
    const travelDate = input.travelDate ?? travelDateToday();
    const crowd = getCrowdContext({
      destination: input.locationChoice,
      travelDate,
      peopleCount: input.peopleCount ?? 2,
    });
    const weather = getWeatherSnapshot({
      city: input.locationChoice,
      travelDate,
    });

    const model = (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any;
    const messages = buildPhotoChallengeMessages({
      locationChoice: input.locationChoice,
      travelDate,
      peopleCount: input.peopleCount ?? 2,
      challengeTask: input.challengeTask,
      weather,
      crowd,
    });

    try {
      return await retryStructured<PhotoChallengePlanResponse>({
        schema: PhotoChallengePlanSchema,
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
      return fallbackPhotoChallenge({
        locationChoice: input.locationChoice,
        challengeTask: input.challengeTask,
      });
    }
  }
}

