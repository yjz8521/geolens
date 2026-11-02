import { LOCALE_META, alternates, lp, tr, type Locale } from "./locales";
export const siteConfig = {
  name: "GeoLens",
  nameEn: "GeoLens",
  productFull: "GeoLens",
  /** Former product name; kept in JSON-LD / llms.txt so AI links old mentions to the same entity. */
  legacyName: "GeoLens 投放台",
  /** Homepage headline (owner picked option 3 of 3). */
  taglineZh: "两岸 AI 都查得到你：给台湾品牌与台商的 GEO 工具",
  taglineEn: "Be found by AI on both sides of the Strait: GEO for Taiwan brands and Taiwanese businesses",
  owner: "Kinnv",
};

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://yin-yuan-geo.pages.dev"
  );
}

/** Canonical production origin (Vercel). GitHub Pages mirror canonicalises here to avoid duplicate content. */
export const CANONICAL_ORIGIN = getSiteUrl();

/**
 * Lemon Squeezy store is still in Test mode (application under review).
 * Flip to true once the store is approved and switched to Live.
 */
export const PAYMENTS_LIVE = false;

/** Per-page metadata: canonical + hreflang + Open Graph URL/title/description (localised). */
export function pageMeta(l: Locale, path: string, title: string, description: string, only?: readonly Locale[]) {
  const T = tr(l, title);
  const D = tr(l, description);
  const url = lp(l, path);
  return {
    title: T,
    description: D,
    alternates: alternates(l, path, only),
    openGraph: { type: "website" as const, url, siteName: tr(l, "GeoLens"), locale: LOCALE_META[l].og, title: `${T} · ${tr(l, "GeoLens")}`, description: D, images: [{ url: "/og.png", width: 1200, height: 630, alt: "GeoLens" }] },
    twitter: { card: "summary_large_image" as const, title: `${T} · ${tr(l, "GeoLens")}`, description: D, images: ["/og.png"] },
  };
}

/** Must match next.config.ts basePath. Empty on Vercel root; set BASE_PATH=/yin-yuan-geo-landing for GitHub Pages. */
export const siteBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || "";

export function getAppUrl(): string | null {
  const v = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return v ? v.replace(/\/$/, "") : null;
}

export const checkoutLinks = {
  starter:
    process.env.NEXT_PUBLIC_CHECKOUT_STARTER?.trim() ||
    "https://yin-yuan-geo.lemonsqueezy.com/checkout/buy/c1919b13-7784-426a-aef8-8cea6dd43b4e",
  pro:
    process.env.NEXT_PUBLIC_CHECKOUT_PRO?.trim() ||
    "https://yin-yuan-geo.lemonsqueezy.com/checkout/buy/ce49e252-220e-4556-9003-e642cfa357a9",
};

/** Pro quarterly (NT$9,900 / 季) Lemon Squeezy checkout. */
export const CHECKOUT_PRO_QUARTERLY =
  process.env.NEXT_PUBLIC_CHECKOUT_PRO_QUARTERLY?.trim() ||
  "https://yin-yuan-geo.lemonsqueezy.com/checkout/buy/11775d12-9b90-4a13-8079-2e16a94bf7ce";

/**
 * Public contact IDs shown on /demo/. Leave empty to hide that row.
 */
export const contactIds = {
  line: process.env.NEXT_PUBLIC_CONTACT_LINE_ID?.trim() || "a1993391683",
  wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT_ID?.trim() || "hao_031105",
};

/** Free AI-visibility check: delivery time in working days (owner confirmed ~2). */
export const checkDeliveryDays = process.env.NEXT_PUBLIC_CHECK_DELIVERY_DAYS?.trim() || "2";

/** Formspree endpoint (public form URL, not a secret). NEXT_PUBLIC_FORMSPREE_ENDPOINT overrides. */
export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() || "https://formspree.io/f/mdeaqldp";

export function getDemoEmail(): string {
  return process.env.NEXT_PUBLIC_DEMO_EMAIL?.trim() || "kinnv@geolens.uk";
}

/** List prices (TWD); quotas align with geo-platform plan codes. */
export const draftPlans = [
  {
    code: "free" as const,
    nameZh: "Free",
    nameEn: "Free",
    priceZh: "NT$0",
    priceEn: "NT$0",
    periodZh: "/ 月",
    periodEn: "/ mo",
    blurbZh: "试用工作流与基础监测",
    blurbEn: "Try the workflow and basic monitoring",
    highlightsZh: [
      "最多 2 个专案",
      "每月 50 次监测跑批",
      "每月 20 次 AI 请求",
      "1 个工作区 · 3 位成员",
    ],
    highlightsEn: [
      "Up to 2 projects",
      "50 monitor runs / month",
      "20 AI requests / month",
      "1 workspace · 3 members",
    ],
    cta: "demo" as const,
    featured: false,
  },
  {
    code: "starter" as const,
    nameZh: "Starter",
    nameEn: "Starter",
    priceZh: "NT$1,990",
    priceEn: "NT$1,990",
    periodZh: "/ 月",
    periodEn: "/ mo",
    blurbZh: "小团队起步投放与 API",
    blurbEn: "Small-team packs + API",
    highlightsZh: [
      "最多 10 个专案 · 3 工作区",
      "每月 1,000 次监测",
      "每月 500 次 AI 请求",
      "API 存取 · 多工作区",
      "{LIVE} 自动监测（其他引擎陆续接入中）",
    ],
    highlightsEn: [
      "Up to 10 projects · 3 workspaces",
      "1,000 monitor runs / month",
      "500 AI requests / month",
      "API access · multi-workspace",
      "{LIVE} auto-monitoring (more engines coming)",
    ],
    cta: "checkout" as const,
    featured: false,
  },
  {
    code: "pro" as const,
    nameZh: "Pro",
    nameEn: "Pro",
    priceZh: "NT$3,900",
    priceEn: "NT$3,900",
    periodZh: "/ 月",
    periodEn: "/ mo",
    blurbZh: "完整情报、Webhook 与归因",
    blurbEn: "Full intel, webhooks & attribution",
    highlightsZh: [
      "最多 50 个专案 · 10 工作区",
      "每月 5,000 次监测",
      "Webhook · 排程报表 · 进阶归因",
      "自定义报表",
      "{LIVE} 自动监测（其他引擎陆续接入中）",
    ],
    highlightsEn: [
      "Up to 50 projects · 10 workspaces",
      "5,000 monitor runs / month",
      "Webhooks · scheduled reports · advanced attribution",
      "Custom reports",
      "{LIVE} auto-monitoring (more engines coming)",
    ],
    cta: "checkout" as const,
    featured: true,
  },
  {
    code: "enterprise" as const,
    nameZh: "Enterprise",
    nameEn: "Enterprise",
    priceZh: "洽谈",
    priceEn: "Custom",
    periodZh: "",
    periodEn: "",
    blurbZh: "高配额、软上限与专属支援",
    blurbEn: "High quotas, soft caps & dedicated support",
    highlightsZh: [
      "最多 500 个专案 · 50 工作区",
      "每月 50,000 次监测",
      "监测 / AI 软上限（不硬挡）",
      "全功能 · 客制化 onboarding",
    ],
    highlightsEn: [
      "Up to 500 projects · 50 workspaces",
      "50,000 monitor runs / month",
      "Soft caps on monitor / AI (no hard block)",
      "All features · custom onboarding",
    ],
    cta: "demo" as const,
    featured: false,
  },
];
