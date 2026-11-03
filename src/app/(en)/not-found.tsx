import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found · 404",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-zinc-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-950">Page not found</h1>
      <p className="mt-3 text-zinc-600">The link may have changed. Try one of these pages instead. 中文版：<Link href="/zh-hant/" className="underline">繁體</Link> · <Link href="/zh-hans/" className="underline">简体</Link></p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/" className="rounded-full bg-zinc-950 px-5 py-2 font-semibold text-white">Home</Link>
        <Link href="/pricing/" className="rounded-full border border-zinc-200 px-5 py-2 text-zinc-700 hover:bg-zinc-100">Pricing</Link>
        <Link href="/guide/" className="rounded-full border border-zinc-200 px-5 py-2 text-zinc-700 hover:bg-zinc-100">Guides</Link>
        <Link href="/demo/" className="rounded-full border border-zinc-200 px-5 py-2 text-zinc-700 hover:bg-zinc-100">Free AI visibility check</Link>
      </div>
    </div>
  );
}
