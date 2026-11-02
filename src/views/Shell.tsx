import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Providers } from "@/components/Providers";
import { LOCALE_META, alternates, lp, tr, type Locale } from "@/lib/locales";
import { draftPlans, getDemoEmail, getSiteUrl, siteConfig } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = getSiteUrl();

const DESC = "GeoLens：面向华语市场的 GEO SaaS。自动监测目前已接入 {LIVE}；{COMING_CN}与海外 {COMING_GLOBAL} 陆续接入中。实体卡 → 投放包 → 发布 → 提及监测。";
const APP_DESC = "生成式引擎优化（GEO）工作台：实体卡、引擎投放包、渠道发布与提及监测。自动监测已接入 {LIVE}；{COMING_CN}及海外 {COMING_GLOBAL} 陆续接入中（海外专属投放包路线图）。";

export function rootMetadata(l: Locale): Metadata {
  const title = `${tr(l, siteConfig.name)} · ${tr(l, siteConfig.taglineZh, siteConfig.taglineEn)}`;
  const tagline = tr(l, siteConfig.taglineZh, siteConfig.taglineEn);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${tr(l, siteConfig.name)}` },
    description: tr(l, DESC),
    keywords: ["GEO", "Generative Engine Optimization", "GeoLens", "DeepSeek", tr(l, "豆包", "Doubao"), tr(l, "通义千问", "Qwen"), "ChatGPT", "Perplexity"],
    authors: [{ name: siteConfig.owner }],
    openGraph: { type: "website", locale: LOCALE_META[l].og, url: lp(l, "/"), siteName: tr(l, siteConfig.name), title, description: tagline, images: [{ url: "/og.png", width: 1200, height: 630, alt: "GeoLens" }] },
    twitter: { card: "summary_large_image", title: tr(l, siteConfig.name), description: tagline, images: ["/og.png"] },
    robots: { index: true, follow: true },
    alternates: alternates(l, "/"),
  };
}

function ld(l: Locale) {
  const orgId = `${siteUrl}/#org`;
  const inLanguage = LOCALE_META[l].hreflang;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": orgId, name: siteConfig.name, alternateName: [siteConfig.legacyName], url: siteUrl, logo: `${siteUrl}/logo.png`, email: getDemoEmail(), founder: { "@type": "Person", name: siteConfig.owner }, areaServed: ["TW", "MY", "SG", "JP", "KR", "Worldwide"] },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteConfig.name, url: siteUrl, inLanguage: ["zh-Hant", "zh-Hans", "en"], publisher: { "@id": orgId } },
      { "@type": "WebPage", "@id": `${siteUrl}${lp(l, "/")}#webpage`, url: `${siteUrl}${lp(l, "/")}`, inLanguage, isPartOf: { "@id": `${siteUrl}/#website` } },
      {
        "@type": "SoftwareApplication",
        name: tr(l, siteConfig.productFull),
        alternateName: siteConfig.nameEn,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage,
        description: tr(l, APP_DESC),
        publisher: { "@id": orgId },
        offers: [
          ...draftPlans.filter((p) => p.code !== "enterprise").map((p) => {
            const price = p.priceZh.replace(/[^0-9]/g, "") || "0";
            return { "@type": "Offer", name: p.nameEn, price, priceCurrency: "TWD", url: `${siteUrl}${lp(l, "/pricing/")}`, ...(p.code === "free" ? {} : { priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "TWD", billingDuration: "P1M" } }) };
          }),
          { "@type": "Offer", name: "Pro (quarterly)", price: "9900", priceCurrency: "TWD", url: `${siteUrl}${lp(l, "/pricing/")}`, priceSpecification: { "@type": "UnitPriceSpecification", price: "9900", priceCurrency: "TWD", billingDuration: "P3M" } },
        ],
      },
    ],
  };
}

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={LOCALE_META[locale].html}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={ld(locale)} />
        <Providers locale={locale}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
