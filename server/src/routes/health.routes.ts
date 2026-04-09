import { Router } from "express";

export const healthRouter = Router();

// 基础健康检查：直接访问 /api/health/healthz
healthRouter.get("/healthz", (req, res) => {
  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: { status: "ok" },
  });
});

// 额外的服务健康检查：包含环境变量状态（用于排查问题）
healthRouter.get("/status", (req, res) => {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  res.json({
    ok: true,
    requestId: res.locals.requestId,
    data: {
      status: "ok",
      environment: {
        hasDeepseekApiKey: !!deepseekApiKey,
        deepseekApiKeyPrefix: deepseekApiKey ? deepseekApiKey.substring(0, 4) + "..." : null,
        deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
        deepseekModel: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      },
      timestamp: new Date().toISOString(),
    },
  });
});

