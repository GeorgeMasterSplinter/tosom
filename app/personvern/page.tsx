'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconDatabase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconRights() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function IconCookie() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8l.01.01" />
      <path d="M12 8v2" />
      <path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="M14 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16,6 12,2 8,6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconStorage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12H2" />
      <path d="M5.458 8.36 12 12l6.542-3.64" />
      <path d="M17 16.54 12 12l-5 4.54" />
      <path d="M2 12h0" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

/* ========================
   HELPER — Ultra-Premium GlassCard
   ======================== */

function GlassCard({
  children,
  padding = 'lg',
  className = '',
  style,
}: {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}) {
  const paddingMap = { sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl };

  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: `${radius.xl}px`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
        padding: `${paddingMap[padding]}px`,
        transition: 'all 300ms ease-out',
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.25)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212,175,55,0.10)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.20)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

/* ========================
   PERSONVERN-INNHOLD
   ======================== */

const sections = [
  {
    icon: <IconShield />,
    title: 'Personvern',
    content: 'Personvern er en av våre kjerneverdier. Alt du deler i ToSom er kryptert, privat og behandlet med dyp respekt. Vi følger GDPR og norsk personvernlovgivning — og vi går lenger enn det som kreves.\n\nVi selger aldri data.\nVi deler aldri data.\nVi sporer aldri for markedsføring.\n\nToSom er bygget for trygghet, ikke overvåkning.',
  },
  {
    icon: <IconLock />,
    title: 'Hva vi gjør med dine data',
    content: 'Vi bruker data kun for én ting:\nÅ gi deg en trygg, rolig og meningsfull opplevelse.\n\nIngen annonser.\nIngen tredjeparts‑tracking.\nIngen profileringssystemer.',
  },
  {
    icon: <IconDatabase />,
    title: 'Hvilke data vi samler',
    content: 'Vi samler bare det som er nødvendig for at ToSom skal fungere:\n\n    e‑post\n    profilspørsmål\n    telefonnummer (valgfritt)\n    samtalehistorikk med din match\n    teknisk informasjon som er nødvendig for drift (session‑token, autentisering)\n\nVi samler ikke:\n\n    markedsføringsdata\n    tredjeparts‑tracking\n    skjult analyse\n    data som ikke er relevant for relasjoner',
  },
  {
    icon: <IconTarget />,
    title: 'Hvorfor vi samler data',
    content: 'Dataene brukes kun til:\n\n    å gi deg gode matcher\n    å sikre at plattformen fungerer stabilt\n    å beskytte deg mot misbruk\n    å gi deg en trygg opplevelse\n\nVi bruker aldri data til annonser eller salg.',
  },
  {
    icon: <IconStorage />,
    title: 'Hvor dataene lagres',
    content: 'Dataene dine lagres på sikre, krypterte servere innenfor EU/EØS.\nToSom er utviklet og driftet fra Norge av et lite, dedikert team.',
  },
  {
    icon: <IconRights />,
    title: 'Dine rettigheter',
    content: 'Du har rett til:\n\n    innsyn\n    endring\n    sletting\n    dataportabilitet\n\nKontakt oss på privat@tosom.no for å utøve dine rettigheter.',
  },
  {
    icon: <IconCookie />,
    title: 'Cookies og sporing',
    content: 'Vi bruker kun teknisk nødvendige cookies.\nIngen tredjeparts‑sporing.\nIngen profileringscookies.',
  },
  {
    icon: <IconShare />,
    title: 'Deling av data',
    content: 'Vi deler aldri dine personlige data med noen.\nDine svar, profiler og samtaler er krypterte og aldri synlige for andre brukere eller tredjeparter.',
  },
  {
    icon: <IconClock />,
    title: 'Oppbevaring av data',
    content: 'Data lagres så lenge kontoen din er aktiv.\nNår du sletter kontoen, slettes alle data innen 30 dager.\nTekniske reservedata kan beholdes i opptil 90 dager.',
  },
  {
    icon: <IconMail />,
    title: 'Spørsmål om personvern?',
    content: 'Kontakt oss på privat@tosom.no\nVi svarer vanligvis innen 24 timer.',
  },
];

/* ========================
   PAGE COMPONENT
   ======================== */

export default function PersonvernPage() {
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
            Personvern
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Trygghet, ro og full kontroll over dine data.
          </p>
        </ToSomSection>

        {/* ===== PERSONVERN-SEKSJONER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl space-y-6">
            {sections.map((sec, idx) => (
              <GlassCard key={idx} padding="xl" className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {sec.icon}
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      {sec.title}
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {sec.content}
                    </p>
                  </div>
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

            <ToSomButton href="/login" variant="dark" size="lg">
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