# AI 旅行项目

一个基于 React + TypeScript + Vite 的智能旅行规划应用，集成 DeepSeek AI 提供个性化旅行推荐和趣味互动功能。

## ✨ 功能特性

### 核心功能
- 🤖 **AI 智能推荐** - 基于你的偏好，AI 为你发现完美目的地
- 🗺️ **行程规划** - 已有目的地？一键生成详细行程

### 趣味玩法
- 🎨 **色彩漫步** - 用颜色记录旅行
- 🎁 **盲盒旅行** - 未知目的地冒险
- 🎲 **骰子旅行** - 随机决定行程
- 📸 **摄影挑战** - AI 评分你的作品
- 🧩 **足迹拼图** - 解锁中国地图
- 🔄 **反向旅行** - 避开人潮小众游

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript + Vite
- **样式**: Tailwind CSS + shadcn/ui
- **后端**: Express + TypeScript
- **AI**: DeepSeek API (通过硅基流动)

## 🚀 快速开始

### 环境要求
- Node.js 20+
- npm 或 pnpm

### 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 环境变量配置

创建 `.env` 文件：
```env
# 前端 API 地址
VITE_API_BASE_URL=http://localhost:3001
```

创建 `server/.env` 文件：
```env
# DeepSeek API 配置 (硅基流动)
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.siliconflow.cn
DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3

# 服务器端口
PORT=3001
```

### 开发模式
```bash
# 启动后端
cd server
npm run dev

# 新终端 - 启动前端
npm run dev
```

### 构建生产版本
```bash
# 构建前端
npm run build

# 构建后端
cd server
npm run build
```

## 📁 项目结构

```
.
├── src/                    # 前端源码
│   ├── components/         # UI 组件
│   ├── pages/             # 页面组件
│   └── App.tsx            # 应用入口
├── server/                 # 后端服务
│   ├── src/               # 后端源码
│   └── dist/              # 编译输出
├── dist/                   # 前端构建输出
└── package.json
```

## 📝 注意事项

- 本项目使用 **硅基流动** 的 DeepSeek API，API 地址为 `https://api.siliconflow.cn`
- 请确保在 `server/.env` 中正确配置 `DEEPSEEK_BASE_URL`
- 不要将 `.env` 文件提交到 Git（已添加到 .gitignore）

## 📄 许可证

MIT License
