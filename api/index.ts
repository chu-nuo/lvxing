/**
 * Vercel Serverless Function 入口
 * 导出 Express 应用供 Vercel 使用
 */

import { app } from '../server/src/app';

// 导出 Express 应用
export default app;

// 支持所有 HTTP 方法
export const config = {
  api: {
    bodyParser: false, // 使用 Express 的 bodyParser
    externalResolver: true,
  },
};
