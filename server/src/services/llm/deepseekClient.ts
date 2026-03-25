export type DeepSeekChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export class DeepSeekClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(input: { apiKey: string; baseUrl: string }) {
    this.apiKey = input.apiKey;
    this.baseUrl = input.baseUrl.replace(/\/+$/, "");
  }

  async createChatCompletionJson(params: {
    model: "deepseek-chat" | "deepseek-reasoner" | string;
    messages: DeepSeekChatMessage[];
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    const url = `${this.baseUrl}/chat/completions`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        // DeepSeek 支持 json_object 输出
        response_format: { type: "json_object" },
        max_tokens: params.maxTokens ?? 1200,
        temperature: params.temperature ?? 0.4,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`DeepSeek request failed: ${res.status} ${text}`);
    }

    const payload = (await res.json()) as any;
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("DeepSeek returned empty content");
    }
    return content;
  }

  async generateRecommendJson(input: Parameters<
    typeof import("./promptBuilders").buildRecommendMessages
  >[0]) {
    const { buildRecommendMessages } = await import("./promptBuilders");
    const messages = buildRecommendMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }

  async generatePlannerJson(input: Parameters<
    typeof import("./promptBuilders").buildPlannerMessages
  >[0]) {
    const { buildPlannerMessages } = await import("./promptBuilders");
    const messages = buildPlannerMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }

  async generateReverseJson(input: Parameters<
    typeof import("./promptBuilders").buildReverseMessages
  >[0]) {
    const { buildReverseMessages } = await import("./promptBuilders");
    const messages = buildReverseMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }

  async generateDiceVlogJson(input: Parameters<
    typeof import("./promptBuilders").buildDiceVlogMessages
  >[0]) {
    const { buildDiceVlogMessages } = await import("./promptBuilders");
    const messages = buildDiceVlogMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }

  async generateBlindBoxJson(input: Parameters<
    typeof import("./promptBuilders").buildBlindBoxMessages
  >[0]) {
    const { buildBlindBoxMessages } = await import("./promptBuilders");
    const messages = buildBlindBoxMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }

  async generatePhotoChallengeJson(input: Parameters<
    typeof import("./promptBuilders").buildPhotoChallengeMessages
  >[0]) {
    const { buildPhotoChallengeMessages } = await import("./promptBuilders");
    const messages = buildPhotoChallengeMessages(input);
    return this.createChatCompletionJson({
      model: (process.env.DEEPSEEK_MODEL ?? "deepseek-chat") as any,
      messages,
    });
  }
}

export function createDeepSeekClientFromEnv() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing DEEPSEEK_API_KEY environment variable on server",
    );
  }
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
  return new DeepSeekClient({ apiKey, baseUrl });
}

