'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function RegisterPage() {
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
        className="absolute top-40 left-1/4 w-[500px] h-[300px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(80,120,255,0.06), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <ToSomSection
          spotlight="hero"
          className="px-6 text-center space-y-6"
          style={{
            paddingTop: spacing['4xl'],
            paddingBottom: spacing['4xl'],
          }}
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Registrer din profil
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
              lineHeight: '1.8',
            }}
          >
            Tosom er bygd for trygghet og modenhet. Vi bruker Vipps til innlogging — så du vet at alle på plattformen er ekte.
          </p>
        </ToSomSection>

        {/* ===== HVORFOR VIPPS ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
          style={{
            paddingTop: spacing['3xl'],
            paddingBottom: spacing['3xl'],
          }}
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <GlassCard padding="xl" gold interactive className="space-y-5">
              <h2
                style={{
                  ...typographyToStyle('heading-lg'),
                  color: color.text.primary,
                  textAlign: 'center',
                }}
              >
                Hvorfor Vipps-innlogging?
              </h2>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                  textAlign: 'center',
                }}
              >
                Tosom er bygd for voksne mennesker som ønsker en trygg, rolig og ekte prosess. Derfor bruker vi Vipps til innlogging.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Verifisert identitet — ingen fake profiler',
                  'Ekte fødselsdato — trygg alderskontroll',
                  'Ingen duplikat-brukere — én person, én profil',
                  'Norsk sikkerhetsstandard — trygg innlogging',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]"
                      style={{ marginTop: '2px' }}
                    >
                      <IconCheck />
                    </div>
                    <span
                      style={{
                        ...typographyToStyle('body'),
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: '1.6',
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                Vipps gjør Tosom til en trygg plattform for voksne mennesker som ønsker en ekte reise.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== BETAL MED VIPPS ===== */}
        <ToSomSection
          spotlight="cta"
          className="px-6 text-center space-y-8"
          style={{
            paddingTop: spacing['3xl'],
            paddingBottom: spacing['4xl'],
          }}
        >
          <div className="mx-auto max-w-md space-y-6">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Klar til å starte reisen?
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Logg inn med Vipps og få tilgang til hele Tosom — inkludert kobling, guidet reise og privat rom. Gratis i lukket beta.
            </p>

            {/* Hoved-CTA: Logg inn med Vipps */}
            <ToSomButton
              href="/api/auth/vipps"
              variant="gold"
              size="xl"
            >
              Logg inn med Vipps
            </ToSomButton>


            {/* informasjon om betaling */}
            <div
              className="space-y-3 pt-2"
              style={{
                background: 'rgba(212,175,55,0.04)',
                border: '1px solid rgba(212,175,55,0.12)',
                borderRadius: `${radius.lg}px`,
                padding: `${spacing.lg}px`,
              }}
            >
              <p
                style={{
                  ...typographyToStyle('body-sm'),
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: '1.7',
                }}
              >
                Betalingsløsning er under utvikling. Tosom er i begrenset testfase.
              </p>
              <p
                style={{
                  ...typographyToStyle('body-sm'),
                  color: color.text.secondary,
                  lineHeight: '1.7',
                }}
              >
                Når innloggingen er godkjent, blir du sendt til første steg i onboarding for å lage profilen din.

              </p>
            </div>
          </div>

          {/* Allerede registrert — sekundær */}
          <div className="flex flex-col items-center pt-4">
            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.secondary,
                marginBottom: spacing.md,
              }}
            >
              Allerede registrert?
            </p>
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
