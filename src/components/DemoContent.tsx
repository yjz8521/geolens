"use client";

import { useState, type FormEvent } from "react";
import { PageHero, Section, SectionLabel, SectionLead, SectionTitle } from "./Section";
import { useI18n } from "@/lib/i18n";
import { FORMSPREE_ENDPOINT, checkDeliveryDays, contactIds, getAppUrl, getDemoEmail } from "@/lib/site";

const includes = [
  {
    zh: "实体卡填写与就绪校验演示",
    en: "Entity card setup + readiness check walkthrough",
  },
  {
    zh: "至少一家引擎投放包生成预览",
    en: "Preview pack generation for at least one engine",
  },
  {
    zh: "监测问法与提及率矩阵说明",
    en: "Monitor prompts and mention-rate matrix overview",
  },
  {
    zh: "方案配额对照（free → enterprise）",
    en: "Plan quota walkthrough (free → enterprise)",
  },
];

const provide = [
  { zh: "公司／品牌名称", en: "Company / brand name" },
  { zh: "网站", en: "Website" },
  { zh: "产业", en: "Industry" },
  { zh: "主要产品或服务", en: "Main products or services" },
  { zh: "主要市场（台湾／亚太／全球）", en: "Main market (Taiwan / Asia-Pacific / global)" },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
    >
      {ok ? done : label}
    </button>
  );
}

type Field = { name: string; label: string; required?: boolean; type?: string; multiline?: boolean };

/** Online form via Formspree. `_gotcha` is Formspree's honeypot; bots that fill it are dropped silently. */
function FormspreeForm({ endpoint, title, subject, fields, submit, fallback }: { endpoint: string; title: string; subject: string; fields: Field[]; submit: string; fallback: string }) {
  const { t, locale } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const input = "mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950";
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(e.currentTarget), headers: { Accept: "application/json" } });
      setState(res.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }
  if (state === "ok") {
    return <p role="status" className="rounded-2xl border border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-950">{t("已收到申请，我们会尽快用 Email 联系你。", "Thanks — we got your request and will reply by email soon.")}</p>;
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5 sm:p-7">
      <p className="text-base font-semibold text-zinc-950">{title}</p>
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {fields.map((f) => (
        <label key={f.name} className="block text-sm text-zinc-600">
          {f.label}
          {f.multiline ? (
            <textarea name={f.name} required={f.required} rows={4} className={input} />
          ) : (
            <input name={f.name} required={f.required} type={f.type ?? "text"} className={input} />
          )}
        </label>
      ))}
      <button type="submit" disabled={state === "sending"} className="w-full rounded-full bg-zinc-950 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60">
        {state === "sending" ? t("送出中…", "Sending…") : submit}
      </button>
      {state === "err" ? (
        <p role="alert" className="text-xs text-red-700">
          {t("送出失败，请改用下方邮件或联系方式。", "Something went wrong. Please use email or the contacts below.")}{" "}
          <a href={fallback} className="underline underline-offset-4">{t("改用邮件申请", "Apply by email instead")}</a>
        </p>
      ) : null}
    </form>
  );
}

function HealthCheck() {
  const { t, locale } = useI18n();
  const email = getDemoEmail();
  const zh = locale.startsWith("zh");
  const days = checkDeliveryDays;
  const contacts = [
    { k: "Email", v: email },
    ...(contactIds.line ? [{ k: "LINE ID", v: contactIds.line }] : []),
    ...(contactIds.wechat ? [{ k: t("微信 ID", "WeChat ID"), v: contactIds.wechat }] : []),
  ];
  const [f, setF] = useState({ company: "", website: "", industry: "", product: "", market: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = t("免费 AI 能见度健检申请", "Free AI visibility check request") + (f.company ? ` · ${f.company}` : "");
    const na = t("（未填）", "(not provided)");
    const body = zh
      ? `${t("公司／品牌名称", "Company / brand name")}：${f.company}\n${t("网站", "Website")}：${f.website || na}\n${t("产业", "Industry")}：${f.industry || na}\n${t("主要产品或服务", "Main products or services")}：${f.product || na}\n${t("主要市场（台湾／亚太／全球）", "Main market (Taiwan / Asia-Pacific / global)")}：${f.market || na}`
      : `Company / brand: ${f.company}\nWebsite: ${f.website || na}\nIndustry: ${f.industry || na}\nMain products or services: ${f.product || na}\nMain market (Taiwan / Asia-Pacific / global): ${f.market || na}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const input = "mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950";
  const steps = [
    { h: t("填写资料", "Send your details"), body: <ul className="mt-2 space-y-1 text-sm text-zinc-600">{provide.map((x) => <li key={x.en}>· {t(x.zh, x.en)}</li>)}</ul> },
    {
      h: t("我们实际去问 AI", "We ask the AI"),
      body: <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t(
        "用 10 个固定问法去问 DeepSeek（自动），其他 AI（豆包、ChatGPT 等）由人工查询记录，整理成一份报告：有没有提到你、提到哪些竞争对手、建议先补哪些公开资料。",
        "We ask DeepSeek 10 fixed questions (automated) and check other AI (Doubao, ChatGPT and more) manually, then send you a report: whether you are mentioned, which competitors are mentioned, and which public information to add first.",
      )}</p>,
    },
    {
      h: `${t("收到报告", "Get the report")} · ${t("交付时间：约 ", "Delivery: within about ")}${days}${t(" 个工作天内", " business days")}`,
      body: <ul className="mt-2 grid gap-1.5 text-sm text-zinc-600 sm:grid-cols-2">{[t("有没有提到你、排第几", "Whether you are named, and where"), t("提到了哪些竞争对手", "Which competitors are named"), t("描述有没有讲错", "Whether the description is accurate"), t("建议先补哪些公开资料", "Which public information to add first")].map((x) => <li key={x} className="flex gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{x}</li>)}</ul>,
    },
  ];
  return (
    <>
      <PageHero
        label={t("免费健检", "Free check")}
        title={t("免费 AI 能见度健检", "Free AI visibility check")}
        lead={t(
          "看看 DeepSeek 等 AI 现在回答你的品类时，有没有提到你。免费、不绑约；不保证排名或见效时间。",
          "See whether DeepSeek and other AI mention you when answering questions in your category. Free, no commitment; no guarantee of rankings or timing.",
        )}
      >
        <ul className="mt-6 flex flex-wrap gap-2 text-sm">
          {[`${t("交付时间：约 ", "Delivery: within about ")}${days}${t(" 个工作天内", " business days")}`, t("免费、不绑约", "Free, no commitment"), t("不保证排名或见效时间", "No guarantee of rankings or timing")].map((x) => (
            <li key={x} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-zinc-700 shadow-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              {x}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section className="pt-12 sm:pt-14">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          <ol className="relative space-y-6 lg:col-start-1 lg:row-start-1 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <span aria-hidden className="absolute bottom-12 left-[2.65rem] top-12 w-px bg-blue-100 sm:left-[3.15rem]" />
              {steps.map((st, i) => (
                <li key={i} className="relative flex gap-4">
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/30">{i + 1}</span>
                  <div className="min-w-0 pt-1">
                    <h2 className="font-semibold text-zinc-950">{st.h}</h2>
                    {st.body}
                  </div>
                </li>
              ))}
            </ol>

          <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            {FORMSPREE_ENDPOINT ? (
              <FormspreeForm
                endpoint={FORMSPREE_ENDPOINT}
                title={t("在线申请健检", "Apply online")}
                subject={t("免费 AI 能见度健检申请", "Free AI visibility check request")}
                fields={[
                  { name: "brand", label: t("公司／品牌名称", "Company / brand name"), required: true },
                  { name: "website", label: t("网站", "Website") },
                  { name: "industry", label: t("产业", "Industry") },
                  { name: "product", label: t("主要产品或服务", "Main products or services") },
                  { name: "market", label: t("主要市场（台湾／亚太／全球）", "Main market (Taiwan / Asia-Pacific / global)") },
                  { name: "email", label: "Email", required: true, type: "email" },
                ]}
                submit={t("送出申请", "Submit")}
                fallback={`mailto:${email}?subject=${encodeURIComponent(t("免费 AI 能见度健检申请", "Free AI visibility check request"))}`}
              />
            ) : (
              <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5">
                <p className="text-sm font-medium text-zinc-950">{t("或用邮件申请（会打开你的邮件程序）", "Or apply by email (opens your mail app)")}</p>
                <label className="block text-sm text-zinc-600">{t("公司／品牌名称", "Company / brand name")}<input required value={f.company} onChange={set("company")} className={input} /></label>
                <label className="block text-sm text-zinc-600">{t("网站", "Website")}<input value={f.website} onChange={set("website")} className={input} /></label>
                <label className="block text-sm text-zinc-600">{t("产业", "Industry")}<input value={f.industry} onChange={set("industry")} className={input} /></label>
                <label className="block text-sm text-zinc-600">{t("主要产品或服务", "Main products or services")}<input value={f.product} onChange={set("product")} className={input} /></label>
                <label className="block text-sm text-zinc-600">{t("主要市场（台湾／亚太／全球）", "Main market (Taiwan / Asia-Pacific / global)")}<input value={f.market} onChange={set("market")} className={input} /></label>
                <button type="submit" className="w-full rounded-full bg-zinc-950 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                  {t("用邮件申请健检", "Apply by email")}
                </button>
              </form>
            )}
          </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 lg:col-start-1">
              <h2 className="font-semibold text-zinc-950">{t("联系方式", "Contact")}</h2>
              <p className="mt-1 text-sm text-zinc-500">{t("把上面的资料传给我们即可申请。", "Send us the details above to apply.")}</p>
              <ul className="mt-4 grid gap-3">
                {contacts.map((c) => (
                  <li key={c.k} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                    <span className="min-w-0 text-sm">
                      <span className="block text-xs text-zinc-500">{c.k}</span>
                      <span className="block break-all font-medium text-zinc-950">{c.v}</span>
                    </span>
                    <CopyButton value={c.v} label={t("复制", "Copy")} done={t("已复制", "Copied")} />
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </Section>
    </>
  );
}

export function DemoContent() {
  const { t, locale } = useI18n();
  const email = getDemoEmail();
  const appUrl = getAppUrl();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const trialSubject = t("GeoLens 试用申请", "GeoLens demo request");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = trialSubject;
    const body =
      locale.startsWith("zh")
        ? `${t("姓名 / 称呼", "Name")}：${name}\n${t("公司 / 品牌", "Company / brand")}：${company || t("（未填）", "(not provided)")}\n${t("联系方式（微信／电话，选填）", "Other contact (optional)")}：${contact || t("（未填）", "(not provided)")}\n${t("需求", "Notes")}：\n${note || t("（未填）", "(not provided)")}`
        : `Name: ${name}\nCompany / brand: ${company || "(not provided)"}\nOther contact (optional): ${contact || "(not provided)"}\nNotes:\n${note || "(not provided)"}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject + (company ? ` · ${company}` : ""))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
    <HealthCheck />
    <div className="border-t border-zinc-200 bg-zinc-50">
    <Section id="demo">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
      <SectionLabel>{t("试用", "Demo")}</SectionLabel>
      <SectionTitle>
        {t("申请试用：演示包含什么", "Request a demo: what it includes")}
      </SectionTitle>
      <SectionLead>
        {t(
          "远程演示约 30–45 分钟。产品工作台目前采邀请制，演示或订阅后由我们为你开通账号；现在请用下方表单或邮件预约。",
          "Remote walkthrough ~30–45 minutes. The workspace is invite-only for now — we open your account after the demo or subscription. Book with the form below or by email.",
        )}
      </SectionLead>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {includes.map((item) => (
          <li
            key={item.en}
            className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            {t(item.zh, item.en)}
          </li>
        ))}
      </ul>

      {appUrl ? (
        <p className="mt-6 text-sm text-zinc-950">
          <a href={appUrl} className="underline-offset-4 hover:underline" rel="noopener noreferrer">
            {t("打开产品 App", "Open product app")} →
          </a>
        </p>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">
          {t(
            "目前还没有公开的自助注册入口；收到申请后我们会邮件回复，约定演示时间。",
            "There is no public self-signup yet; we will reply by email to schedule the demo.",
          )}
        </p>
      )}

      </div>
      {FORMSPREE_ENDPOINT ? (
        <div>
          <FormspreeForm
            endpoint={FORMSPREE_ENDPOINT}
            title={t("在线预约演示", "Book a demo online")}
            subject={trialSubject}
            fields={[
              { name: "name", label: t("称呼", "Name"), required: true },
              { name: "email", label: "Email", required: true, type: "email" },
              { name: "company", label: t("公司 / 品牌", "Company / brand") },
              { name: "contact", label: t("微信／电话（选填）", "WeChat / phone (optional)") },
              { name: "note", label: t("想看什么", "What you want to see"), multiline: true },
            ]}
            submit={t("送出预约", "Send request")}
            fallback={`mailto:${email}?subject=${encodeURIComponent(trialSubject)}`}
          />
          <p className="mt-3 text-center text-xs text-zinc-400">
            <a href={`mailto:${email}?subject=${encodeURIComponent(trialSubject)}`} className="hover:text-zinc-950">
              {t("或直接写信", "Or email directly")}: {email}
            </a>
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5"
        >
          <p className="text-sm font-medium text-zinc-950">
            {t("填写后会打开你的邮件程序，按「发送」即完成申请", "Opens your mail app — press Send to submit")}
          </p>
          <label className="block text-sm text-zinc-600">
            {t("称呼", "Name")}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950"
            />
          </label>
          <label className="block text-sm text-zinc-600">
            {t("公司 / 品牌", "Company / brand")}
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950"
            />
          </label>
          <label className="block text-sm text-zinc-600">
            {t("微信／电话（选填）", "WeChat / phone (optional)")}
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950"
            />
          </label>
          <label className="block text-sm text-zinc-600">
            {t("想看什么", "What you want to see")}
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-800 outline-none focus:border-zinc-950"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-950 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {t("发送至", "Send to")} {email}
          </button>
          {sent ? (
            <p role="status" className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-950">
              {t("若邮件程序没有自动打开，请直接写信到 ", "If your mail app did not open, email ")}
              {email}
              {t("，并附上上面填写的内容。", " directly with the details above.")}
            </p>
          ) : null}
          <p className="text-center text-xs text-zinc-400">
            <a href={`mailto:${email}?subject=${encodeURIComponent(trialSubject)}`} className="hover:text-zinc-950">
              {t("或直接写信", "Or email directly")}: {email}
            </a>
          </p>
        </form>
      )}
      </div>
    </Section>
    </div>
    </>
  );
}
