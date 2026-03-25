type ApiResponse<T> = {
  ok: boolean;
  requestId?: string;
  data: T;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

// 根据环境确定 API 基础 URL
const getBaseUrl = (): string => {
  // 生产环境使用相对路径（同域）
  if (import.meta.env.PROD) {
    return '';
  }
  // 开发环境使用配置的地址
  return (import.meta as any).env?.VITE_API_BASE_URL ?? '';
};

const baseUrl: string = getBaseUrl();

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${baseUrl}${path}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const json = (await resp.json().catch(() => ({}))) as ApiResponse<T>;

  if (!resp.ok || !json.ok) {
    const message =
      json?.error?.message ?? `Request failed: ${resp.status} ${resp.statusText}`;
    throw new Error(message);
  }

  return json.data;
}

export type RecommendRequest = {
  origin: string;
  travelers: number;
  budget: number;
  days: number;
  transport: string[];
  preferences: string[];
  mood: string;
  specialNeeds?: string;
  travelDate?: string;
};

export async function recommend(payload: RecommendRequest) {
  return apiPost<any>("/api/recommend", payload);
}

export type PlannerRequest = {
  destination: string;
  days?: number;
  budget?: number;
  pace?: string;
  localMode?: boolean;
  peopleCount?: number;
  travelDateStart?: string;
};

export async function planner(payload: PlannerRequest) {
  return apiPost<any>("/api/planner", payload);
}

export type ReverseRequest = {
  preferences: string[];
  crowdTolerance: number;
  peopleCount?: number;
  travelDate?: string;
};

export async function reverse(payload: ReverseRequest) {
  return apiPost<any>("/api/reverse", payload);
}

export async function diceVlogScript(input: {
  city?: string;
  persona?: string;
  dice: Record<string, string>;
  travelDate?: string;
}) {
  return apiPost<any>("/api/dice/vlog-script", input);
}

export async function blindboxRecommend(input: {
  theme: string;
  budget: number;
  days: number;
  preferences?: string[];
  reveal?: boolean;
}) {
  return apiPost<any>("/api/blindbox/recommend", input);
}

export async function photochallengePlan(input: {
  locationChoice: string;
  challengeTask: string;
  travelDate?: string;
  peopleCount?: number;
}) {
  return apiPost<any>("/api/photochallenge/plan", input);
}

