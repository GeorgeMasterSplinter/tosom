import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Hvorfor Tosom",
  description:
    "Hva som ligger bak Tosom: en rolig, privat plattform for voksne som ønsker en dypere vei mot ekte relasjoner — med ro, trygghet og én person om gangen.",
  alternates: { canonical: "/hvorfor" },
  openGraph: {
    title: "Hvorfor Tosom",
    description:
      "Hva som ligger bak Tosom: en rolig, privat plattform for voksne som ønsker en dypere vei mot ekte relasjoner — med ro, trygghet og én person om gangen.",
    url: "/hvorfor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
