"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Section, SectionLabel, SectionLead, SectionTitle } from "./Section";
import { useI18n } from "@/lib/i18n";
import { comingEngines, engineName, liveEngines } from "@/lib/engines";
import { tr } from "@/lib/locales";
import { checkDeliveryDays, draftPlans, getAppUrl } from "@/lib/site";

export type GuideCard = { slug: string; title: string; description: string; date: string };

const steps = [
  {
    n: "01",
    icon: "card",
    zh: "填实体卡",
    en: "Entity card",
    dZh: "品牌、品类、卖点、竞品与场景一次结构化。",
    dEn: "Structure brand, category, claims, competitors, and scenarios.",
  },
  {
    n: "02",
    icon: "layers",
    zh: "生成引擎投放包",
    en: "Engine packs",
    dZh: "对豆包 / DeepSeek / 智谱 / 百度 / 千问产出标题、大纲与渠道清单；海外引擎沿用同一实体事实。",
    dEn: "Titles, outlines, and channel lists for each CN engine; global engines reuse the same entity facts.",
  },
  {
    n: "03",
    icon: "send",
    zh: "发布到渠道",
    en: "Publish",
    dZh: "推到创作者草稿箱与品牌 CMS，按 P0/P1 渠道推进。",
    dEn: "Push to creator drafts and brand CMS along P0/P1 channels.",
  },
  {
    n: "04",
    icon: "chart",
    zh: "监测提及率",
    en: "Monitor mentions",
    dZh: "固定问法跑批，看是否被点名、引用与推荐，再做诊断与归因。",
    dEn: "Run fixed prompts, track naming / citations / recommendations, then diagnose.",
  },
] as const;

const problems = [
  { icon: "eyeOff", zh: "SEO 够了，生成式引擎里却搜不到你", en: "SEO is fine — generative engines never name you" },
  { icon: "shuffle", zh: "各家引擎问法不同，人工投放难以规模化", en: "Many engines, many prompt styles — manual GEO does not scale" },
  { icon: "gauge", zh: "没有提及率、引用与竞品缺口数据", en: "No mention rate, citation, or competitor-gap metrics" },
] as const;

const reasons = [
  {
    icon: "bridge",
    zh: "多引擎、多语言",
    en: "Multi-engine, multilingual",
    dZh: "英文、繁体与简体内容分开处理，所有引擎共用同一份品牌事实。",
    dEn: "English, Traditional and Simplified Chinese content handled separately; every engine shares one consistent set of brand facts.",
  },
  {
    icon: "repeat",
    zh: "方法公开、可复测",
    en: "Open, repeatable method",
    dZh: "固定问法、固定条件、按周追踪，提及率怎么算都写在指南里。",
    dEn: "Fixed prompts, fixed conditions, weekly tracking — how mention rate is calculated is in our guides.",
  },
  {
    icon: "shield",
    zh: "不编造数据",
    en: "No invented numbers",
    dZh: "没有虚构客户与成效；目前只有 {LIVE} 自动监测，其他引擎如实标示「接入中」。",
    dEn: "No fictional customers or results. Automatic monitoring today covers only {LIVE}; other engines are clearly marked as coming.",
  },
] as const;


const iconPaths: Record<string, ReactNode> = {
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 10h6M7 14h10" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>,
  send: <><path d="M21 3 10 14" /><path d="m21 3-7 18-4-7-7-4 18-7z" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-3 3.5M6.6 6.6C4.2 8.2 3 12 3 12s4 6 9 6a9 9 0 0 0 4.4-1.1" /></>,
  shuffle: <><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></>,
  gauge: <><path d="M12 14l4-4" /><path d="M3.3 17a9 9 0 1 1 17.4 0" /></>,
  bridge: <><path d="M3 18h18M5 18V9M19 18V9" /><path d="M5 9c3 4 11 4 14 0" /></>,
  repeat: <><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></>,
  check: <path d="m5 12 5 5L20 7" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name]}
    </svg>
  );
}

/** Illustrative AI answer (not a real result) — shows what "being named and cited" looks like. */
function AnswerMock() {
  const { t } = useI18n();
  const tabs = ["DeepSeek", t("豆包", "Doubao"), "ChatGPT"];
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-200/60 via-sky-100/40 to-transparent blur-2xl" />
      <figure className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="flex gap-1 text-[11px] font-medium">
            {tabs.map((x, i) => (
              <span key={x} className={`rounded-full px-2.5 py-0.5 ${i === 0 ? "bg-zinc-950 text-white" : "text-zinc-500"}`}>{x}</span>
            ))}
          </div>
        </div>
        <div className="space-y-4 p-5 text-sm">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-zinc-100 px-4 py-2.5 text-zinc-800">
            {t("台湾有哪些值得推荐的机能服饰品牌？", "Which Taiwan functional apparel brands would you recommend?")}
          </p>
          <div className="space-y-2.5 text-zinc-700">
            <p>{t("以下是几个常被提到的品牌：", "Here are a few brands that come up often:")}</p>
            <ol className="space-y-2">
              <li className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2 ring-1 ring-blue-200">
                <span className="font-mono text-xs text-blue-600">1.</span>
                <span>
                  <b className="text-zinc-950">{t("你的品牌", "Your brand")}</b>
                  <sup className="ml-1 rounded bg-blue-600 px-1 text-[10px] font-semibold text-white">1</sup>
                  <span className="text-zinc-600"> — {t("定位清楚，官网与知乎的资料口径一致", "clear positioning; website and Zhihu facts match")}</span>
                </span>
              </li>
              <li className="flex items-start gap-2 px-3"><span className="font-mono text-xs text-zinc-400">2.</span><span className="text-zinc-500">{t("品牌 B", "Brand B")}</span></li>
              <li className="flex items-start gap-2 px-3"><span className="font-mono text-xs text-zinc-400">3.</span><span className="text-zinc-500">{t("品牌 C", "Brand C")}</span></li>
            </ol>
            <p className="border-t border-zinc-100 pt-2.5 text-xs text-zinc-500">
              {t("来源：", "Sources: ")}<span className="text-blue-600">[1] {t("你的官网", "your website")}</span> · [2] {t("知乎专栏", "Zhihu column")}
            </p>
          </div>
        </div>
      </figure>
      <figcaption className="relative mt-3 text-center text-xs text-zinc-500">
        {t("示意画面：目标是让 AI 回答时点名你，并引用你的公开资料。", "Illustration: the goal is for AI to name you and cite your public pages.")}
      </figcaption>
    </div>
  );
}

const btnPrimary = "inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800";
const btnGhost = "inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50";

export function HomeContent({ guides = [] }: { guides?: GuideCard[] }) {
  const { t, locale, p: lpath } = useI18n();
  const appUrl = getAppUrl();
  const teaser = draftPlans.filter((p) => p.code === "starter" || p.code === "pro");
  const guideHref = (slug: string) => (locale === "zh-hans" ? `/zh-hans/guide/${slug}/` : `/guide/${slug}/`);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-200">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("{LIVE} 已接入自动监测 · 其他引擎陆续接入中", "Live: {LIVE} · more engines coming")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              {t("让 AI", "Get your brand")}
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                {t("推荐你的品牌", "cited by AI")}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {t(
                "当客户问 ChatGPT、Perplexity、Gemini、DeepSeek「推荐哪家」时，让你的品牌出现在答案里。GeoLens 帮品牌整理品牌事实、产出各引擎适用的内容，并持续监测提及率。",
                "When customers ask ChatGPT, Perplexity, Gemini or DeepSeek for a recommendation, make sure your brand is in the answer. GeoLens helps brands structure their facts, produce engine-ready content, and track how often AI mentions them.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={lpath("/demo/")} className={btnPrimary}>
                {t("免费 AI 能见度健检", "Free AI visibility check")}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href={lpath("/pricing/")} className={btnGhost}>
                {t("查看方案", "View pricing")}
              </Link>
              {appUrl ? (
                <a href={appUrl} className="text-sm font-medium text-zinc-950 underline-offset-4 hover:underline" rel="noopener noreferrer">
                  {t("进入产品", "Open product")} →
                </a>
              ) : null}
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
              {[t("免费、不绑约", "Free, no commitment"), `${t("交付时间：约 ", "Delivery: within about ")}${checkDeliveryDays}${t(" 个工作天内", " business days")}`, t("不保证排名或见效时间", "No guarantee of rankings or timing")].map((x) => (
                <li key={x} className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <AnswerMock />
        </div>
      </div>

      {/* Engines strip */}
      <div className="border-b border-zinc-200 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">{t("覆盖引擎", "Engines covered")}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {liveEngines.map((e) => (
              <span key={e.id} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 py-1.5 text-sm font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {engineName(locale, e)}
                <span className="text-xs font-normal text-zinc-400">{t("已接入", "live")}</span>
              </span>
            ))}
            {comingEngines.map((e) => (
              <span key={e.id} className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-500">
                {engineName(locale, e)}
              </span>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-zinc-400">{t("灰色为陆续接入中，接入前可粘贴真实回答人工记录。", "Grey = coming soon; until then you can log real answers manually.")}</p>
        </div>
      </div>

      {/* Problem */}
      <Section>
        <div className="mx-auto max-w-3xl text-center [&>*]:mx-auto">
          <SectionLabel>{t("痛点", "Problem")}</SectionLabel>
          <SectionTitle>{t("品牌在生成式 AI 里「隐形」", "Brands are invisible in generative AI answers")}</SectionTitle>
          <div className="[&>p]:mx-auto">
            <SectionLead>
              {t(
                "用户越来越常直接问豆包、DeepSeek、通义千问，也问 ChatGPT、Perplexity、Gemini。若没有结构化投放与监测，你的品牌不会被点名。",
                "Users ask Doubao, DeepSeek, Qwen — and ChatGPT, Perplexity, Gemini. Without structured GEO and monitoring, you never get named.",
              )}
            </SectionLead>
          </div>
        </div>
        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {problems.map((p) => (
            <li key={p.en} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:block sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Icon name={p.icon} />
              </span>
              <p className="text-[15px] font-medium leading-relaxed text-zinc-800 sm:mt-4">{t(p.zh, p.en)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* How it works */}
      <div className="border-y border-zinc-200 bg-zinc-50">
        <Section>
          <div className="mx-auto max-w-3xl text-center [&>*]:mx-auto">
            <SectionLabel>{t("怎么做", "How it works")}</SectionLabel>
            <SectionTitle>{t("四步闭环", "Four-step loop")}</SectionTitle>
            <div className="[&>p]:mx-auto">
              <SectionLead>{t("与产品内工作流一致：实体卡 → 投放包 → 发布 → 监测。", "Matches the in-product flow: entity → packs → publish → monitor.")}</SectionLead>
            </div>
          </div>
          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden className="absolute left-[12%] right-[12%] top-[52px] hidden h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 lg:block" />
            {steps.map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                    <Icon name={s.icon} />
                  </span>
                  <span className="font-mono text-xs text-zinc-400">{s.n}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-zinc-950">{t(s.zh, s.en)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t(s.dZh, s.dEn)}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* Free check band */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-12 text-white sm:px-12 sm:py-14">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">{t("免费健检", "Free check")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t("先看看 AI 现在怎么回答你的品类", "First, see how AI answers questions in your category")}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-zinc-300">
                {t(
                  "用 10 个固定问法去问 DeepSeek（自动），其他 AI（豆包、ChatGPT 等）由人工查询记录，整理成一份报告：有没有提到你、提到哪些竞争对手、建议先补哪些公开资料。",
                  "We ask DeepSeek 10 fixed questions (automated) and check other AI (Doubao, ChatGPT and more) manually, then send you a report: whether you are mentioned, which competitors are mentioned, and which public information to add first.",
                )}
              </p>
              <Link href={lpath("/demo/")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
                {t("免费 AI 能见度健检", "Free AI visibility check")}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <ul className="space-y-3">
              {[
                { zh: "有没有提到你、排第几", en: "Whether you are named, and where" },
                { zh: "提到了哪些竞争对手", en: "Which competitors are named" },
                { zh: "描述有没有讲错", en: "Whether the description is accurate" },
                { zh: "建议先补哪些公开资料", en: "Which public information to add first" },
              ].map((x) => (
                <li key={x.en} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 backdrop-blur">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {t(x.zh, x.en)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Why us */}
      <Section className="pt-0 sm:pt-0">
        <div className="mx-auto max-w-3xl text-center [&>*]:mx-auto">
          <SectionLabel>{t("为什么选GeoLens", "Why GeoLens")}</SectionLabel>
          <SectionTitle>{t("为 AI 搜索时代做的 GEO", "GEO built for the AI search era")}</SectionTitle>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-3">
          {reasons.map((r) => (
            <li key={r.en} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon name={r.icon} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-zinc-950">{t(r.zh, r.en)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t(r.dZh, r.dEn)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-zinc-950">{t("招募首批合作品牌", "Looking for our first partner brands")}</p>
            <p className="mt-1 text-sm text-zinc-600">{t("先用固定问法建立提及率基线（{LIVE} 自动跑问，其他引擎陆续接入）", "Start with a fixed-prompt mention baseline ({LIVE} automated; more engines coming)")}</p>
          </div>
          <Link href={lpath("/demo/")} className="shrink-0 text-sm font-semibold text-blue-600 hover:underline">
            {t("申请成为合作品牌", "Apply as a partner brand")} →
          </Link>
        </div>
      </Section>

      {/* Guides */}
      {guides.length ? (
        <div className="border-y border-zinc-200 bg-zinc-50">
          <Section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>{t("GEO 指南", "GEO guide")}</SectionLabel>
                <SectionTitle>{t("免费学会自己检测与优化", "Learn to check and improve it yourself — free")}</SectionTitle>
              </div>
              <Link href={lpath("/guide/")} className="text-sm font-semibold text-zinc-950 hover:underline">{t("看全部指南", "All guides")} →</Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={guideHref(g.slug)} hrefLang={locale === "en" ? "zh-Hant" : undefined} className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
                    <time dateTime={g.date} className="text-xs text-zinc-400">{g.date}</time>
                    <h3 className="mt-2 font-semibold leading-snug text-zinc-950 group-hover:text-blue-600">{tr(locale, g.title)}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600">{tr(locale, g.description)}</p>
                    <span className="mt-4 text-sm font-medium text-blue-600">{t("阅读", "Read")}{locale === "en" ? " (中文)" : ""} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      ) : null}

      {/* Pricing teaser */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionLabel>{t("方案预览", "Pricing teaser")}</SectionLabel>
            <SectionTitle>{t("自助工具，价格低于代运营", "Self-serve, priced below agencies")}</SectionTitle>
            <SectionLead>{t("下列价目以新台币计；Pro 另有季付 NT$9,900／季（约 NT$3,300／月）。", "Prices in TWD; Pro is also NT$9,900 per quarter (~NT$3,300/mo).")}</SectionLead>
            <Link href={lpath("/pricing/")} className="mt-6 inline-flex text-sm font-semibold text-zinc-950 hover:underline">{t("看完整方案", "Full pricing")} →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {teaser.map((p) => (
              <div key={p.code} className={`relative rounded-2xl border bg-white p-6 ${p.featured ? "border-zinc-950 shadow-lg shadow-zinc-900/5" : "border-zinc-200"}`}>
                {p.featured ? <span className="absolute -top-2.5 right-5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">{t("推荐", "Popular")}</span> : null}
                <h3 className="font-semibold text-zinc-950">{t(p.nameZh, p.nameEn)}</h3>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {t(p.priceZh, p.priceEn)}
                  <span className="ml-1 text-sm font-normal text-zinc-500">{t(p.periodZh, p.periodEn)}</span>
                </p>
                <p className="mt-2 text-sm text-zinc-600">{t(p.blurbZh, p.blurbEn)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-24 pt-0 sm:pt-0">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 text-center sm:p-14">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">{t("准备让品牌被点名？", "Ready to get named?")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-600">
            {t(
              "先做一次免费 AI 能见度健检，看看 DeepSeek 等 AI 现在怎么回答你的品类。免费、不绑约。",
              "Start with a free AI visibility check to see how DeepSeek and other AI answer questions in your category. Free, no commitment.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={lpath("/demo/")} className={btnPrimary}>
              {t("免费 AI 能见度健检", "Free AI visibility check")}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href={lpath("/demo/#demo")} className={btnGhost}>
              {t("申请试用／远程演示", "Request a trial / remote demo")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
