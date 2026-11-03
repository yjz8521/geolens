import type { Metadata } from "next";
import { RootShell, rootMetadata } from "@/views/Shell";
import "../globals.css";

export const metadata: Metadata = rootMetadata("en");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
