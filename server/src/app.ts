import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import { requestIdMiddleware } from "./middlewares/requestId";
import { errorHandler } from "./middlewares/errorHandler";
import { loadEnv } from "./config/env";

export function createApp() {
  loadEnv();

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);
  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

