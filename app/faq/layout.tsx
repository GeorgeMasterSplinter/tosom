import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Ofte stilte spørsmål",
  description:
    "Svar på de vanligste spørsmålene om matching, reisen, personvern, pris og hva som skjer dersom ingen match finnes.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Ofte stilte spørsmål",
    description:
      "Svar på de vanligste spørsmålene om matching, reisen, personvern, pris og hva som skjer dersom ingen match finnes.",
    url: "/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
