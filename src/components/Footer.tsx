"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";
import { getDemoEmail, siteBasePath, siteConfig } from "@/lib/site";

export function Footer() {
  const { t, p: lpath } = useI18n();
  const email = getDemoEmail();
  const cols = [
    {
      h: t("产品", "Product"),
      links: [
        { href: lpath("/pricing/"), label: t("方案", "Pricing") },
        { href: lpath("/demo/"), label: t("免费健检", "Free check") },
        { href: lpath("/demo/#demo"), label: t("申请试用", "Request demo") },
      ],
    },
    {
      h: t("资源", "Resources"),
      links: [
        { href: lpath("/guide/"), label: t("GEO 指南", "Guide") },
        { href: lpath("/faq/"), label: "FAQ" },
        { href: `${siteBasePath}/llms.txt`, label: "llms.txt", raw: true },
      ],
    },
    {
      h: t("公司", "Company"),
      links: [
        { href: lpath("/about/"), label: t("关于我们", "About") },
        { href: lpath("/contact/"), label: t("联系我们", "Contact") },
        { href: lpath("/privacy/"), label: t("隐私政策", "Privacy Policy") },
        { href: lpath("/terms/"), label: t("服务条款", "Terms of Service") },
        { href: `mailto:${email}`, label: email, raw: true },
      ],
    },
  ];
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs space-y-3">
          <Link href={lpath("/")} className="inline-flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="font-semibold tracking-tight text-zinc-950">{t(siteConfig.name, siteConfig.nameEn)}</span>
          </Link>
          <p className="text-sm leading-relaxed text-zinc-500">{t(siteConfig.taglineZh, siteConfig.taglineEn)}</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{c.h}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  {l.raw ? (
                    <a href={l.href} className="break-all text-zinc-600 hover:text-zinc-950">{l.label}</a>
                  ) : (
                    <Link href={l.href} className="text-zinc-600 hover:text-zinc-950">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-200 py-5 text-center text-xs text-zinc-400">
        © 2026 GeoLens. {t("保留所有权利。", "All rights reserved.")} · {t("台湾", "Taiwan")}
      </div>
    </footer>
  );
}
