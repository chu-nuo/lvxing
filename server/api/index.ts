import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: './server/.env' });

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 导入路由
import recommendRoutes from '../src/routes/recommend.routes';
import plannerRoutes from '../src/routes/planner.routes';
import blindboxRoutes from '../src/routes/blindbox.routes';
import diceRoutes from '../src/routes/dice.routes';
import photochallengeRoutes from '../src/routes/photochallenge.routes';
import reverseRoutes from '../src/routes/reverse.routes';

// 注册路由
app.use('/api/recommend', recommendRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/blindbox', blindboxRoutes);
app.use('/api/dice', diceRoutes);
app.use('/api/photochallenge', photochallengeRoutes);
app.use('/api/reverse', reverseRoutes);

// Vercel Serverless Function 处理器
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}