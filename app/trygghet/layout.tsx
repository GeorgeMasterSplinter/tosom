import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Trygghet",
  description:
    "Slik vi holder plattformen trygg: aldersgrense 21+, private samtaler, verktøy for å melde fra, og et team som følger med.",
  alternates: { canonical: "/trygghet" },
  openGraph: {
    title: "Trygghet",
    description:
      "Slik vi holder plattformen trygg: aldersgrense 21+, private samtaler, verktøy for å melde fra, og et team som følger med.",
    url: "/trygghet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
