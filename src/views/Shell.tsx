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

const DESC = "GeoLens：为新加坡、马来西亚、台湾与海外华语企业和贸易商做的双语 GEO。用中文和英文追踪 ChatGPT、Gemini、DeepSeek 等 AI 是否推荐你；自动监测目前已接入 {LIVE}。";
const APP_DESC = "生成式引擎优化（GEO）工作台：实体卡、引擎投放包、渠道发布与中英文提及监测。自动监测已接入 {LIVE}；{COMING_GLOBAL}、{COMING_CN} 陆续接入中。";

export function rootMetadata(l: Locale): Metadata {
  const title = `${tr(l, siteConfig.name)} · ${tr(l, siteConfig.taglineZh, siteConfig.taglineEn)}`;
  const tagline = tr(l, siteConfig.taglineZh, siteConfig.taglineEn);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${tr(l, siteConfig.name)}` },
    description: tr(l, DESC),
    keywords: ["GEO", "Generative Engine Optimization", "AI visibility", "GeoLens", "ChatGPT", "Gemini", "DeepSeek", "Perplexity", "Singapore", "Malaysia", "Taiwan"],
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
      { "@type": "Organization", "@id": orgId, name: siteConfig.name, url: siteUrl, logo: `${siteUrl}/logo.png`, email: getDemoEmail(), founder: { "@type": "Person", name: siteConfig.owner }, areaServed: ["SG", "MY", "TW", "HK", "CN", "Worldwide"], knowsLanguage: ["en", "zh-Hans", "zh-Hant"], contactPoint: { "@type": "ContactPoint", contactType: "sales", email: getDemoEmail(), availableLanguage: ["English", "Chinese"] } },
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
            return { "@type": "Offer", name: p.nameEn, price, priceCurrency: "USD", url: `${siteUrl}${lp(l, "/pricing/")}`, ...(p.code === "free" ? {} : { priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "USD", billingDuration: "P1M" } }) };
          }),
          { "@type": "Offer", name: "Pro (quarterly)", price: "299", priceCurrency: "USD", url: `${siteUrl}${lp(l, "/pricing/")}`, priceSpecification: { "@type": "UnitPriceSpecification", price: "299", priceCurrency: "USD", billingDuration: "P3M" } },
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
