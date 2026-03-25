# TravelAI 后端部署说明

这是一个 `Express + TypeScript` 后端，用于为前端提供：
`/api/recommend`、`/api/planner`、`/api/reverse`、`/api/dice/vlog-script`、`/api/blindbox/recommend`、`/api/photochallenge/plan`

## 1. 环境变量

在 `server/` 目录创建 `.env`（或在服务器环境变量中配置），至少需要：

- `DEEPSEEK_API_KEY`：DeepSeek API Key（必须）
- `DEEPSEEK_BASE_URL`：DeepSeek API Base URL（可选，默认 `https://api.deepseek.com`）
- `DEEPSEEK_MODEL`：模型名（可选，默认 `deepseek-chat`）
- `PORT`：后端端口（可选，默认 `3001`）
- `CORS_ORIGIN`：允许跨域的前端域名列表（可选）
  - 示例：`http://localhost:5173,https://your-frontend-domain.com`

注意：不要把 `DEEPSEEK_API_KEY` 放到前端代码或前端 `.env` 中。

## 2. 本地联调（开发机可访问）

1. 启动后端：

```bash
cd server
npm install
npm run dev
```

后端默认启动在 `http://localhost:3001`（如果 PORT 不是 3001）。

2. 启动前端：

```bash
cd ..
npm install
npm run dev
```

3. 配置前端调用后端的地址

在前端 `.env` 添加：

- `VITE_API_BASE_URL=http://localhost:3001`

然后重启前端开发服务器。

## 3. 线上部署（国内可直接打开的思路）

推荐架构：
- 前端：静态托管（对象存储 + CDN / 或国内静态站点）
- 后端：一台国内服务器（Node + PM2 或 Docker）
- 统一域名：用 Nginx 反代后端并开启 HTTPS

### 3.1 Nginx 反向代理示例

假设前端域名为 `https://travelai.example.com`，后端 API 希望通过 `https://travelai.example.com/api` 暴露。

```nginx
server {
  listen 443 ssl;
  server_name travelai.example.com;

  location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

如果你把前端和后端分开域名，请在后端设置 `CORS_ORIGIN` 白名单为前端域名。

## 4. 常见问题

### Q: 后端启动失败，提示 missing `DEEPSEEK_API_KEY`
请先设置环境变量 `DEEPSEEK_API_KEY`，然后重启后端服务。

### Q: 前端请求 `/api/*` 失败（跨域/404）
检查：
- `VITE_API_BASE_URL` 是否填对
- 后端是否监听在正确端口
- Nginx 是否正确反代 `/api/` 前缀

