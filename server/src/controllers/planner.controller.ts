import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { PlannerService } from "../services/orchestration/PlannerService";

const service = new PlannerService(deepseekClient as any);

export async function planner(req: Request, res: Response) {
  const body = req.body ?? {};

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

