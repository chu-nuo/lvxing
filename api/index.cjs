/**
 * Vercel Serverless Function 入口
 * 用于 Express 应用的 Serverless 包装
 */

const path = require('path');

// 动态加载编译后的 app.js
const { createApp } = require(path.join(process.cwd(), 'server/dist/app.js'));

// 创建 Express 应用
const app = createApp();

// Vercel Serverless Function handler
module.exports = async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
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
