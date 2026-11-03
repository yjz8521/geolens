import { ContactContent } from "@/components/ContactContent";
import { LegalContent } from "@/components/LegalContent";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutContent } from "@/components/AboutContent";
import { DemoContent } from "@/components/DemoContent";
import { HomeContent } from "@/components/HomeContent";
import { JsonLd } from "@/components/JsonLd";
import { PricingContent } from "@/components/PricingContent";
import { PageHero } from "@/components/Section";
import { faqs, guideLocales, guides } from "@/content/geo";
import { LOCALE_META, alternates, lp, tr, type Locale } from "@/lib/locales";
import { getSiteUrl, pageMeta, siteConfig } from "@/lib/site";

/** Where a guide is read from locale `l`: its own locale if it exists there, else the guide's first locale. */
const guideHome = (l: Locale, g: (typeof guides)[number]): Locale => (guideLocales(g).includes(l) ? l : guideLocales(g)[0]);
const byDate = [...guides].sort((a, b) => b.date.localeCompare(a.date));

export const homeMeta = (l: Locale): Metadata => ({ alternates: alternates(l, "/") });
const guideCards = byDate.map(({ slug, title, description, date, lang }) => ({ slug, title, description, date, lang }));
export const Home = () => <HomeContent guides={guideCards} />;

export const pricingMeta = (l: Locale): Metadata => pageMeta(l, "/pricing/", "方案与价格 Pricing", "GeoLens 价格：Free US$0；Starter US$59／月；Pro US$119／月或季付 US$299／季；Enterprise 洽谈。可用信用卡／PayPal 订阅。");
export const Pricing = () => <PricingContent />;

export const aboutMeta = (l: Locale): Metadata => pageMeta(l, "/about/", "关于 About", "GeoLens 是一家位于台湾的生成式引擎优化（GEO）SaaS 公司，服务新加坡、马来西亚、台湾与海外的华语企业和贸易商，帮助它们被 ChatGPT、Gemini、DeepSeek 等 AI 用中英文引用与推荐。创办人 YuHao Hsu。");
export const About = () => <AboutContent />;

export const demoMeta = (l: Locale): Metadata => pageMeta(l, "/demo/", "免费 AI 能见度健检", "免费 AI 能见度健检：用 10 个固定问法中英文各问一次，{LIVE} 自动跑问、其他 AI 人工查询，整理成中英对照报告：有没有提到你、提到哪些竞争对手、建议先补哪些公开资料。免费、不绑约，不保证排名或见效时间。也可申请试用／远程演示。");
export const Demo = () => <DemoContent />;

export const faqMeta = (l: Locale): Metadata => pageMeta(l, "/faq/", "常见问题 FAQ：什么是 GEO、和 SEO 差别、价格", "GeoLens 常见问题：什么是 GEO、与 SEO 差别、支持哪些 AI 引擎（ChatGPT、Gemini、DeepSeek 等）、中英文怎么监测、价格与适用对象。");
export function Faq({ l }: { l: Locale }) {
  const items = faqs.map((f) => ({ q: tr(l, f.q), a: tr(l, f.a) }));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: LOCALE_META[l].hreflang, mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <PageHero label="FAQ" title={tr(l, "GeoLens 常见问题")} lead={tr(l, "关于生成式引擎优化（GEO）与GeoLens 的直接回答。")} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-3">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-2xl border border-zinc-200 bg-white px-5 py-4 open:shadow-sm sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-zinc-950 [&::-webkit-details-marker]:hidden">
                <h2>{f.q}</h2>
                <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-zinc-600">{tr(l, "延伸阅读：")}<Link href={lp(l, "/guide/")} className="font-medium text-zinc-950 hover:underline">{tr(l, "GEO 指南")}</Link> · <Link href={lp(l, "/pricing/")} className="font-medium text-zinc-950 hover:underline">{tr(l, "方案价格")}</Link></p>
      </div>
    </>
  );
}

export const guideIndexMeta = (l: Locale): Metadata => pageMeta(l, "/guide/", "GEO 指南：生成式引擎优化入门", "GeoLens 指南：GEO 入门、实体卡写法、如何用中英文检测 ChatGPT、Gemini、DeepSeek 等 AI 是否提到你的品牌，以及贸易、代工、电商、餐饮的做法。");
export function GuideIndex({ l }: { l: Locale }) {
  // Guides in the reader's language first, then the rest (tagged with their language).
  const list = [...byDate.filter((g) => guideLocales(g).includes(l)), ...byDate.filter((g) => !guideLocales(g).includes(l))];
  return (
    <>
      <PageHero label={tr(l, "GEO 指南")} title={tr(l, "免费学会自己检测与优化")} lead={tr(l, "GeoLens 指南：GEO 入门、实体卡写法、如何用中英文检测 ChatGPT、Gemini、DeepSeek 等 AI 是否提到你的品牌，以及贸易、代工、电商、餐饮的做法。")} />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {list.map((g) => {
            const at = guideHome(l, g);
            const other = at !== l;
            return (
              <li key={g.slug}>
                <Link href={lp(at, `/guide/${g.slug}/`)} hrefLang={other ? LOCALE_META[at].hreflang : undefined} className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5">
                  <p className="text-xs text-zinc-400"><time dateTime={g.date}>{g.date}</time>{other && ` · ${at === "en" ? "English" : "中文"}`}</p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-zinc-950 group-hover:text-blue-600">{tr(l, g.title)}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{tr(l, g.description)}</p>
                  <span className="mt-4 text-sm font-medium text-blue-600">{tr(l, "阅读", "Read")} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export function guideMeta(l: Locale, slug: string): Metadata {
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  const path = `/guide/${g.slug}/`;
  const title = tr(l, g.title), description = tr(l, g.description);
  return { title, description, alternates: alternates(l, path, guideLocales(g)), openGraph: { type: "article", url: lp(l, path), siteName: tr(l, "GeoLens"), locale: LOCALE_META[l].og, title, description, publishedTime: g.date, images: [{ url: "/og.png", width: 1200, height: 630, alt: "GeoLens" }] }, twitter: { card: "summary_large_image", title, description, images: ["/og.png"] } };
}
export function GuideArticle({ l, slug }: { l: Locale; slug: string }) {
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const site = getSiteUrl();
  const url = `${site}${lp(l, `/guide/${g.slug}/`)}`;
  const title = tr(l, g.title), description = tr(l, g.description);
  const others = byDate.filter((x) => x.slug !== g.slug && guideLocales(x).includes(l));
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: title, description, inLanguage: LOCALE_META[l].hreflang, url, mainEntityOfPage: url, author: { "@type": "Person", name: siteConfig.owner, url: `${site}${lp(l, "/about/")}` }, publisher: { "@type": "Organization", "@id": `${site}/#org`, name: siteConfig.name, url: site }, datePublished: g.date, dateModified: g.date, image: `${site}/og.png` }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: tr(l, siteConfig.name), item: `${site}${lp(l, "/")}` },
        { "@type": "ListItem", position: 2, name: tr(l, "GEO 指南"), item: `${site}${lp(l, "/guide/")}` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ] }} />
      <p className="text-sm text-zinc-500"><Link href={lp(l, "/guide/")} className="hover:underline">{tr(l, "GEO 指南")}</Link></p>
      <h1 className="mt-2 text-3xl font-bold text-zinc-950">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500"><time dateTime={g.date}>{tr(l, "发布于")} {g.date}</time></p>
      <p className="mt-3 text-zinc-600">{description}</p>
      {g.sections.map((s) => (
        <section key={s.h} className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-950">{tr(l, s.h)}</h2>
          {s.p.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-zinc-600">{tr(l, p)}</p>)}
        </section>
      ))}
      <p className="mt-12 text-zinc-600">{tr(l, "GeoLens 把以上流程做成工作台：实体卡 → 引擎投放包 → 渠道发布 → 提及监测。")}<Link href={lp(l, "/faq/")} className="text-zinc-950 hover:underline">{tr(l, "常见问题")}</Link> · <Link href={lp(l, "/demo/")} className="text-zinc-950 hover:underline">{tr(l, "申请试用")}</Link></p>
      <aside className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <p className="font-semibold text-zinc-950">{tr(l, "不想自己测？申请免费 AI 能见度健检")}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{tr(l, "我们用固定问法、中英文各问一次 ChatGPT、Gemini、DeepSeek 等 AI，整理成报告：有没有提到你、提到哪些竞争对手、建议先补哪些公开资料。免费、不绑约。")}</p>
        <Link href={lp(l, "/demo/")} className="mt-4 inline-flex rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">{tr(l, "免费 AI 能见度健检")}</Link>
      </aside>
      <nav aria-label={tr(l, "其他指南")} className="mt-10 border-t border-zinc-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{tr(l, "其他指南")}</h2>
        <ul className="mt-4 space-y-3">
          {others.map((x) => (
            <li key={x.slug}>
              <Link href={lp(l, `/guide/${x.slug}/`)} className="font-medium text-zinc-950 hover:underline">{tr(l, x.title)}</Link>
              <p className="mt-0.5 text-sm text-zinc-500">{tr(l, x.description)}</p>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

export const contactMeta = (l: Locale): Metadata => pageMeta(l, "/contact/", "联系 Contact", "联系 GeoLens：kinnv@geolens.uk。");
export const Contact = () => <ContactContent />;
export const privacyMeta = (l: Locale): Metadata => pageMeta(l, "/privacy/", "隐私政策 Privacy Policy", "GeoLens 隐私政策。");
export const Privacy = () => <LegalContent kind="privacy" />;
export const termsMeta = (l: Locale): Metadata => pageMeta(l, "/terms/", "服务条款 Terms of Service", "GeoLens 服务条款。");
export const Terms = () => <LegalContent kind="terms" />;
