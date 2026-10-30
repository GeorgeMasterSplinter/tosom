import type { Metadata } from "next";
import { MIN_AGE } from "@/config/legal";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
const BESKRIVELSE = `Slik vi holder plattformen trygg: aldersgrense ${MIN_AGE}+, private samtaler, verktøy for å melde fra, og et team som følger med.`;
export const metadata: Metadata = {
  title: "Trygghet",
  description: BESKRIVELSE,
  alternates: { canonical: "/trygghet" },
  openGraph: {
    title: "Trygghet",
    description: BESKRIVELSE,
    url: "/trygghet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
