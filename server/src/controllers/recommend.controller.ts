import type { Request, Response } from "express";
import { getDeepSeekClientFromRequest } from "../services/llm/deepseekProvider";
import { RecommendService } from "../services/orchestration/RecommendService";

export async function recommend(req: Request, res: Response) {
  const body = req.body ?? {};
  
  // 使用请求头中的 API Key（如果用户提供了）
  const deepseekClient = getDeepSeekClientFromRequest(req);
  const service = new RecommendService(deepseekClient as any);

  const result = await service.recommend({
    origin: String(body.origin ?? body.location ?? ""),
    travelers: Number(body.travelers ?? 2),
    budget: Number(body.budget ?? 5000),
    days: Number(body.days ?? 5),
    transport: Array.isArray(body.transport) ? body.transport.map(String) : [],
    preferences: Array.isArray(body.preferences) ? body.preferences.map(String) : [],
    mood: String(body.mood ?? "relax"),
    specialNeeds: typeof body.specialNeeds === "string" ? body.specialNeeds : undefined,
    travelDate: typeof body.travelDate === "string" ? body.travelDate : undefined,
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

