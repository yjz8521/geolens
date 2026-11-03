import type { Metadata } from "next";
import { Contact, contactMeta } from "@/views/pages";

export const metadata: Metadata = contactMeta("en");

export default function Page() {
  return <Contact />;
}
