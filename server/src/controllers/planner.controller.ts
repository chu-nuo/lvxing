import type { Request, Response } from "express";
import { getDeepSeekClientFromRequest } from "../services/llm/deepseekProvider";
import { PlannerService } from "../services/orchestration/PlannerService";

export async function planner(req: Request, res: Response) {
  const body = req.body ?? {};
  
  // 使用请求头中的 API Key（如果用户提供了）
  const deepseekClient = getDeepSeekClientFromRequest(req);
  const service = new PlannerService(deepseekClient as any);

  const result = await service.plan({
    destination: String(body.destination ?? body.city ?? ""),
    days: body.days != null ? Number(body.days) : undefined,
    budget: body.budget != null ? Number(body.budget) : undefined,
    pace: body.pace != null ? String(body.pace) : undefined,
    localMode: body.localMode != null ? Boolean(body.localMode) : undefined,
    peopleCount: body.peopleCount != null ? Number(body.peopleCount) : undefined,
    travelDateStart:
      typeof body.travelDateStart === "string" ? body.travelDateStart : undefined,
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

