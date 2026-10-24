import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Kontakt oss",
  description:
    "Spørsmål om profilen, match eller reisen? Skriv til support@tosom.no eller ring 92 64 22 23.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt oss",
    description:
      "Spørsmål om profilen, match eller reisen? Skriv til support@tosom.no eller ring 92 64 22 23.",
    url: "/kontakt",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
