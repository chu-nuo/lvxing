import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { BlindBoxService } from "../services/orchestration/BlindBoxService";

const service = new BlindBoxService(deepseekClient as any);

export async function blindboxRecommend(req: Request, res: Response) {
  const body = req.body ?? {};

  const result = await service.recommend({
    theme: String(body.theme ?? ""),
    budget: Number(body.budget ?? 3000),
    days: Number(body.days ?? 3),
    preferences: Array.isArray(body.preferences)
      ? body.preferences.map(String)
      : [],
    reveal: body.reveal != null ? Boolean(body.reveal) : false,
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

