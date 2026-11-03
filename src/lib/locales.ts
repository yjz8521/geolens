import hant from "@/i18n/zh-hant.json";
import enD from "@/i18n/en.json";
import { fillEngines } from "./engines";

export const LOCALES = ["zh-hant", "zh-hans", "en"] as const;
export type Locale = (typeof LOCALES)[number];
/** Served at the site root (no prefix). English first: SEA Chinese businesses and traders all read it. */
export const DEFAULT_LOCALE: Locale = "en";
export const PREFIXED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const LOCALE_META: Record<Locale, { label: string; html: string; og: string; hreflang: string }> = {
  "zh-hant": { label: "繁體中文", html: "zh-Hant-TW", og: "zh_TW", hreflang: "zh-Hant" },
  "zh-hans": { label: "简体中文", html: "zh-Hans", og: "zh_CN", hreflang: "zh-Hans" },
  en: { label: "English", html: "en", og: "en_US", hreflang: "en" },
};

const D: Record<string, Record<string, string>> = { "zh-hant": hant, en: enD };

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

/** Path prefix for a locale ("" for the default locale). */
export function prefix(l: Locale) {
  return l === DEFAULT_LOCALE ? "" : `/${l}`;
}
export function lp(l: Locale, path: string) {
  return `${prefix(l)}${path}`;
}

const missing = new Set<string>();
/** Translate a simplified-Chinese source string (with optional English source). Engine tokens are filled after lookup. */
export function tr(l: Locale, zh: string, en?: string): string {
  return fillEngines(l, lookup(l, zh, en));
}

function lookup(l: Locale, zh: string, en?: string): string {
  if (l === "zh-hans") return zh;
  const hit = D[l]?.[zh];
  if (hit) return hit;
  if (process.env.I18N_LOG_MISSING && /[\u4e00-\u9fff]/.test(zh) && !missing.has(l + zh)) {
    missing.add(l + zh);
    console.log("I18N_MISSING\t" + l + "\t" + JSON.stringify(zh) + "\t" + JSON.stringify(en ?? null));
  }
  if (l === "zh-hant") return zh;
  if (en !== undefined) return en;
  return D.en[zh] ?? zh;
}

export function trAny<T>(l: Locale, zh: T, en: T): T {
  if (Array.isArray(zh)) return zh.map((z, i) => tr(l, z as string, (en as unknown as string[])?.[i])) as T;
  if (typeof zh === "string") return tr(l, zh, en as unknown as string) as T;
  return (l === "zh-hans" || l === "zh-hant" ? zh : en) as T;
}

/** hreflang alternates for a path; `only` restricts to locales that have the page. */
export function alternates(l: Locale, path: string, only: readonly Locale[] = LOCALES) {
  const languages: Record<string, string> = {};
  for (const x of only) languages[LOCALE_META[x].hreflang] = lp(x, path);
  languages["x-default"] = lp(only.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : only[0], path);
  return { canonical: lp(l, path), languages };
}
