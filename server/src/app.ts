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

  // 判断是否在Vercel环境（Vercel的rewrites已经把 /api/* 映射到函数）
  const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
  // 在Vercel环境中，函数入口已经是 /api/*，所以内部路由不需要再加 /api 前缀
  const apiPrefix = isVercel ? "/" : "/api";

  app.use(apiPrefix, apiRouter);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

