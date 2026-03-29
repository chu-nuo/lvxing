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
  return app(req, res);
}
