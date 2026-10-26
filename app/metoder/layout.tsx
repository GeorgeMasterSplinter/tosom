import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Metoder vi bruker",
  description:
    "Seks områder — verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon — og hva vi bruker svarene til.",
  alternates: { canonical: "/metoder" },
  openGraph: {
    title: "Metoder vi bruker",
    description:
      "Seks områder — verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon — og hva vi bruker svarene til.",
    url: "/metoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
