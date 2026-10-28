'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ResonanceLogo } from '@/components/branding/LogoVariants';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import GoldPulseIcon from '@/components/ui/feedback/GoldPulseIcon';

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

function IconPhotos() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

/* ========================
   STEG-DATA
   ======================== */

const steps: Array<{
  icon: React.ReactNode;
  title: string;
  intro: React.ReactNode;
  points: string[];
  closing?: string;
}> = [
  {
    icon: <IconProfile />,
    title: 'Veiledet profil',
    intro: (
      <>
        Du starter med en guidet profil som hjelper deg å forstå hvem du er, hva du
        trenger og hva som kan passe deg i en relasjon. ({' '}
        <Link
          href="/metoder"
          className="underline decoration-[rgba(212,175,55,0.35)] decoration-1 underline-offset-4 hover:decoration-[#D4AF37] transition-all duration-300"
          style={{ color: color.brand.gold }}
        >
          se hva vi bygger på
        </Link>{' '}
        )
      </>
    ),
    points: [
      'spørsmål vi har laget for Tosom',
      'om livssituasjon, verdier og hva som betyr noe for deg',
      'tar tid — ingen tidspress',
    ],
  },
  {
    icon: <IconMatch />,
    title: 'Én match om gangen',
    intro: 'Når profilen din er klar, blir du med i neste matchrunde. Natt til lørdag forsøker vi å finne én person som passer deg godt — og hvis ingen gjør det, venter du til neste runde. Ikke ti matcher. Ikke hundre. Én person om gangen, valgt med omtanke — ut fra verdier, livsstil, kommunikasjon og fremtidsønsker.',
    points: [
      'én match om gangen',
      'ingen sveiping',
      'ingen konkurranse',
      'fokus og ro',
    ],
    closing: 'Du blir med i køen når profilen er klar. Kobler vi ingen god nok, venter du til neste runde.',
  },
  {
    icon: <IconJourney />,
    title: 'En guidet 14-dagersreise',
    intro: 'Når dere matcher, får dere en guidet 14-dagersreise. Hver dag får dere ett fokus — et spørsmål, et tema eller en liten oppgave — og samtalen ligger der hele veien.',
    points: [
      'små oppgaver dere kan velge',
      'fokus på trygghet og kommunikasjon',
      'tid til å bli kjent',
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
            Slik fungerer Tosom
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
              lineHeight: '1.8',
            }}
          >
            Tosom er en datingtjeneste bygget for ekte relasjoner. Du blir kjent med én person om gangen. Her er helheten — fra profil til dag 14.
          </p>

          {/* Standard ToSom-logo — rett under innledningen */}
          <ResonanceLogo className="mt-10" />
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
                  <GoldPulseIcon size={56} className="flex-shrink-0">
                    {step.icon}
                  </GoldPulseIcon>
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
                {step.closing && (
                  <p
                    className="pt-4"
                    style={{
                      ...typographyToStyle('body'),
                      color: color.brand.gold,
                      lineHeight: '1.7',
                      letterSpacing: '0.1px',
                    }}
                  >
                    {step.closing}
                  </p>
                )}
              </GlassCard>
            ))}
            {/* ===== BILDER EFTER 14 DAGER (highlight) ===== */}
            <div className="md:col-span-2 mt-6">
              <div className="mx-auto max-w-3xl">
                <GlassCard padding="xl" gold glow className="text-center space-y-5">
                  <div className="flex justify-center">
                    <GoldPulseIcon size={56}>
                      <IconPhotos />
                    </GoldPulseIcon>
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-md'),
                      color: color.brand.gold,
                    }}
                  >
                    Muligheten for bilder åpnes på dag 8
                  </h3>
                  <p
                    className="mx-auto max-w-xl"
                    style={{
                      ...typographyToStyle('body-lg'),
                      color: color.text.secondary,
                      lineHeight: '1.8',
                    }}
                  >
                    Den første uken er uten bilder, slik at samtalen får komme først. Fra dag 8 åpnes muligheten til å sende bilder til hverandre. Hver av dere bestemmer selv om, og når, dere vil sende.
                  </p>
                  <div className="mx-auto max-w-md grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {['Den første uken uten bilder', 'fokus på personen og meningen', 'muligheten åpnes på dag 8', 'du bestemmer selv om og når'].map((point, pIdx) => (
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
              </div>
            </div>
          </div>
        </ToSomSection>

        {/* ===== MOTPOL-Lenke (ACT MOTPOL, D1) ===== */}
        <section className="px-6 pb-4 pt-2 text-center">
          <p
            style={{
              ...typographyToStyle('body'),
              color: 'rgba(255,255,255,0.65)',
              lineHeight: '1.7',
            }}
          >
            Hvorfor er det slik?{' '}
            <Link
              href="/motpol"
              className="underline decoration-[rgba(212,175,55,0.35)] decoration-1 underline-offset-4 hover:decoration-[#D4AF37] transition-all duration-300"
              style={{ color: color.brand.gold }}
            >
              Les motpolen vår
            </Link>
          </p>
        </section>

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
            Lag profilen din. Neste matcherunde er natt til lørdag.
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