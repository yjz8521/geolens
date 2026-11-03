"use client";

import { PageHero, Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { getDemoEmail } from "@/lib/site";

type Doc = { titleZh: string; titleEn: string; sections: { h: string; p: string }[] };

const privacy = (email: string): Doc => ({
  titleZh: "隐私政策",
  titleEn: "Privacy Policy",
  sections: [
    { h: "Who we are", p: `GeoLens ("we", "us") operates https://geolens.uk and the GeoLens GEO software. GeoLens is based in Taiwan. Contact: ${email}.` },
    { h: "Information we collect", p: "Information you send us (such as your name, email address, company and website when you request a demo, contact us or subscribe); account and billing details processed by our payment provider; and basic technical data such as browser type and pages visited, collected through standard server logs and privacy-friendly analytics." },
    { h: "How we use information", p: "To provide and improve the service, respond to inquiries, run AI visibility checks you request, process payments, send service-related messages, and meet legal obligations. We do not sell your personal information." },
    { h: "Sharing and service providers", p: "We share data only with service providers that help us run GeoLens, under appropriate confidentiality terms, or when required by law. These currently include Cloudflare (website hosting and delivery), Formspree (website forms), Lemon Squeezy (payments, acting as merchant of record) and our email provider." },
    { h: "Where your data is processed", p: "GeoLens is operated from Taiwan and serves customers in Singapore, Malaysia, Taiwan and elsewhere. Your information may be processed in Taiwan and in the countries where our service providers operate, including the United States. When we transfer personal data across borders we take reasonable steps to ensure it stays protected to a comparable standard." },
    { h: "Applicable data protection laws", p: "We handle personal data in line with Taiwan's Personal Data Protection Act and, for customers and contacts in Singapore and Malaysia, the principles of Singapore's Personal Data Protection Act 2012 and Malaysia's Personal Data Protection Act 2010, including notice, consent, purpose limitation, access and correction." },
    { h: "Retention", p: "We keep personal information only as long as needed for the purposes above or as required by law, then delete or anonymize it." },
    { h: "Your rights", p: `You may request access to, correction of, or deletion of your personal information, or withdraw consent to marketing at any time, by emailing ${email}. We aim to respond within 30 days.` },
    { h: "Security", p: "We use reasonable technical and organizational measures to protect your information. No method of transmission over the internet is completely secure." },
    { h: "Changes", p: "We may update this policy from time to time. The latest version will always be posted on this page with its effective date." },
  ],
});

const terms = (email: string): Doc => ({
  titleZh: "服务条款",
  titleEn: "Terms of Service",
  sections: [
    { h: "Agreement", p: "By accessing geolens.uk or using GeoLens software and services (the \"Service\"), you agree to these Terms. The Service is offered to businesses, not to consumers. If you use the Service on behalf of a company, you confirm you are authorized to bind it." },
    { h: "The Service", p: "GeoLens provides tools and guidance for Generative Engine Optimization (GEO): organizing brand facts, preparing content for AI engines, and monitoring brand mentions in AI answers. We do not control third-party AI engines and do not guarantee any ranking, mention, citation or result." },
    { h: "Accounts and acceptable use", p: "You are responsible for your account and for the accuracy and lawfulness of content you submit. You may not use the Service to publish false or misleading information, infringe others' rights, or attempt to manipulate or abuse any third-party platform." },
    { h: "Plans, billing and cancellation", p: "Paid plans are billed in advance in US dollars on a monthly or quarterly basis as described on the Pricing page. Online payments are processed by Lemon Squeezy as merchant of record, which may add applicable sales tax such as GST or VAT. You may cancel at any time; cancellation takes effect at the end of the current billing period. Fees already paid are non-refundable except where required by law." },
    { h: "Intellectual property", p: "GeoLens retains all rights in the Service. You retain all rights in the content you provide and grant us a limited license to process it solely to provide the Service." },
    { h: "Disclaimer and limitation of liability", p: "The Service is provided \"as is\". To the maximum extent permitted by law, GeoLens is not liable for indirect or consequential damages, and our total liability is limited to the fees you paid in the 12 months before the claim." },
    { h: "Governing law", p: "These Terms are governed by the laws of Taiwan (R.O.C.)." },
    { h: "Contact", p: `Questions about these Terms: ${email}.` },
  ],
});

export function LegalContent({ kind }: { kind: "privacy" | "terms" }) {
  const { t } = useI18n();
  const email = getDemoEmail();
  const doc = kind === "privacy" ? privacy(email) : terms(email);
  return (
    <>
      <PageHero label={t("法律", "Legal")} title={t(doc.titleZh, doc.titleEn)} lead={t("生效日期：2026 年 11 月 3 日（以英文版本为准）", "Effective date: November 3, 2026")} />
      <Section className="pt-12 sm:pt-14">
        <div className="max-w-3xl space-y-7 text-zinc-600">
          {doc.sections.map((s, i) => (
            <div key={s.h}>
              <h2 className="text-lg font-semibold text-zinc-950">{i + 1}. {s.h}</h2>
              <p className="mt-2 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
