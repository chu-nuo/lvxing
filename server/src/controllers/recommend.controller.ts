import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { RecommendService } from "../services/orchestration/RecommendService";

const service = new RecommendService(deepseekClient as any);

export async function recommend(req: Request, res: Response) {
  const body = req.body ?? {};

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

