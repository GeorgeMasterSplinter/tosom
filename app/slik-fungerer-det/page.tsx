'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconJourney() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconRoom() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

/* ========================
   STEG-DATA
   ======================== */

const steps = [
  {
    icon: <IconProfile />,
    title: 'Veiledet profil',
    intro: 'Du starter med en forskningsbasert og guidet profil som hjelper deg å forstå hvem du er, hva du trenger og hva som faktisk passer deg i en relasjon.',
    points: [
      'basert på relasjonspsykologi',
      'hjelper deg å forstå dine behov',
      'gir et helhetlig bilde av hvem du er',
      'ingen stress, ingen tidspress',
    ],
  },
  {
    icon: <IconMatch />,
    title: 'Én match innen 24 timer',
    intro: 'Når profilen din er klar, får du én gjennomtenkt match. Ikke ti. Ikke hundre. Bare én person som faktisk passer deg basert på verdier, livsstil, kommunikasjon og fremtidsønsker.',
    points: [
      'én match om gangen',
      'ingen sveiping',
      'ingen konkurranse',
      'fokus og ro',
    ],
  },
  {
    icon: <IconJourney />,
    title: 'En guidet 30 dagers reise',
    intro: 'Når dere matcher, får dere en rolig 30 dagers reise med små, trygge steg som hjelper dere å bli kjent på en naturlig måte. Ingen press. Ingen forventninger. Bare en struktur som gjør det lettere å åpne seg.',
    points: [
      'daglige små oppgaver',
      'fokus på trygghet og kommunikasjon',
      'bygger emosjonell tilstedeværelse',
      'ingen hastverk',
    ],
  },
  {
    icon: <IconRoom />,
    title: 'Trygg kommunikasjon',
    intro: 'All kommunikasjon skjer i et privat rom mellom dere to. Ingen kan se profilen din. Ingen kan søke deg opp. Du bestemmer selv når du vil dele mer personlig informasjon.',
    points: [
      'privat rom',
      'ingen offentlige profiler',
      'ingen eksponering',
      'du styrer tempoet',
    ],
  },
];

/* ========================
   PAGE COMPONENT
   ======================== */

export default function SlikPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — blue */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6 text-center space-y-6"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Slik fungerer ToSom
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
              lineHeight: '1.8',
            }}
          >
            En rolig og trygg prosess som hjelper deg å møte én person som faktisk passer deg. Ingen stress. Ingen sveiping. Bare hvalitet.
          </p>
        </ToSomSection>

        {/* ===== 4 STEG ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <GlassCard key={idx} padding="xl" gold interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {step.icon}
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-md'),
                      color: color.brand.gold,
                    }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  {step.intro}
                </p>
                <div className="space-y-2">
                  {step.points.map((point, pIdx) => (
                    <p
                      key={pIdx}
                      style={{
                        ...typographyToStyle('body'),
                        color: color.text.secondary,
                        lineHeight: '1.6',
                      }}
                    >
                      <span className="text-[#D4AF37] mr-2">✦</span>
                      {point}
                    </p>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </ToSomSection>

        {/* ===== CTA ===== */}
        <ToSomSection
          spotlight="cta"
          className="px-6 text-center space-y-6"
        >
          <h2
            style={{
              ...typographyToStyle('heading-lg'),
              color: color.text.primary,
            }}
          >
            Klar til å starte?
          </h2>

          <p
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg — på ordentlig.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <ToSomButton href="/register" variant="gold" size="xl">
              Start reisen
            </ToSomButton>

            <ToSomButton href="/login" variant="secondary" size="lg">
              Logg inn
            </ToSomButton>
          </div>
        </ToSomSection>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}