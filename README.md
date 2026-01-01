# TypingEnglish
打字练习小游戏（Version 8）。默认使用浏览器本地存储；可选启用 Cloudflare 后端（Workers/Pages Functions + D1）实现**服务端账号**与**真实多人排行榜**（分数榜/WPM榜，含历史总榜与周榜）。

## 目录结构

- `public/`：部署产物（静态站点根目录）
- `worker/`：Cloudflare Workers 入口（可选，用于边缘计算部署/统一托管静态资源 + API）
- `functions/`：Cloudflare Pages Functions（当使用 Pages 托管时提供 `/api/*`）
- `server/`：Worker/Pages 共用的后端逻辑（账号/成绩/排行榜 API）
- `migrations/`：D1 数据库迁移（SQL）
- 根目录 `index.html`/`contact.html`/`Github.html`/`twitter.html`/`Typegame1.html`：本地兼容入口（自动跳转到 `public/`）

## 本地预览

- **无后端（本地存储模式）**：直接打开 `public/index.html`（或打开根目录 `index.html` 会自动跳转）
- **启用后端（服务端账号/多人榜）**：
  - `npm install`
  - 先在 `wrangler.toml` 里配置 D1（见下方“绑定 D1 / 执行迁移”）
  - 初始化本地 D1（一次即可）：`npm run db:migrate:local`
  - Pages 本地预览（推荐）：`npm run pages:dev:db`
  - Workers 本地预览（可选）：`npm run dev:db`

## Cloudflare 控制台连接 GitHub 部署

本仓库支持两种部署方式：

- **Cloudflare Pages（推荐）**：静态托管 `public/` + Pages Functions 提供 `/api/*`
- **Cloudflare Workers（边缘计算）**：用 Worker 托管静态资源（`[assets]`）并提供 `/api/*`

> 你在控制台看到的配置项不一样是正常的：Pages 只有“构建命令/输出目录”；Workers 才会出现“部署命令/非生产分支部署命令/Worker 路径”等字段。

自定义域名：为了方便开源复用，仓库默认不在 `wrangler.toml` 写死域名/路由；请在 Cloudflare 控制台绑定，或在你自己的私有配置中添加 `routes`。

### 方式 A：Cloudflare Pages（连接 GitHub，静态 + Functions + D1）

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

5) 绑定 D1（让 `/api/*` 生效）

> Pages Functions 会自动从仓库的 `functions/` 目录加载；`/api/*` 就是后端接口。

5.1) Cloudflare 控制台 → **D1** → **Create database**

- Database name：建议 `typingenglish`（你也可以用自己的名称）

5.2) 给 Pages 项目添加 D1 绑定：Pages 项目 → **Settings** → **Functions** → **D1 database bindings**

- Variable name：填 `DB`
- Select database：选择你刚创建的数据库
- Environments：建议 **Production** 和 **Preview** 都绑定（预览环境也能正常注册/登录/看榜）

5.3) 初始化数据库表结构（只需执行一次）：在你的电脑上运行

- `npx wrangler login`
- 先在本地 `wrangler.toml` 里补齐 D1 配置（**不要把你的 `database_id` 提交到开源仓库**）：

  ```toml
  [[d1_databases]]
  binding = "DB"
  database_name = "typingenglish"
  database_id = "<YOUR_DATABASE_ID>"
  ```

  `database_id` 获取方式：Cloudflare 控制台 → **D1** → 进入你的数据库 → 复制 **Database ID**。

- 然后执行迁移：`npm run db:migrate:remote`（等价于 `wrangler d1 migrations apply DB --remote`）

说明：迁移文件在 `migrations/0001_init.sql`。

6) 预览分支/PR 部署（Preview deployments）

Pages 会自动为非生产分支/PR 生成预览部署，通常无需单独配置“非生产分支部署命令”。

说明：仓库已包含 `public/_redirects`，用于兼容历史路径与大小写（如 `/github.html` → `/Github.html`）。

### 方式 B：Cloudflare Workers（连接 GitHub，部署到边缘计算 + D1）

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
  - 解释：该命令会使用 `wrangler.toml` 的 `[env.preview]`，将非生产分支部署到单独的 Worker 名称（避免覆盖生产 Worker）

4) 绑定 D1（让 `/api/*` 生效）

- Worker → **Settings** → **Bindings** → **D1 Database** → Add binding
  - Variable name：填 `DB`
  - Select database：选择你的 D1 数据库（例如 `typingenglish`）

然后在本地执行一次迁移：`npm run db:migrate:remote`（等价于 `wrangler d1 migrations apply DB --remote`）。

注意：若你用 `npx wrangler`，会默认拉取最新版（例如 `wrangler 4.x`），迁移命令会强依赖 `wrangler.toml` 里的 `[[d1_databases]]` 配置；推荐优先使用仓库内置脚本：`npm run db:migrate:remote`。

5) 必填/易错项：Worker 名称必须全局唯一

- 生产 Worker 名称来自 `wrangler.toml` 的 `name`
- 预览 Worker 名称来自 `wrangler.toml` 的 `[env.preview].name`（默认 `typingenglish-preview`）

如果你的账号下已存在同名 Worker，请把它们改成你自己的唯一名称（例如 `typingenglish-<yourname>`、`typingenglish-preview-<yourname>`），然后再重新触发部署。

## 排行榜说明

- 分数榜（Score）：按用户累计积分（每局得分 + 成就积分）排行；周榜为**本周内每局得分累计**（不含成就积分）。
- WPM 榜：按用户历史最佳 WPM 排行；周榜为**本周内的最高 WPM**。
- 周榜重置：按 UTC 周计算（周一 00:00 UTC 自动切换到新一周，无需额外定时任务）。

## 命令行部署（可选）

不通过控制台连接 GitHub，也可以本地用 `wrangler` 发布：

- Pages：`npm run pages:deploy`
- Workers：`npm run deploy`

说明：如需绑定自定义域名/路由，请在 Cloudflare 控制台或 `wrangler` 中配置。
