"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { PREFIXED } from "@/lib/locales";

const links = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/pricing/", zh: "方案", en: "Pricing" },
  { href: "/guide/", zh: "指南", en: "Guide (Chinese)" },
  { href: "/faq/", zh: "FAQ", en: "FAQ" },
  { href: "/demo/", zh: "免费健检", en: "Free check" },
  { href: "/about/", zh: "关于", en: "About" },
  { href: "/contact/", zh: "联系", en: "Contact" },
];

/** usePathname() has no basePath; normalise trailing slash and treat /guide/* as Guide. */
function isActive(pathname: string | null, href: string) {
  let p = (pathname || "/").replace(/\/?$/, "/");
  for (const l of PREFIXED) if (p === `/${l}/` || p.startsWith(`/${l}/`)) { p = p.slice(l.length + 1); break; }
  if (href === "/") return p === "/";
  return p === href || p.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const { t, p: lpath } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={lpath("/")} className="group flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-tight text-zinc-950 sm:text-base">
            {t(siteConfig.name, siteConfig.nameEn)}
          </span>
        </Link>

        <nav aria-label={t("主导航", "Main navigation")} className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={lpath(l.href)}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-zinc-100 text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {t(l.zh, l.en)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleToggle />
          <Link
            href={lpath("/demo/")}
            className="whitespace-nowrap rounded-full bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:text-sm"
          >
            <span className="sm:hidden">{t("免费健检", "Free check")}</span>
            <span className="hidden sm:inline">{t("免费 AI 能见度健检", "Free AI visibility check")}</span>
          </Link>
        </div>
      </div>

      <nav aria-label={t("主导航（手机）", "Main navigation (mobile)")} className="flex gap-1 overflow-x-auto border-t border-zinc-200 px-4 py-2 md:hidden">
        {links.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={lpath(l.href)}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                active
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {t(l.zh, l.en)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
