'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { Hero } from '@/components/ui/layout/Hero';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconWellbeing() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
      <path d="M12 8V12L14 14" />
    </svg>
  );
}

function IconPrivacy() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
      <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" />
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

function IconResearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H15" />
      <path d="M9 3V7C9 8.10457 9.89543 9 11 9H13" />
      <path d="M9 15L11 17L15 13" />
    </svg>
  );
}

function IconDepth() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
    </svg>
  );
}

/* ========================
   STEG-DATA — 5 KORT
   ======================== */

const steps = [
  {
    icon: <IconWellbeing />,
    title: 'Velvære først',
    content: 'Vi senker tempoet, ikke hvaliteten. Trygghet og emosjonell komfort kommer før alt annet.',
  },
  {
    icon: <IconPrivacy />,
    title: 'Privat profil',
    content: 'Profilen din er helt privat og aldri offentlig. Du deler kun med én person du matcher med – og bare når du selv vil.',
  },
  {
    icon: <IconMatch />,
    title: 'Match innen 24 timer',
    content: 'Du får én match om gangen – valgt med omtanke, ikke tilfeldighet. Ingen endeløs sveiping. Ingen overveldende valg.',
  },
  {
    icon: <IconResearch />,
    title: 'Forskningsbasert matching',
    content: 'Vi matcher på livssituasjon, verdier, relasjonsstil og emosjonell kompatibilitet. Ikke overflate. Ikke tilfeldigheter. Bare det som faktisk betyr noe i et forhold.',
  },
  {
    icon: <IconDepth />,
    title: 'Bygget for dybde',
    content: 'Samtaler, spørsmål og små oppgaver som hjelper dere å komme nærmere. Mindre overflate. Mer mening.',
  },
];

/* ========================
   PAGE COMPONENT
   ======================== */

export default function LandingPage() {
  return (
    <div className="min-h-screen relative" style={{
      background: `linear-gradient(180deg, ${color.bg.primary} 0%, ${color.bg.secondary} 50%, ${color.bg.primary} 100%)`
    }}>
      {/* Ambient blå lysglød */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${color.ambient.blue.medium}, transparent 70%),
            linear-gradient(180deg, ${color.bg.primary} 0%, ${color.bg.secondary} 50%, ${color.bg.primary} 100%)
          `,
        }}
      />

      <main className="relative z-10">
        {/* 1.4: Dempet aldersmerke 23+ (Tailwind-klasser, gullaksent) */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 px-6 pt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E8C766]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            23+
          </span>
          <p className="text-xs text-white/40">ToSom er for deg som har fylt 23.</p>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden py-10 ph:py-14 md:py-[60px]">
          <Hero />
        </section>

        {/* ===== HVORFOR TOSOM ===== */}
        <section className="px-6 py-16 md:py-24 text-center">
          <div
            className="mx-auto max-w-[780px] rounded-[28px] p-10 md:p-14 space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            <h2
              style={{
                ...typographyToStyle('heading-md'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Hvorfor ToSom?
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
                maxWidth: '740px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Fordi mennesker ikke er skapt for å gå gjennom livet alene. Tosomhet handler om trygghet, utvikling, hverdagsmagi og å dele livet i to.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
                maxWidth: '740px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              ToSom gir deg ro, tid og én gjennomtenkt match — slik at du faktisk kan bli kjent.
            </p>
          </div>
        </section>

        {/* ===== Slik fungerer det ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              className="text-center mb-6"
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Slik fungerer det
            </h2>

            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              ToSom er bygget for hvalitet, ikke hvantitet. Her er hvordan det fungerer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <GlassCard key={idx} padding="xl" gold interactive className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
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
                  <p
                    style={{
                      ...typographyToStyle('body-lg'),
                      color: color.text.secondary,
                      lineHeight: '1.8',
                    }}
                  >
                    {step.content}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== PRISBLOKK ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
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
              gold
              glow
              className="space-y-6"
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

        {/* ===== CTA ===== */}
        <ToSomSection
          spotlight="cta"
          className="px-6 text-center space-y-8"
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

            {/* Informasjon om betaling */}
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

          {/* Lær mer — sekundær */}
          <div className="flex flex-col items-center pt-4">
            <ToSomButton href="/slik-fungerer-det" variant="dark" size="lg">
              Lær mer
            </ToSomButton>
          </div>
        </ToSomSection>

        {/* ===== FOOTER ===== */}
        <Footer />
      </main>
    </div>
  );
}