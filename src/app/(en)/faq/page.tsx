import type { Metadata } from "next";
import { Faq, faqMeta } from "@/views/pages";

export const metadata: Metadata = faqMeta("en");

export default function Page() {
  return <Faq l="en" />;
}
