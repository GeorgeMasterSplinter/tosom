import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Priser",
  description:
    "De første 5 000 reisene er gratis. Deretter koster én reise 349 kroner — se hva som er inkludert.",
  alternates: { canonical: "/priser" },
  openGraph: {
    title: "Priser",
    description:
      "De første 5 000 reisene er gratis. Deretter koster én reise 349 kroner — se hva som er inkludert.",
    url: "/priser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
