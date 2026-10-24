import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
// /reisen/avslutning er privat og har egen noindex-layout (TC-11).
export const metadata: Metadata = {
  title: "Reisen",
  description:
    "Den guiderte 30-dagers reisen: fire faser, daglige temaer og samtaler som bygger tillit i eget tempo.",
  alternates: { canonical: "/reisen" },
  openGraph: {
    title: "Reisen",
    description:
      "Den guiderte 30-dagers reisen: fire faser, daglige temaer og samtaler som bygger tillit i eget tempo.",
    url: "/reisen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
