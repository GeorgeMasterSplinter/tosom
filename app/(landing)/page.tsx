"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SectionHero } from "@/components/sections/SectionHero";
import { SectionFeatures } from "@/components/sections/SectionFeatures";
import { SectionCTA } from "@/components/sections/SectionCTA";

/* ═══════════════════════════════════════════
   ToSom Premium — Landing Page
   Brukar Section-komponentar for struktur
   ═══════════════════════════════════════════ */

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-14.25L9 4.75 6.75 7.5 9 10.25m12 1.5l-2.25 2.25L15 9.75" />
      </svg>
    ),
    title: "Trygt og moderne",
    description: "Alle møter er gjennomtenkt og designet for å gi deg trygghet — både i design og i prosess.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.25 9 13.5 9 13.5s9-6.25 9-13.5z" />
      </svg>
    ),
    title: "Laget for ekte relasjoner",
    description: "Vi trur på kvalitet over kvantitet — match med meinin, ikkje hastverk.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Nordisk, rolig design",
    description: "Mørk, dempa og raffinert — design som kjenst som ei roleg kveld.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar links={[
        { label: "Hjem", href: "/" },
        { label: "Om ToSom", href: "/om" },
        { label: "Kom i gang", href: "/onboarding" },
        { label: "Logg inn", href: "/login" },
      ]} />

      {/* Hero */}
      <SectionHero
        badge="ToSom"
        title="En rolig plass
for ekte møter"
        subtitle="ToSom er bygd for deg som ønsker dypere forbindelse — en trygg, moden og rolig vei mot ekte relasjoner."
        ctaLabel="Kom i gang"
        ctaHref="/onboarding"
        ctaSecondaryLabel="Lær mer"
        ctaSecondaryHref="/om"
      />

      {/* Verdipunkter */}
      <SectionFeatures
        title="Hvorfor ToSom"
        subtitle="Kvalitet over kvantitet — det er grunnlaget vi bygger på."
        features={features}
        columns={3}
      />

      {/* CTA */}
      <SectionCTA
        title="Klar for å møte noen som passer deg?"
        subtitle="Ta det første steget — det tar bare noen minutter."
        ctaLabel="Start reisen"
        ctaHref="/onboarding"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
