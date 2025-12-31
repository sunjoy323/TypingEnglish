# TypingEnglish
纯静态打字练习站点（Version 8）。账号/进度基于浏览器本地存储，因此不会在不同电脑间同步。

## 目录结构

- `public/`：部署产物（静态站点根目录）
- `worker/`：Cloudflare Workers 入口（可选，用于边缘计算部署）
- 根目录 `index.html`/`contact.html`/`Github.html`/`twitter.html`/`Typegame1.html`：本地兼容入口（自动跳转到 `public/`）

## 本地预览

- 直接打开 `public/index.html`（或打开根目录 `index.html` 会自动跳转）
- 使用 Cloudflare 工具（可选）：
  - `npm install`
  - `npm run pages:dev`（Pages 本地预览）
  - `npm run dev`（Workers 本地预览）

## Cloudflare Pages 部署（推荐）

在 Cloudflare Pages 控制台设置：

- Build command：留空
- Output directory：`public`

或命令行：`npm run pages:deploy`

## Cloudflare Workers 部署（边缘计算）

- `npm install`
- `npm run deploy`

说明：`wrangler.toml` 里的 `name` 需要全局唯一；如需绑定自定义域名/路由，请在 Cloudflare 控制台或 `wrangler` 中配置。
