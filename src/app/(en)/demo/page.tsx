import type { Metadata } from "next";
import { Demo, demoMeta } from "@/views/pages";

export const metadata: Metadata = demoMeta("en");

export default function Page() {
  return <Demo />;
}
