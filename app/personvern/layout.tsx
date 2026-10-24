import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Personvern",
  description:
    "Slik behandler vi personopplysningene dine: hva vi samler inn, hvorfor, hvor lenge vi beholder det og hvilke rettigheter du har.",
  alternates: { canonical: "/personvern" },
  openGraph: {
    title: "Personvern",
    description:
      "Slik behandler vi personopplysningene dine: hva vi samler inn, hvorfor, hvor lenge vi beholder det og hvilke rettigheter du har.",
    url: "/personvern",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
