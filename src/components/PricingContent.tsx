"use client";

import Link from "next/link";
import { PageHero, Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { CHECKOUT_PRO_QUARTERLY, PAYMENTS_LIVE, draftPlans, checkoutLinks, getDemoEmail } from "@/lib/site";

export function PricingContent() {
  const { t, p: lpath } = useI18n();
  const email = getDemoEmail();
  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    t("GeoLens 方案咨询", "GeoLens plan inquiry"),
  )}&body=${encodeURIComponent(
    t(
      "您好，我想了解GeoLens 方案。\n公司／品牌：\n团队规模：\n想监测的引擎／品类：\n",
      "Hi, I'd like to learn about GeoLens plans.\nCompany / brand:\nTeam size:\nEngines / category to monitor:\n",
    ),
  )}`;

  return (
    <>
    <PageHero
      label={t("方案", "Pricing")}
      title={t("方案与价格：Free / Starter / Pro / Enterprise", "Plans & pricing: Free / Starter / Pro / Enterprise")}
      lead={t(
        "Starter / Pro 支持信用卡与 PayPal 订阅（新台币计价，Pro 另有季付）。Enterprise 与发票需求请来信联系。",
        "Starter / Pro subscriptions via card or PayPal (billed in TWD; Pro also billed quarterly). For Enterprise or invoicing, contact us.",
      )}
    >
      {PAYMENTS_LIVE ? null : (
        <p className="mt-6 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          {t(
            "线上付款通道正在审核开通中，暂时可能无法完成刷卡。想现在开通，请点「联系开通」来信，我们会人工报价并开通。",
            "Online checkout is pending approval and may not accept cards yet. To start now, use “contact to activate” and we will set you up manually.",
          )}{" "}
          <a href={mailto} className="underline underline-offset-4 hover:text-zinc-950">{email}</a>
        </p>
      )}
    </PageHero>
    <Section className="pt-12 pb-0 sm:pt-14 sm:pb-0">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{t("服务内容", "Services")}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          [t("AI 能见度健检", "AI visibility audit"), t("用固定问法检查各 AI 引擎是否提到你的品牌、提到哪些竞争对手。", "Check whether AI engines mention your brand, and which competitors they recommend, using a fixed prompt set.")],
          [t("品牌实体卡", "Brand entity card"), t("整理统一、可核对的品牌事实，让 AI 正确理解你。", "A consistent, verifiable set of brand facts so AI engines describe you accurately.")],
          [t("引擎内容包", "Engine content packs"), t("针对 ChatGPT、Perplexity、Gemini 等引擎改写与发布内容。", "Content adapted and published for ChatGPT, Perplexity, Gemini and other engines.")],
          [t("提及监测与报告", "Mention monitoring & reports"), t("持续追踪提及、排序与引用来源，按周报告。", "Ongoing tracking of mentions, position and cited sources, with weekly reports.")],
        ].map(([h, d]) => (
          <div key={h} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="font-semibold text-zinc-950">{h}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
          </div>
        ))}
      </div>
    </Section>
    <Section className="pt-12 sm:pt-14">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-950">{t("方案与价格", "Plans")}</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {draftPlans.map((p) => {
          const paid = p.code === "starter" || p.code === "pro";
          const href = paid
            ? checkoutLinks[p.code as "starter" | "pro"]
            : p.code === "enterprise"
              ? mailto
              : lpath("/demo/");
          const ctaLabel = paid
            ? t("信用卡／PayPal 订阅", "Subscribe (card / PayPal)")
            : p.code === "enterprise"
              ? t("联系销售", "Contact sales")
              : t("申请试用", "Request demo");

          const className = `mt-6 block rounded-full py-2.5 text-center text-sm font-semibold transition ${
            p.featured
              ? "bg-zinc-950 text-white hover:bg-zinc-800"
              : "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100"
          }`;

          return (
            <div
              key={p.code}
              className={`flex flex-col rounded-2xl border p-6 ${
                p.featured
                  ? "border-zinc-950 bg-white shadow-sm"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-950">
                  {t(p.nameZh, p.nameEn)}
                </h3>
                {p.featured ? (
                  <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {t("推荐", "Popular")}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                {t(p.priceZh, p.priceEn)}
                <span className="text-sm font-normal text-zinc-500">
                  {t(p.periodZh, p.periodEn)}
                </span>
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                {t(p.blurbZh, p.blurbEn)}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-zinc-600">
                {t(p.highlightsZh, p.highlightsEn).map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-950" />
                    {h}
                  </li>
                ))}
              </ul>
              {href.startsWith("/") ? (
                <Link href={href} className={className}>
                  {ctaLabel}
                </Link>
              ) : (
                <a href={href} className={className} rel="noopener noreferrer">
                  {ctaLabel}
                </a>
              )}
              {p.code === "pro" ? (
                <a href={CHECKOUT_PRO_QUARTERLY} rel="noopener noreferrer" className="mt-2 block rounded-full border border-zinc-300 py-2 text-center text-xs text-zinc-950 hover:bg-zinc-100">
                  {t("季付 NT$9,900／季（约 NT$3,300／月，省 15%）", "Quarterly NT$9,900 (~NT$3,300/mo, save 15%)")}
                </a>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-zinc-400">
        {t(
          "订阅可随时取消。付款后我们会邮件联系你，人工协助开通工作台。Enterprise 与发票需求请来信 kinnv@geolens.uk。",
          "Cancel anytime. After payment we email you and set up your workspace with you. For Enterprise or invoices, email kinnv@geolens.uk.",
        )}
      </p>
    </Section>
    </>
  );
}
