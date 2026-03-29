# AI 旅行助手 - Vercel 部署指南

> 🎯 部署方案：Vercel 全栈部署（前端 + Serverless Functions 后端）
> 🌍 访问方案：部署到 Vercel，使用 Cloudflare Workers 反向代理供国内访问

---

## 📋 部署前准备

### 1. Supabase 数据库配置

**项目地址：** https://supabase.com/dashboard/project/ulcekqlebvjfwoilxgan

**步骤：**
1. 登录 Supabase Dashboard
2. 进入项目：`ulcekqlebvjfwoilxgan`
3. 打开 SQL Editor
4. 创建新查询
5. 复制并执行以下 SQL 脚本：

```sql
-- 创建 favorites 表（用户收藏行程）
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 允许认证用户查看自己的收藏
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许认证用户插入自己的收藏
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 允许认证用户删除自己的收藏
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- 授权
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE favorites TO authenticated;
GRANT SELECT ON TABLE favorites TO anon;
```

6. 点击 "Run" 执行脚本
7. 确认表创建成功

**获取 Supabase 配置信息：**
- Supabase URL：从 Project Settings → API 获取
- Supabase Anon Key：从 Project Settings → API 获取

---

### 2. Vercel 环境变量配置

登录 Vercel 后，配置以下环境变量：

#### 🎨 前端环境变量（在项目根目录）

```
VITE_SUPABASE_URL=https://ulcekqlebvjfwoilxgan.supabase.co
VITE_SUPABASE_ANON_KEY=你的Supabase_Anon_Key
VITE_API_BASE_URL=/api
```

#### 🔧 后端环境变量（在项目根目录）

```
DEEPSEEK_API_KEY=sk-vkyddaaxovvjoietzlybmwklymsqwxjjtokeoijawbjgqsjp
DEEPSEEK_BASE_URL=https://api.siliconflow.cn
DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3.2
```

---

## 🚀 部署步骤

### 方式一：通过 Vercel CLI 部署（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署到 Vercel**
```bash
cd F:\罗美琪\作品集\ai旅行项目
vercel --prod
```

4. **配置环境变量**
   - 部署完成后，在 Vercel Dashboard 配置环境变量
   - 重新部署使环境变量生效

5. **获取部署地址**
   - Vercel 会返回部署地址，例如：`https://travelai.vercel.app`

---

### 方式二：通过 GitHub 集成部署

1. **推送代码到 GitHub**
   ```bash
   cd F:\罗美琪\作品集\ai旅行项目
   git add .
   git commit -m "准备 Vercel 部署"
   git push origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 选择 GitHub 仓库：`chu-nuo/lvxing`
   - 配置项目设置：
     - Root Directory: `.`（根目录）
     - Framework Preset: `Vite`
     - Install Command: `npm install`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **配置环境变量**
   - 在 Vercel Dashboard 项目设置中添加上述环境变量

4. **部署**
   - Vercel 会自动检测代码变化并部署

---

## 🌍 国内访问方案（Cloudflare Workers 反向代理）

由于 Vercel 在国内访问较慢，可以使用 Cloudflare Workers 创建一个反向代理：

### 1. 注册 Cloudflare

访问 https://dash.cloudflare.com/ 注册账号（免费）

### 2. 创建 Worker

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 点击 "Create Application"
4. 点击 "Create Worker"
5. 命名为：`travelai-proxy`

### 3. 配置 Worker 代码

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 替换为你的 Vercel 部署地址
    const targetUrl = 'https://travelai.vercel.app' + url.pathname + url.search;

    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // 添加自定义头部（可选）
    modifiedRequest.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');

    try {
      const response = await fetch(modifiedRequest);
      return response;
    } catch (error) {
      return new Response('Error fetching content', { status: 500 });
    }
  }
};
```

### 4. 部署 Worker

1. 点击 "Deploy"
2. 获取 Worker URL：`https://travelai-proxy.你的账号.workers.dev`

### 5. 绑定自定义域名（可选）

如果你有域名，可以将 Worker 绑定到自定义域名：
1. 在 Worker 设置中点击 "Triggers"
2. 点击 "Custom Domains"
3. 添加你的域名，例如：`travelai.yourdomain.com`
4. 按照提示配置 DNS 记录

---

## ✅ 验证部署

### 1. 健康检查

访问你的 Vercel 部署地址的健康检查接口：
```
https://travelai.vercel.app/api/health/healthz
```

预期返回：
```json
{
  "ok": true,
  "requestId": "...",
  "data": {
    "status": "ok"
  }
}
```

### 2. 前端访问

1. 打开浏览器访问前端地址
2. 测试用户登录/注册功能
3. 测试 AI 旅行规划功能
4. 测试收藏功能

### 3. 查看日志

- **Vercel 日志**：在 Vercel Dashboard → Deployments → Logs
- **Serverless Functions 日志**：在 Vercel Dashboard → Functions → Logs

---

## 📊 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                     用户请求                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Workers (可选反向代理)              │
│              https://travelai-proxy.workers.dev             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Vercel 部署                              │
│              https://travelai.vercel.app                    │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────────────────┐      │
│  │   前端静态资源   │  │  Serverless Functions      │      │
│  │  (React + Vite) │  │  (Express /api/*)          │      │
│  └─────────────────┘  └─────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   第三方服务                                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Supabase    │  │ DeepSeek API │  │ SiliconFlow  │   │
│  │  (数据库)    │  │  (AI 服务)   │  │  (API 网关)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 常见问题

### Q1: Vercel 部署后 API 请求失败（404）

**原因：** Vercel 可能没有正确识别 Serverless Functions

**解决方案：**
1. 确认 `api/` 目录存在于项目根目录
2. 确认 `api/index.ts` 正确导出 Express app
3. 重新部署

### Q2: 环境端变量未生效

**解决方案：**
1. 在 Vercel Dashboard 检查环境变量是否正确配置
2. 环境变量配置后需要重新部署才能生效
3. 使用 `vercel env ls` 查看环境变量

### Q3: Supabase RLS 策略导致查询失败

**解决方案：**
1. 确认用户已登录
2. 确认 RLS 策略正确配置
3. 在 Supabase Dashboard 检查 Auth 状态

### Q4: 国内访问速度慢

**解决方案：**
1. 使用 Cloudflare Workers 反向代理（见上文）
2. 或使用国内 CDN 服务加速

---

## 📝 验收标准

部署完成后，检查以下项目：

- [ ] Supabase 数据库表创建成功
- [ ] 前端可正常访问，页面加载无错误
- [ ] 用户注册/登录功能正常
- [ ] AI 旅行规划功能正常
- [ ] 收藏功能正常
- [ ] 健康检查接口返回正常
- [ ] 日志可查看，无报错信息

---

## 🎉 完成！

部署成功后，你会获得：

- **Vercel 部署地址**：类似 `https://travelai.vercel.app`
- **Cloudflare 代理地址**（可选）：类似 `https://travelai-proxy.workers.dev`
- **自定义域名**（可选）：你的域名绑定到 Cloudflare Workers

如有问题，请查看 Vercel 和 Supabase 的日志进行排查。

---

*更新日期：2026-03-29*
*部署方案：Vercel 全栈 + Cloudflare Workers*
