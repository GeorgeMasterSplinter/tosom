import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
// ACT MOTPOL (D3/D5): indexable, canonical = https://www.tosom.no/motpol (metadataBase i root).
// Ingen matchgaranti, ingen research claims, ingen betalingscopy (MOT-04/08/09).
// OG-image: ingen side-spesifikt bilde (D7 — P2-follow-up). Root-layoutens
// /og-image.png gjelder som default.
export const metadata: Metadata = {
  title: "Motpol – et annet svar på moderne dating | Tosom",
  description:
    "Tosom forsøker en annen vei: én match om gangen, samtalen før bildet, et mer privat rom. Ikke mer dating — mindre støy.",
  alternates: { canonical: "/motpol" },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Motpol – et annet svar på moderne dating",
    description:
      "Tosom forsøker en annen vei: én match om gangen, samtalen før bildet, et mer privat rom. Ikke mer dating — mindre støy.",
    url: "/motpol",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
