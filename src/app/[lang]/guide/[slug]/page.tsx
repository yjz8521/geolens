import type { Metadata } from "next";
import { guides, guideLocales } from "@/content/geo";
import { PREFIXED } from "@/lib/locales";
import type { Locale } from "@/lib/locales";
import { GuideArticle, guideMeta } from "@/views/pages";

export const dynamicParams = false;
export async function generateStaticParams() {
  return PREFIXED.flatMap((lang) => guides.filter((g) => guideLocales(g).includes(lang)).map((g) => ({ lang, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  return guideMeta(lang as Locale, slug);
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  return <GuideArticle l={lang as Locale} slug={slug} />;
}
