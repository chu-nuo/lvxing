import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/healthz", (req, res) => {
  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: { status: "ok" },
  });
});

