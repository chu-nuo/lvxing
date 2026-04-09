import { DeepSeekClient, createDeepSeekClientFromEnv } from "./deepseekClient";

// 延迟初始化：避免在模块加载时因环境变量缺失直接崩溃
let _client: DeepSeekClient | null = null;

export function getDeepSeekClient(): DeepSeekClient {
  if (!_client) {
    _client = createDeepSeekClientFromEnv();
  }
  return _client;
}

// 保持兼容：原有代码可直接用 deepseekClient（延迟初始化）
export const deepseekClient: DeepSeekClient = new Proxy({} as DeepSeekClient, {
  get(_target, prop: string | symbol) {
    const client = getDeepSeekClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

