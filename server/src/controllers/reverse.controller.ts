import type { Request, Response } from "express";
import { getDeepSeekClientFromRequest } from "../services/llm/deepseekProvider";
import { ReverseService } from "../services/orchestration/ReverseService";

export async function reverse(req: Request, res: Response) {
  const body = req.body ?? {};
  
  // 使用请求头中的 API Key（如果用户提供了）
  const deepseekClient = getDeepSeekClientFromRequest(req);
  const service = new ReverseService(deepseekClient as any);

  const result = await service.reverse({
    preferences: Array.isArray(body.preferences) ? body.preferences.map(String) : [],
    crowdTolerance: body.crowdTolerance != null ? Number(body.crowdTolerance) : 50,
    peopleCount: body.peopleCount != null ? Number(body.peopleCount) : undefined,
    travelDate: typeof body.travelDate === "string" ? body.travelDate : undefined,
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

