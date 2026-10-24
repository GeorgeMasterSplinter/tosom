import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Om Tosom",
  description:
    "Tosom AS er et selskap i Oslo. Her finner du mer om hvem vi er, hva vi står for og hvordan du kan kontakte oss.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om Tosom",
    description:
      "Tosom AS er et selskap i Oslo. Her finner du mer om hvem vi er, hva vi står for og hvordan du kan kontakte oss.",
    url: "/om-oss",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
