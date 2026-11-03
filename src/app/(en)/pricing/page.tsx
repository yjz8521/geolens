import type { Metadata } from "next";
import { Pricing, pricingMeta } from "@/views/pages";

export const metadata: Metadata = pricingMeta("en");

export default function Page() {
  return <Pricing />;
}
