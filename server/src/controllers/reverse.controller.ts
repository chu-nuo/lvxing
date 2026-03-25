import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { ReverseService } from "../services/orchestration/ReverseService";

const service = new ReverseService(deepseekClient as any);

export async function reverse(req: Request, res: Response) {
  const body = req.body ?? {};

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

