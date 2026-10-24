import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Slik fungerer Tosom",
  description:
    "Fra profil til reise: hvordan profilen din brukes, hvordan matcherunden forsøker å koble deg natt til lørdag, og hva som skjer dersom ingen passer godt nok.",
  alternates: { canonical: "/slik-fungerer-det" },
  openGraph: {
    title: "Slik fungerer Tosom",
    description:
      "Fra profil til reise: hvordan profilen din brukes, hvordan matcherunden forsøker å koble deg natt til lørdag, og hva som skjer dersom ingen passer godt nok.",
    url: "/slik-fungerer-det",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
