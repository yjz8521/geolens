"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LOCALES, LOCALE_META, PREFIXED, lp, type Locale } from "@/lib/locales";

/** Strip the locale prefix from the current path. */
function basePath(pathname: string | null) {
  let p = (pathname || "/").replace(/\/?$/, "/");
  for (const l of PREFIXED) if (p === `/${l}/` || p.startsWith(`/${l}/`)) { p = p.slice(l.length + 1); break; }
  return p || "/";
}

/** Guide articles exist either in English or in Chinese (both scripts); crossing that line lands on the guide index. */
function target(l: Locale, base: string, current: Locale) {
  const article = base.startsWith("/guide/") && base !== "/guide/";
  if (article && (l === "en") !== (current === "en")) return lp(l, "/guide/");
  return lp(l, base);
}

export function LocaleToggle() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const base = basePath(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 sm:text-sm"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></svg>
        <span className="hidden sm:inline">{LOCALE_META[locale].label}</span>
        <svg aria-hidden viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor"><path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-lg">
          {LOCALES.map((l) => (
            <li key={l} role="none">
              <a
                role="menuitem"
                href={target(l, base, locale)}
                hrefLang={LOCALE_META[l].hreflang}
                lang={LOCALE_META[l].html}
                aria-current={l === locale ? "true" : undefined}
                className={`flex items-center justify-between px-4 py-2 hover:bg-zinc-50 ${l === locale ? "font-semibold text-zinc-950" : "text-zinc-600"}`}
              >
                {LOCALE_META[l].label}
                {l === locale && <span aria-hidden>✓</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
