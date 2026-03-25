import type { Request, Response } from "express";
import { deepseekClient } from "../services/llm/deepseekProvider";
import { DiceService } from "../services/orchestration/DiceService";

const service = new DiceService(deepseekClient as any);

export async function diceVlogScript(req: Request, res: Response) {
  const body = req.body ?? {};

  const dice = body.dice && typeof body.dice === "object" ? body.dice : {};

  const result = await service.generateVlogScript({
    city: typeof body.city === "string" ? body.city : undefined,
    persona: typeof body.persona === "string" ? body.persona : undefined,
    travelDate: typeof body.travelDate === "string" ? body.travelDate : undefined,
    dice: Object.fromEntries(
      Object.entries(dice).map(([k, v]) => [k, String(v)]),
    ),
  });

  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: result,
  });
}

