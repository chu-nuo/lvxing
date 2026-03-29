/**
 * Vercel Serverless Function 入口
 * 用于 Express 应用的 Serverless 包装
 */

import { createApp } from '../server/dist/app.js';

// 创建 Express 应用
const app = createApp();

// Vercel Serverless Function handler
export default async function handler(req, res) {
  return app(req, res);
}
