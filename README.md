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

## Cloudflare 控制台连接 GitHub 部署

本仓库支持两种部署方式：

- **Cloudflare Pages（推荐）**：纯静态托管，直接发布 `public/`
- **Cloudflare Workers（边缘计算）**：用 Worker 托管静态资源（`[assets]`），同时可做重定向/逻辑处理

> 你在控制台看到的配置项不一样是正常的：Pages 只有“构建命令/输出目录”；Workers 才会出现“部署命令/非生产分支部署命令/Worker 路径”等字段。

### 方式 A：Cloudflare Pages（连接 GitHub，发布静态站点）

1) Cloudflare 控制台 → **Workers & Pages** → **Create application** → 选择 **Pages** → **Connect to Git**

2) 选择 GitHub 仓库与生产分支（例如 `main`）

3) **Build settings** 建议填写如下：

- Framework preset：选择 **None**
- Root directory（根目录）：留空或填 `/`（表示从仓库根目录运行命令）
- Build command（构建命令）：
  - 若允许留空：留空即可（本项目无构建步骤）
  - 若必须填写：填 `npm run build`（这是一个 no-op，用来满足必须填写的场景）
- Build output directory（输出目录）：填 `public`

4) 点击 **Save and Deploy** 完成首次部署

5) 预览分支/PR 部署（Preview deployments）

Pages 会自动为非生产分支/PR 生成预览部署，通常无需单独配置“非生产分支部署命令”。

说明：仓库已包含 `public/_redirects`，用于兼容历史路径与大小写（如 `/github.html` → `/Github.html`）。

### 方式 B：Cloudflare Workers（连接 GitHub，部署到边缘计算）

如果你需要在边缘侧做重定向/逻辑处理，或希望用 Worker 统一托管静态资源，请选择 Workers 的 Git 集成部署。

1) Cloudflare 控制台 → **Workers & Pages** → **Create application** → 选择 **Workers** → **Connect to Git**

2) 选择 GitHub 仓库与生产分支（例如 `main`）

3) **Build & Deploy 设置**（对应你提到的字段）建议填写如下：

- Root directory（根目录）：
  - 留空或填 `/`
  - 解释：该字段决定下面“构建命令/部署命令”从哪个目录开始执行；本仓库的 `wrangler.toml` 在根目录，因此用仓库根目录即可
- Path（Worker 的路径）：
  - 填 `worker/index.js`
  - 解释：相对于 Root directory 的入口文件路径
- Build command（构建命令）：
  - 推荐填 `npm ci`
  - 解释：在 CI 环境安装依赖（主要是 `wrangler`），比 `npm install` 更稳定；需要仓库包含 `package-lock.json`
- Deploy command（部署命令，生产分支）：
  - 填 `npm run deploy`
  - 解释：等价于执行 `wrangler deploy`（读取 `wrangler.toml`）
- Non-production branch deploy command（非生产分支部署命令）：
  - 推荐填 `npm run deploy:preview`
  - 解释：该命令会将非生产分支部署到一个单独的 Worker 名称（避免覆盖生产 Worker）

4) 必填/易错项：Worker 名称必须全局唯一

- 生产 Worker 名称来自 `wrangler.toml` 的 `name`
- 预览 Worker 名称来自 `package.json` 的 `deploy:preview`（默认 `typingenglish-preview`）

如果你的账号下已存在同名 Worker，请把它们改成你自己的唯一名称（例如 `typingenglish-<yourname>`、`typingenglish-preview-<yourname>`），然后再重新触发部署。

## 命令行部署（可选）

不通过控制台连接 GitHub，也可以本地用 `wrangler` 发布：

- Pages：`npm run pages:deploy`
- Workers：`npm run deploy`

说明：如需绑定自定义域名/路由，请在 Cloudflare 控制台或 `wrangler` 中配置。
