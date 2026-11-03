import type { Metadata } from "next";
import { guides, guideLocales } from "@/content/geo";
import { GuideArticle, guideMeta } from "@/views/pages";

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.filter((g) => guideLocales(g).includes("en")).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return guideMeta("en", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuideArticle l="en" slug={slug} />;
}
