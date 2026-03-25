import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error("[server] error:", err);

  const requestId = res.locals.requestId;

  if (res.headersSent) {
    return;
  }

  const message =
    err instanceof Error ? err.message : "Internal Server Error";

  res.status(500).json({
    ok: false,
    requestId,
    error: {
      code: "INTERNAL_ERROR",
      message,
    },
  });
}

