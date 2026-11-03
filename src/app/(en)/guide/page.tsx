import type { Metadata } from "next";
import { GuideIndex, guideIndexMeta } from "@/views/pages";

export const metadata: Metadata = guideIndexMeta("en");

export default function Page() {
  return <GuideIndex l="en" />;
}
