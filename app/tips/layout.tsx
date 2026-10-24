import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Tips for reisen",
  description:
    "Slik får du mest ut av reisen: fra hvordan du svarer på spørsmålene til hvordan du bruker dagene sammen.",
  alternates: { canonical: "/tips" },
  openGraph: {
    title: "Tips for reisen",
    description:
      "Slik får du mest ut av reisen: fra hvordan du svarer på spørsmålene til hvordan du bruker dagene sammen.",
    url: "/tips",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
