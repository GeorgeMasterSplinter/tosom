'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

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
            ToSom er bygd for trygghet og modenhet. Vi bruker Vipps både til innlogging og betaling — så du vet at alle på plattformen er ekte.
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
            <GlassCard padding="xl" className="space-y-5">
              <h2
                style={{
                  ...typographyToStyle('heading-lg'),
                  color: color.text.primary,
                  textAlign: 'center',
                }}
              >
                Hvorfor Vipps Login og Vipps betaling?
              </h2>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                  textAlign: 'center',
                }}
              >
                ToSom er bygd for voksne mennesker som ønsker en trygg, rolig og ekte prosess. Derfor bruker vi Vipps både til innlogging og betaling.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Verifisert identitet — ingen fake profiler',
                  'Ekte fødselsdato — trygg alderskontroll',
                  'Ingen duplikat-brukere — én person, én profil',
                  'Norsk sikkerhetsstandard — trygg betalingsflyt',
                  'Ingen skjulte gebyrer — én pris, ingen stress',
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
                Vipps gjør ToSom til en trygg plattform for voksne mennesker som ønsker en ekte reise.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== PRISBLOKK ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
          style={{
            paddingTop: spacing['3xl'],
            paddingBottom: spacing['3xl'],
          }}
        >
          <div className="mx-auto max-w-xl space-y-8 text-center">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Én pris. Alt inkludert.
            </h2>

            <GlassCard
              padding="xl"
              className="space-y-6"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.25)',
                boxShadow: '0 0 40px rgba(212,175,55,0.15)',
              }}
            >
              <div
                style={{
                  ...typographyToStyle('heading-xl'),
                  color: color.brand.gold,
                }}
              >
                349 kr
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                ToSom — full tilgang. Betales én gang og dekker hele reisen.
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
              Betal med Vipps og få tilgang til hele ToSom — inkludert match, guidet reise og privat rom.
            </p>

            {/* Hoved-CTA: Betal med Vipps */}
            <ToSomButton
              href="/api/payment/vipps"
              variant="gold"
              size="xl"
            >
              Betal med Vipps — 349 kr
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
                Betalingsløsning er under utvikling. ToSom er i begrenset testfase.
              </p>
              <p
                style={{
                  ...typographyToStyle('body-sm'),
                  color: color.text.secondary,
                  lineHeight: '1.7',
                }}
              >
                Når betaling er godkjent, blir du sendt til første steg i onboarding for å lage profilen din.
              </p>
            </div>
          </div>

          {/* Allerede registrert — sekundær */}
          <div className="pt-4">
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
