import type { Metadata } from "next";
import { Home, homeMeta } from "@/views/pages";

export const metadata: Metadata = homeMeta("en");

export default function Page() {
  return <Home />;
}
