import type { Metadata } from "next";
import { PRICING } from "@/config/legal";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
// Prisen og gratiskvoten leses fra den kanoniske kilde (config/legal.ts PRICING),
// slik at meta-teksten kan aldri avvike fra koden.
export const metadata: Metadata = {
  title: "Priser",
  description:
    `De ${PRICING.freeUserCap.toLocaleString("nb-NO")} første personene får bruke Tosom gratis. Senere er planen ${PRICING.journeyPrice} kr for én 14-dagersreise — se hva som er inkludert.`,
  alternates: { canonical: "/priser" },
  openGraph: {
    title: "Priser",
    description:
      `De ${PRICING.freeUserCap.toLocaleString("nb-NO")} første personene får bruke Tosom gratis. Senere er planen ${PRICING.journeyPrice} kr for én 14-dagersreise — se hva som er inkludert.`,
    url: "/priser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
