import type { Metadata } from "next";
import { Terms, termsMeta } from "@/views/pages";

export const metadata: Metadata = termsMeta("zh-hant");

export default function Page() {
  return <Terms />;
}
