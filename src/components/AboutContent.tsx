"use client";

import Link from "next/link";
import { PageHero, Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { getDemoEmail } from "@/lib/site";

export function AboutContent() {
  const { t, p: lpath } = useI18n();
  const email = getDemoEmail();
  const facts: [string, string, string][] = [
    ["公司", "Company", "GeoLens"],
    ["产业", "Industry", t("软件／SaaS：生成式引擎优化（GEO）", "Software / SaaS — Generative Engine Optimization (GEO)")],
    ["创办人", "Founder", "YuHao Hsu"],
    ["所在地", "Headquarters", t("台湾", "Taiwan")],
    ["网站", "Website", "https://geolens.uk"],
    ["联系", "Contact", email],
  ];
  return (
    <>
      <PageHero
        label={t("关于我们", "About us")}
        title={t("GeoLens：让 AI 推荐你的品牌", "GeoLens helps brands get cited by AI")}
        lead={t(
          "GeoLens 是位于台湾的生成式引擎优化（GEO）SaaS，帮助品牌在 ChatGPT、Perplexity、Gemini、豆包、DeepSeek 等 AI 回答中被准确提及、引用与推荐。",
          "GeoLens is a Generative Engine Optimization (GEO) SaaS based in Taiwan. We help brands get accurately mentioned, cited and recommended in AI answers from ChatGPT, Perplexity, Gemini, Doubao, DeepSeek and other engines.",
        )}
      />
      <Section className="pt-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8 text-zinc-600">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">{t("我们在解决什么问题", "The problem we solve")}</h2>
              <p className="mt-3 leading-relaxed">{t(
                "越来越多的人直接问 AI「推荐哪个品牌」，而不是点开搜索结果。如果 AI 不了解你的品牌，或引用了过时、错误的资料，你就会在这个新入口里缺席。",
                "More and more people ask an AI assistant which product or company to choose instead of clicking through search results. If AI engines don't know your brand, or cite outdated or inaccurate information, you are missing from this new channel.",
              )}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">{t("我们怎么做", "How GeoLens works")}</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
                <li>{t("实体卡：整理统一、可核对的品牌事实。", "Entity card — one consistent, verifiable set of brand facts.")}</li>
                <li>{t("引擎投放包：按不同 AI 引擎改写内容。", "Engine content packs — content adapted for each AI engine.")}</li>
                <li>{t("渠道发布：发布到 AI 会读取的公开来源。", "Publishing — placing content on public sources that AI engines read.")}</li>
                <li>{t("提及监测：用固定问法追踪品牌是否被提及与引用。", "Mention monitoring — fixed prompts that track whether and how your brand is cited.")}</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">{t("创办人", "Founder")}</h2>
              <p className="mt-3 leading-relaxed">{t(
                "YuHao Hsu，毕业于实践大学国际经营与贸易学系，每天实际使用 ChatGPT、Claude、Gemini、DeepSeek 等 AI 工具，创办 GeoLens 以帮助中小企业在 AI 搜索时代被看见。",
                "YuHao Hsu studied International Business and Trade at Shih Chien University. A daily user of ChatGPT, Claude, Gemini, DeepSeek and other AI tools, he founded GeoLens to help small and mid-sized businesses stay visible as search moves to AI answers.",
              )}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">{t("我们的原则", "Our principles")}</h2>
              <p className="mt-3 leading-relaxed">{t(
                "只使用真实、可核对的资料；不保证排名或见效时间；不操纵 AI 系统。",
                "We only work with accurate, verifiable information. We never guarantee rankings or timelines, and we do not attempt to manipulate AI systems.",
              )}</p>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{t("公司资料", "Company facts")}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {facts.map(([zh, en, v]) => (
                <div key={en}>
                  <dt className="text-zinc-400">{t(zh, en)}</dt>
                  <dd className="break-all font-medium text-zinc-900">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={lpath("/contact/")} className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white">{t("联系我们", "Contact us")}</Link>
          <Link href={lpath("/pricing/")} className="rounded-full border border-zinc-200 px-5 py-2 text-sm text-zinc-700">{t("服务与方案", "Services & pricing")}</Link>
        </div>
      </Section>
    </>
  );
}
