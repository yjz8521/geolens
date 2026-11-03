"use client";

import { PageHero, Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { getDemoEmail } from "@/lib/site";

export function ContactContent() {
  const { t } = useI18n();
  const email = getDemoEmail();
  const rows: [string, string][] = [
    [t("一般与销售咨询", "Sales & general inquiries"), email],
    [t("客户支持", "Customer support"), email],
    [t("隐私与资料请求", "Privacy & data requests"), email],
  ];
  return (
    <>
      <PageHero
        label={t("联系", "Contact")}
        title={t("联系 GeoLens", "Contact GeoLens")}
        lead={t("欢迎来信洽询方案、合作或支持，我们通常在 1–2 个工作天内回复。", "Questions about plans, partnerships or support? Email us — we usually reply within 1–2 business days.")}
      />
      <Section className="pt-12 sm:pt-14">
        <div className="grid gap-5 md:grid-cols-3">
          {rows.map(([h, v]) => (
            <div key={h} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-sm text-zinc-500">{h}</p>
              <a href={`mailto:${v}`} className="mt-2 block break-all text-lg font-semibold text-zinc-950 hover:underline">{v}</a>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm leading-relaxed text-zinc-600">
          <p className="font-semibold text-zinc-950">GeoLens</p>
          <p>{t("创办人：YuHao Hsu", "Founder: YuHao Hsu")}</p>
          <p>{t("所在地：台湾（服务新加坡、马来西亚与海外华语市场）", "Based in Taiwan, serving Singapore, Malaysia and Chinese-speaking markets worldwide")}</p>
          <p>{t("网站：", "Website: ")}https://geolens.uk</p>
          <p>{t("营业时间：周一至周五 09:00–18:00（UTC+8，与新加坡、马来西亚同一时区）", "Hours: Mon–Fri 09:00–18:00 UTC+8 (same time zone as Singapore and Malaysia)")}</p>
        </div>
      </Section>
    </>
  );
}
