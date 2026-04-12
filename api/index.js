/**
 * Vercel Serverless Function 入口
 * 用于 Express 应用的 Serverless 包装
 */

// 使用 require() 而不是 ES6 import，以兼容 Vercel Serverless Functions
const { createApp } = require('../server/dist/app.js');

// 创建 Express 应用
const app = createApp();

// Vercel Serverless Function handler
module.exports = async function handler(req, res) {
  // Vercel 的 rewrite 规则将 /api/* 转发到这里
  // 但 Express 内部路由期望不带 /api 前缀
  // 所以需要去掉 /api 前缀
  if (req.url.startsWith('/api/')) {
    req.url = req.url.slice(4); // 去掉 '/api' 前缀
  } else if (req.url === '/api') {
    req.url = '/';
  }
  return app(req, res);
};
