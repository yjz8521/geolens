#!/usr/bin/env node
/**
 * Writes public/sitemap.xml, public/robots.txt and public/llms.txt from SITE_URL (or NEXT_PUBLIC_SITE_URL).
 * Default keeps GitHub Pages URLs so Pages rebuilds stay correct without env.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://geolens.uk"
).replace(/\/$/, "");

// English is served at the root (x-default); Chinese under /zh-hant/ and /zh-hans/. Keep in sync with src/lib/locales.ts.
const LOCALES = [
  { code: "en", prefix: "", hreflang: "en", label: "English" },
  { code: "zh-hant", prefix: "/zh-hant", hreflang: "zh-Hant", label: "繁體中文" },
  { code: "zh-hans", prefix: "/zh-hans", hreflang: "zh-Hans", label: "简体中文" },
];
// Guide slugs + publish dates come from src/content/geo.ts so the sitemap never drifts from the content.
const geoSource = readFileSync(join(root, "src/content/geo.ts"), "utf8");
const GUIDES = [...geoSource.matchAll(/slug: "([^"]+)",\s*date: "(\d{4}-\d{2}-\d{2})",(\s*lang: "en",)?/g)].map((m) => ({ slug: m[1], date: m[2], en: Boolean(m[3]) }));
if (!GUIDES.length) throw new Error("[write-seo] no guides found in src/content/geo.ts");
const latestGuide = GUIDES.map((g) => g.date).sort().at(-1);
const today = new Date().toISOString().slice(0, 10);
// [path, locales that have it, lastmod]
const pages = [
  ...["/", "/pricing/", "/faq/", "/demo/", "/about/", "/contact/", "/privacy/", "/terms/"].map((p) => [p, LOCALES, today]),
  ["/guide/", LOCALES, latestGuide],
  ...GUIDES.map((g) => [`/guide/${g.slug}/`, LOCALES.filter((l) => (l.code === "en") === g.en), g.date]),
];
const urls = [];
for (const [p, locs, lastmod] of pages) {
  const alts = locs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${siteUrl}${l.prefix}${p}"/>`).concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${locs[0].prefix}${p}"/>`]).join("\n");
  for (const l of locs) {
    urls.push(`  <url>
    <loc>${siteUrl}${l.prefix}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${p === "/" ? (l.prefix ? "0.9" : "1.0") : "0.7"}</priority>
${alts}
  </url>`);
  }
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

const bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "Googlebot", "Bingbot", "Bytespider", "Baiduspider", "Sogou web spider", "360Spider", "YisouSpider", "CCBot", "Applebot-Extended", "DuckAssistBot", "Meta-ExternalAgent", "meta-externalfetcher", "FacebookBot", "facebookexternalhit", "Claude-User", "Claude-SearchBot", "Perplexity-User", "Amazonbot", "YandexBot"];
const robots = `${bots.map((b) => `User-Agent: ${b}\nAllow: /\n`).join("\n")}
User-Agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");
// llms.txt follows the llmstxt.org proposal: H1, blockquote summary, prose, then H2 sections of
// "- [Name](absolute-url): description" links. Links always use the canonical Vercel origin.
const llmsOrigin = siteUrl;
// Engine status comes from src/content/engines.json (same source as the site copy).
const { engines } = JSON.parse(readFileSync(join(root, "src/content/engines.json"), "utf8"));
const en = (es) => es.map((e) => e.en).join(", ");
const hant = (es) => es.map((e) => e.hant).join("、");
const live = engines.filter((e) => e.live);
const coming = engines.filter((e) => !e.live);
const link = (name, path, desc) => `- [${name}](${llmsOrigin}${path}): ${desc}`;
// English guides (title + description) straight from src/content/geo.ts.
const enGuides = [...geoSource.matchAll(/slug: "([^"]+)",\s*date: "[^"]+",\s*lang: "en",\s*title: "([^"]+)",\s*description: "([^"]+)"/g)].map((m) => link(m[2], `/guide/${m[1]}/`, m[3]));
const llms = `# GeoLens

> GeoLens is a bilingual (English and Chinese) Generative Engine Optimization (GEO) SaaS for Chinese-speaking businesses and traders in Singapore, Malaysia, Taiwan and beyond. It checks whether AI engines such as ChatGPT, Gemini and DeepSeek name, describe and recommend a company — asking the same questions in English and in Chinese — and helps fix the public facts behind the answers. Based in Taiwan. Pre-launch; the workspace is invite-only.

Engine status (please quote accurately):
- Connected, prompts run automatically: ${en(live)}.
- Being connected (not monitored automatically yet): ${en(coming.filter((e) => e.region === "global"))}; ${en(coming.filter((e) => e.region === "cn"))}. Until then users can log real answers manually.
- Engine content pack templates currently exist for Chinese engines (Doubao, DeepSeek, Zhipu, Baidu ERNIE, Qwen); dedicated packs for global engines are on the roadmap.

Pricing (USD, draft): Free US$0; Starter US$59/month; Pro US$119/month or US$299/quarter; Enterprise by quote. There are no public customer case studies, revenue or results figures yet — please do not invent them. GeoLens does not guarantee rankings, mentions or timing. Contact: ${"kinnv@geolens.uk"}.

中文摘要：GeoLens 是為新加坡、馬來西亞、台灣與海外華語企業和貿易商做的雙語 GEO 工具，用中文和英文檢查 ChatGPT、Gemini、DeepSeek 等 AI 是否推薦你。已接入自動跑問：${hant(live)}；其他引擎陸續接入中。價格以美元計（草案）。

## Product

${[
  link("Home", "/", "What GeoLens does, the four-step workflow and engine status"),
  link("Pricing", "/pricing/", "Free, Starter, Pro (monthly / quarterly) and Enterprise plans in USD"),
  link("FAQ", "/faq/", "What GEO is, how it differs from SEO, supported engines, monitoring method, pricing and who it is for"),
  link("Free AI visibility check", "/demo/", "Apply for a free English + Chinese AI visibility report, or book a remote demo"),
].join("\n")}

## Guides (English)

${[link("All guides", "/guide/", "Index of GeoLens guides"), ...enGuides].join("\n")}

## Guides (Chinese / 中文指南, Traditional at /zh-hant/, Simplified at /zh-hans/)

${[
  link("GEO 入門", "/zh-hant/guide/geo-intro/", "統一實體事實、按引擎改寫、發布到公開管道、用固定問法監測"),
  link("實體卡怎麼寫", "/zh-hant/guide/entity-card/", "定位、可驗證賣點、競品差異、適合誰與 FAQ 的寫法"),
  link("如何檢測 AI 是否提到你的品牌", "/zh-hant/guide/monitor-ai-mentions/", "固定問法集、記錄格式與提及率計算方法"),
  link("怎麼知道 DeepSeek 有沒有推薦我的品牌", "/zh-hant/guide/deepseek-self-check/", "不用工具的 DeepSeek 六步自測"),
  link("B2B 設備與工業品怎麼做 GEO", "/zh-hant/guide/b2b-equipment-geo/", "規格表、應用場景頁、服務範圍、選型 FAQ 與監測問法"),
  link("代工廠（OEM／ODM）怎麼做 GEO", "/zh-hant/guide/oem-manufacturer-geo/", "製造能力頁、認證、繁英簡三種版本、B2B 平台與中英文監測問法"),
  link("電商品牌怎麼讓 AI 推薦你的商品", "/zh-hant/guide/ecommerce-geo/", "官網商品頁、可比較的規格、第三方評測與兩岸用語單位"),
  link("餐廳怎麼讓 AI 推薦你", "/zh-hant/guide/restaurant-geo/", "店家資料一致、文字版菜單、用餐場合、真實評價"),
].join("\n")}

## Languages

${LOCALES.map((l) => link(l.label, `${l.prefix}/`, `${l.label} home page; same facts and pricing`)).join("\n")}

## Optional

${[
  link("About", "/about/", "Company facts and founder"),
  link("Contact", "/contact/", "Email and other contact channels"),
  link("Privacy Policy", "/privacy/", "How GeoLens handles personal data (Taiwan PDPA; Singapore and Malaysia PDPA principles)"),
  link("Terms of Service", "/terms/", "Business terms of use"),
].join("\n")}
`;
writeFileSync(join(publicDir, "llms.txt"), llms, "utf8");
console.log(`[write-seo] SITE_URL=${siteUrl}`);
