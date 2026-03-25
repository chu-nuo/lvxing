import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { PhotoChallengeService } from "../services/orchestration/PhotoChallengeService";

const service = new PhotoChallengeService(deepseekClient as any);

export async function photochallengePlan(req: Request, res: Response) {
  const body = req.body ?? {};

  const result = await service.plan({
    locationChoice: String(body.locationChoice ?? body.location ?? ""),
    challengeTask: String(body.challengeTask ?? body.task ?? ""),
    travelDate:
      typeof body.travelDate === "string" ? body.travelDate : undefined,
    peopleCount: body.peopleCount != null ? Number(body.peopleCount) : undefined,
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

