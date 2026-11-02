"use client";

import Link from "next/link";
import { PageHero, Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { getAppUrl, siteConfig } from "@/lib/site";

export function AboutContent() {
  const { t, p: lpath } = useI18n();
  const appUrl = getAppUrl();

  return (
    <>
    <PageHero
      label={t("关于", "About")}
      title={t(siteConfig.productFull, `${siteConfig.nameEn} Platform`)}
      lead={t(
        "帮助品牌在国内与海外生成式 AI（豆包、DeepSeek、ChatGPT、Perplexity 等）上被提及、被引用、被推荐的 GEO SaaS。",
        "A GEO SaaS that helps brands get mentioned, cited, and recommended in Chinese and global generative AI (Doubao, DeepSeek, ChatGPT, Perplexity, and more).",
      )}
    />
    <Section className="pt-12 sm:pt-14">
      <div className="max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {t("负责人", "Founder")}
        </h2>
        <p className="mt-3 text-2xl font-semibold text-zinc-950">
          {siteConfig.owner}
          <span className="ml-2 text-base font-normal text-zinc-500">{t("（团子）", "(Tuanzi)")}</span>
        </p>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-600">
          <li>{t("实践大学国际经营与贸易学系。", "Shih Chien University, Department of International Business and Trade.")}</li>
          <li>{t("家里的事业在大陆做 B2B 设备的销售与服务。", "The family business sells and services B2B equipment in mainland China.")}</li>
          <li>{t("每天实际使用 DeepSeek、豆包、ChatGPT、Claude 等 AI，熟悉两岸不同 AI 平台和繁体、简体的差异。", "Uses DeepSeek, Doubao, ChatGPT, Claude and other AI every day, and knows how AI platforms — and Traditional vs. Simplified Chinese — differ across the Taiwan Strait.")}</li>
        </ul>
        <h3 className="mt-6 text-base font-semibold text-zinc-950">{t("为什么做GeoLens", "Why GeoLens")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {t(
            "两岸的 AI 平台不一样，台湾品牌和台商常常只顾到其中一边。",
            "AI platforms differ between Taiwan and mainland China, and Taiwan brands and Taiwanese businesses often cover only one side.",
          )}
        </p>
      </div>

      {appUrl ? (
        <p className="mt-8 text-sm">
          <a href={appUrl} className="text-zinc-950 underline-offset-4 hover:underline" rel="noopener noreferrer">
            {t("已配置的产品入口", "Configured product entry")} →
          </a>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={lpath("/demo/")}
          className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white"
        >
          {t("免费 AI 能见度健检", "Free AI visibility check")}
        </Link>
        <Link
          href={lpath("/pricing/")}
          className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-700"
        >
          {t("方案", "Pricing")}
        </Link>
      </div>
    </Section>
    </>
  );
}
