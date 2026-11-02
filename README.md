# GeoLens 落地页 / GeoLens Landing

营销站（非产品 App）。产品本体在私有仓 `github.com/yjz8521/geo-platform`。

Marketing site only — not the product app. Product lives in the private repo above.

## 本地运行 / Run locally

```bash
cd yin-yuan-geo-landing
cp .env.example .env.local   # 按需填写
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # 生产构建
```

## 环境变量 / Env vars

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 本站公开 URL（sitemap / OG）。Vercel 填 `https://….vercel.app`；默认 `https://yin-yuan-geo.pages.dev`（Pages 镜像也以 Vercel 为 canonical） |
| `BASE_PATH` / `NEXT_PUBLIC_BASE_PATH` | Vercel / 本地根路径留空；GitHub project Pages 设为 `/yin-yuan-geo-landing` |
| `NEXT_PUBLIC_APP_URL` | 上线后的 geo-platform 产品地址。**留空则不展示产品入口**，避免虚构 demo URL |
| `NEXT_PUBLIC_CHECKOUT_STARTER` / `_PRO` / `_PRO_QUARTERLY` | Lemon Squeezy 结账链接覆盖（默认值写在 `src/lib/site.ts`） |
| `NEXT_PUBLIC_DEMO_EMAIL` | 试用联系邮箱，默认 `kinnv@geolens.uk` |

不要把 Lemon Squeezy API key、Webhook secret 或数据库凭证放进本仓。

Do not commit Lemon Squeezy API keys, webhook secrets, or DB credentials.

## 连接正式产品与付款 / Connecting later

### 1. 产品 App（geo-platform）

1. 将 geo-platform 部署到你的主机（Railway / Render / Vercel 等，见该仓 `DEPLOYMENT.md`）。
2. 把正式 HTTPS 地址写入本站环境变量：`NEXT_PUBLIC_APP_URL=https://your-app.example.com`。
3. 重新 build / 部署本落地页。首页与 `/demo`、`/about` 会自动出现「进入产品」链接。
4. 未配置前，本站**不会**捏造公开 demo URL。

### 2. 付款（Lemon Squeezy）

Stripe 不支持台湾，改用 Lemon Squeezy（信用卡／PayPal，新台币）。结账链接在 `src/lib/site.ts`：Starter、Pro、Pro 季付。
商店目前为 **Test mode**（审核中）。审核通过并切到 Live 后：把 `PAYMENTS_LIVE` 改为 `true`（移除定价页「付款通道审核中」提示），并确认 Live 模式下的结账链接是否变更。

## 引擎接入狀態 / Engine status

所有「已接入／陸續接入中」的說法都來自 `src/content/engines.json`。某個引擎接上自動跑問後，把它的 `"live"` 改成 `true`，重新 build 即可；首頁、方案、FAQ、指南、JSON-LD、llms.txt 會一起更新。

文案裡用代號表示引擎名單：`{LIVE}`（已接入）、`{COMING_CN}`（國內接入中）、`{COMING_GLOBAL}`（海外接入中），由 `src/lib/engines.ts` 依語言填入名稱。新寫的文案若提到引擎現況，請用這些代號，不要直接寫死引擎名稱。

## 路由 / Routes

- `/` — 首页
- `/pricing` — 方案草案
- `/demo` — 试用申请
- `/about` — 关于
- `/llms.txt`、`/robots.txt`、`/sitemap.xml` — SEO / GEO

## 技术栈

Next.js App Router · TypeScript · Tailwind CSS v4

价格与客户数字均为草案 / 占位，请勿当作已验证营收。

## Deploy

### Cloudflare Pages（正式網址 https://yin-yuan-geo.pages.dev）

- Build command：`npm run build`；Output directory：`out`
- 環境變數：`NEXT_PUBLIC_SITE_URL=https://<網域>`（或 `SITE_URL`，不要結尾斜線）；`BASE_PATH`、`NEXT_PUBLIC_BASE_PATH` 留空。
- canonical、hreflang、JSON-LD、sitemap.xml、robots.txt、llms.txt 都從這個變數取網域（`src/lib/site.ts` 的 `getSiteUrl()`、`scripts/write-seo.mjs`）。預設就是 `https://yin-yuan-geo.pages.dev`；之後買了自己的網域再改。
- 聯絡信箱：`NEXT_PUBLIC_DEMO_EMAIL` 可覆寫；預設 kinnv@geolens.uk。網域開好 Email Routing 後改成 `hi@<網域>`（規格 4-4）；該信箱只能收信，回信先用 Gmail。
- 轉址：`public/_redirects`（Cloudflare 格式，與 `vercel.json` 相同，301）；`public/_headers` 設安全標頭與快取。
- `vercel.json`：舊網址 yin-yuan-geo-landing.vercel.app 整站 301 到 https://yin-yuan-geo.pages.dev 。
- 選填：`NEXT_PUBLIC_CHECK_DELIVERY_DAYS`（健檢交付工作天，預設 2）、`NEXT_PUBLIC_CONTACT_LINE_ID`、`NEXT_PUBLIC_CONTACT_WECHAT_ID`（覆寫健檢頁的 LINE／微信 ID）、`NEXT_PUBLIC_FORMSPREE_ENDPOINT`（健檢頁線上表單，預設 https://formspree.io/f/mdeaqldp ，可用環境變數覆寫）。

### Vercel (preferred, root URL)

- Leave `BASE_PATH` / `NEXT_PUBLIC_BASE_PATH` empty (default).
- Set `NEXT_PUBLIC_SITE_URL` to the production `https://….vercel.app` URL (no trailing slash).
- `prebuild` runs `scripts/write-seo.mjs` so sitemap/robots match that URL.

### GitHub Pages (project site)

Static export still works at:

`https://yjz8521.github.io/yin-yuan-geo-landing/`

Rebuild with path prefix, then publish `out/` to `gh-pages`:

```bash
BASE_PATH=/yin-yuan-geo-landing NEXT_PUBLIC_BASE_PATH=/yin-yuan-geo-landing \
  NEXT_PUBLIC_SITE_URL=https://yjz8521.github.io/yin-yuan-geo-landing \
  npm run build
# then publish out/ to gh-pages branch (do not delete existing Pages)
```




## 收款 Payments (Lemon Squeezy)
- Starter / Pro CTAs use Lemon Squeezy checkout links hardcoded in `src/lib/site.ts` (override: `NEXT_PUBLIC_CHECKOUT_STARTER` / `NEXT_PUBLIC_CHECKOUT_PRO`). Stripe is not used (unsupported in Taiwan); `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` is obsolete.
- **Note:** the Lemon Squeezy store is currently in **Test mode** pending approval — real charges won't happen until the store is activated (switch links to live if they change).
- Mainland customers: mailto kinnv@geolens.uk (WeChat / bank transfer, manual).
