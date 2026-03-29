# AI 旅行项目 - 对接文档

> 编写日期：2026-03-27  
> 编写者：木偶 🧸

---

## 📋 问题概览

| 功能 | 问题 | 根因 |
|------|------|------|
| 登录/注册 | 无法使用 | 前端 `.env` 缺少 Supabase 凭证；本地无 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` |
| 收藏功能 | 无法使用 | 同上 + 数据库 `favorites` 表可能未创建/未配置 RLS |
| AI 推荐地点 | 无法使用 | 后端服务未公网部署；前端 `VITE_API_BASE_URL=http://localhost:3001` 只能本地调试 |

---

## 🔧 问题一：登录和收藏功能修复

### 1.1 确认 Supabase 配置

代码中使用的是 Supabase Auth + 数据库，当前凭证已在 `vercel.json` 中配置：

```
VITE_SUPABASE_URL = https://pafifzxsprzxrvaywrfg.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZmlmenhzcHJ6eHJ2YXl3cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYyMzYsImV4cCI6MjA5MjEyMjIzNn0.O_v6dUL88kuqibmgobfyW5nEzuBMVsy2H3pGLG2iqkg
```

**但本地 `.env` 缺少这两个变量**，所以本地开发无法使用。

### 1.2 修复步骤

#### Step 1：在前端 `.env` 补充 Supabase 凭证

编辑项目根目录的 `.env` 文件：

```env
VITE_SUPABASE_URL=https://pafifzxsprzxrvaywrfg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZmlmenhzcHJ6eHJ2YXl3cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYyMzYsImV4cCI6MjA5MjEyMjIzNn0.O_v6dUL88kuqibmgobfyW5nEzuBMVsy2H3pGLG2iqkg
VITE_API_BASE_URL=http://localhost:3001
```

#### Step 2：检查 Supabase 数据库表

登录 [Supabase Dashboard](https://supabase.com/dashboard) → 选择项目 → **Table Editor** → 检查是否存在 `favorites` 表。

`favorites` 表结构应如下：

| 列名 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键，默认生成 |
| user_id | uuid | 关联用户（来自 auth.users） |
| title | text | 行程标题 |
| destination | text | 目的地 |
| content | jsonb | 行程详细内容 |
| created_at | timestamptz | 创建时间，默认 now() |

**建表 SQL（如果表不存在）：**

```sql
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 开启 RLS（行级安全）
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和操作自己的收藏
CREATE POLICY "Users can manage own favorites"
ON favorites
FOR ALL
USING (auth.uid() = user_id);
```

#### Step 3：检查 Supabase Auth 设置

在 Supabase Dashboard → **Authentication** → **URL Configuration**：

- **Site URL**：填写你的前端地址（如 `http://localhost:5173` 本地，或生产域名）
- **Redirect URLs**：添加 `https://pafifzxsprzxrvaywrfg.supabase.co`**之外的**允许重定向 URL（如本地 `http://localhost:5173`）

---

## 🤖 问题二：AI 推荐功能接入

### 2.1 当前架构问题

AI 推荐功能依赖后端 Express 服务（`server/` 目录），但：

- 前端 `VITE_API_BASE_URL=http://localhost:3001` → 只能本地调试
- 后端服务无法部署到 Vercel（Vercel Functions 是无状态的，不适合 Express 长期运行）
- 需要独立服务器/云主机来运行后端

### 2.2 架构说明

```
┌─────────────────────────────────────────────────────┐
│  用户浏览器                                            │
│  http://localhost:5173 (开发)                          │
│  https://your-domain.com (生产)                        │
└──────────────────┬────────────────────────────────────┘
                   │ fetch /api/recommend
                   ▼
┌─────────────────────────────────────────────────────┐
│  后端服务器 (独立云主机，必须公网可达)                    │
│  Express + DeepSeek API                              │
│  监听端口 3001                                        │
│  CORS_ORIGIN=你的前端域名                              │
└──────────────────┬────────────────────────────────────┘
                   │ HTTPS 请求
                   ▼
         ┌─────────────────┐
         │  DeepSeek API   │
         │  (via SiliconFlow)│
         └─────────────────┘
```

### 2.3 生产环境后端部署步骤

#### Option A：国内云服务器 + Nginx（推荐）

1. **购买云服务器**（阿里云/腾讯云/华为云等，推荐香港节点以兼顾国内外访问）

2. **在服务器上安装 Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v  # 应显示 v18.x.x
   ```

3. **上传后端代码到服务器**
   ```bash
   # 在服务器上
   cd /opt
   git clone <你的仓库地址> travelai-server
   cd travelai-server/server
   npm install
   ```

4. **配置环境变量**
   ```bash
   # 在 server/ 目录创建 .env
   DEEPSEEK_API_KEY=sk-vkyddaaxovvjoietzlybmwklymsqwxjjtokeoijawbjgqsjp
   DEEPSEEK_BASE_URL=https://api.siliconflow.cn
   DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3
   PORT=3001
   CORS_ORIGIN=https://your-frontend-domain.com   # 你的前端域名
   ```

5. **使用 PM2 运行后端**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name travelai-api
   pm2 save
   pm2 startup   # 设置开机自启
   ```

6. **配置 Nginx 反向代理（同时支持 HTTPS）**
   ```nginx
   server {
       listen 443 ssl;
       server_name api.your-domain.com;   # 你的 API 域名

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

7. **配置防火墙**：开放 443 端口

8. **更新前端 `.env` 生产配置**
   ```env
   VITE_API_BASE_URL=https://api.your-domain.com
   ```

#### Option B：使用第三方 API 托管平台

如果不想自己维护服务器，可使用：
- **Railway**（railway.app）- 有免费额度，支持 Node.js
- **Render** - 支持持续运行服务
- **Deta Space** - 免费

### 2.4 开发环境调试

```bash
# 终端 1：启动后端
cd server
npm install   # 如果还没装依赖
npm run dev    # 监听 http://localhost:3001

# 终端 2：启动前端
npm run dev    # 监听 http://localhost:5173
```

确认前端 `.env` 中：
```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## 📊 问题三：确认 Vercel 环境变量

登录 [Vercel Dashboard](https://vercel.com/dashboard) → 选择项目 → **Settings** → **Environment Variables**，确认以下变量已配置：

| 变量名 | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | `https://pafifzxsprzxrvaywrfg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...`（完整的 key）|
| `VITE_API_BASE_URL` | `https://api.your-domain.com`（后端公网地址）|

---

## 📁 需要修改的文件清单

### 文件 1：`F:\罗美琪\作品集\ai旅行项目\.env`（新建/更新）

```env
VITE_SUPABASE_URL=https://pafifzxsprzxrvaywrfg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZmlmenhzcHJ6eHJ2YXl3cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYyMzYsImV4cCI6MjA5MjEyMjIzNn0.O_v6dUL88kuqibmgobfyW5nEzuBMVsy2H3pGLG2iqkg
VITE_API_BASE_URL=http://localhost:3001
```

### 文件 2：`F:\罗美琪\作品集\ai旅行项目\vercel.json`（建议补充）

建议将 `VITE_API_BASE_URL` 也加入 `vercel.json`，这样前端生产环境才知道请求哪个后端：

```json
{
  "version": 2,
  "name": "ai-travel",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "env": {
    "VITE_SUPABASE_URL": "https://pafifzxsprzxrvaywrfg.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZmlmenhzcHJ6eHJ2YXl3cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzYyMzYsImV4cCI6MjA5MjEyMjIzNn0.O_v6dUL88kuqibmgobfyW5nEzuBMVsy2H3pGLG2iqkg",
    "DEEPSEEK_API_KEY": "sk-vkyddaaxovvjoietzlybmwklymsqwxjjtokeoijawbjgqsjp",
    "DEEPSEEK_BASE_URL": "https://api.siliconflow.cn",
    "DEEPSEEK_MODEL": "deepseek-ai/DeepSeek-V3",
    "VITE_API_BASE_URL": "https://你的后端API域名"  ← 补充这行
  }
}
```

> ⚠️ 注意：`DEEPSEEK_*` 变量不应该加到 `vercel.json`，它们是后端变量，不应该暴露给前端！

### 文件 3：`F:\罗美琪\作品集\ai旅行项目\server\.env`（后端环境变量）

已在文件中配置好，无需修改：

```env
DEEPSEEK_API_KEY=sk-vkyddaaxovvjoietzlybmwklymsqwxjjtokeoijawbjgqsjp
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
PORT=3001
```

> 💡 注意：`vercel.json` 里 `DEEPSEEK_BASE_URL` 设置的是 `https://api.siliconflow.cn`，但 `server/.env` 里是 `https://api.deepseek.com`。需要统一！建议都改为 SiliconFlow 的地址，因为国内直接访问 DeepSeek 可能不稳定。

---

## 🔍 调试检查清单

### 登录功能调试

- [ ] `.env` 中 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已填写
- [ ] 重启前端 `npm run dev`
- [ ] Supabase Dashboard → Authentication → Providers → **Email** 已启用
- [ ] 浏览器控制台无 CORS 错误
- [ ] Network 面板看到 `auth/v1/token?grant_type=password` 请求返回 200

### 收藏功能调试

- [ ] `favorites` 表已在 Supabase 创建
- [ ] RLS 策略已配置（用户只能操作自己的收藏）
- [ ] 登录后点击收藏，前端 `addFavorite()` 无报错
- [ ] Supabase Table Editor 中能看到新插入的收藏记录

### AI 推荐调试

- [ ] 后端 `npm run dev` 在服务器上运行
- [ ] 浏览器直接访问 `http://你的服务器IP:3001/api/health` 返回正常
- [ ] 前端填写表单提交，Network 面板看到请求发到 `/api/recommend`
- [ ] 返回的 `destinations` 数组不为空（而非 fallback 的 mock 数据）

---

## 📝 VSCode 修改建议

按以下顺序修改：

1. **修改 `.env`** → 添加 Supabase 凭证
2. **Supabase Dashboard** → 确认/创建 `favorites` 表 + RLS
3. **Supabase Dashboard** → 确认 Email Auth 已启用
4. **部署后端服务** → 推荐使用国内云服务器 + PM2
5. **修改 `vercel.json`** → 补充 `VITE_API_BASE_URL`
6. **更新 Vercel 环境变量** → Settings → Environment Variables

---

*文档版本：v1.0 | 如有问题请检查调试检查清单*
