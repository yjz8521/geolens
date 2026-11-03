import type { Metadata } from "next";
import { Privacy, privacyMeta } from "@/views/pages";

export const metadata: Metadata = privacyMeta("en");

export default function Page() {
  return <Privacy />;
}
