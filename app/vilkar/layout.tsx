import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
// Kanonisk sti er /vilkar (ASCII); /vilkår 301-redirect-er hit via middleware.
export const metadata: Metadata = {
  title: "Vilkår for bruk",
  description:
    "Vilkårene for å bruke Tosom: reisen, betaling og refusjon, personvern, opphavsrett og hva som gjelder mens reisen er gratis.",
  alternates: { canonical: "/vilkar" },
  openGraph: {
    title: "Vilkår for bruk",
    description:
      "Vilkårene for å bruke Tosom: reisen, betaling og refusjon, personvern, opphavsrett og hva som gjelder mens reisen er gratis.",
    url: "/vilkar",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
