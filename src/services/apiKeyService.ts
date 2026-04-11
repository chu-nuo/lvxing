// API Key 管理服务
const STORAGE_KEY = 'user_api_key';

export interface ApiKeyConfig {
  apiKey: string;
  baseUrl?: string;
}

export const apiKeyService = {
  // 保存用户 API Key
  saveApiKey(config: ApiKeyConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  },

  // 获取用户 API Key
  getApiKey(): ApiKeyConfig | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get API key:', error);
    }
    return null;
  },

  // 清除用户 API Key
  clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  },

  // 检查是否有 API Key
  hasApiKey(): boolean {
    return this.getApiKey() !== null;
  },

  // 获取用于请求头的 API Key
  getApiKeyHeader(): Record<string, string> {
    const config = this.getApiKey();
    if (config?.apiKey) {
      return { 'X-DeepSeek-API-Key': config.apiKey };
    }
    return {};
  },
};
