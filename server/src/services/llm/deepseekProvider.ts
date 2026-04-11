import { DeepSeekClient, createDeepSeekClientFromEnv, createDeepSeekClient } from "./deepseekClient";

// 延迟初始化：避免在模块加载时因环境变量缺失直接崩溃
let _client: DeepSeekClient | null = null;

export function getDeepSeekClient(): DeepSeekClient {
  if (!_client) {
    _client = createDeepSeekClientFromEnv();
  }
  return _client;
}

// 新增：根据请求头中的 API Key 创建客户端
export function getDeepSeekClientFromRequest(req?: { headers?: Record<string, string | string[] | undefined> }): DeepSeekClient {
  const headerKey = req?.headers?.['x-deepseek-api-key'];
  const apiKey = Array.isArray(headerKey) ? headerKey[0] : headerKey;
  
  if (apiKey && apiKey.trim()) {
    const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
    return createDeepSeekClient(apiKey, baseUrl);
  }
  
  // 如果没有提供 API Key，则使用默认的环境变量
  return getDeepSeekClient();
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

