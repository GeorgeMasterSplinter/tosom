'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { Hero } from '@/components/ui/layout/Hero';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import { Reveal } from '@/components/motion/Reveal';

/* ========================
   Ikoner — bygget på resonans-motivet
   Alle 24×24, stroke 1.5, currentColor.
   ======================== */

/** Velvære — sirkel med rolig indre bue */
function IconWellbeing() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 13.5c1.8-2.4 3.2-2.4 4.5 0s2.7 2.4 4.5 0" />
    </svg>
  );
}

/** Privat profil — sirkel med skjermet indre */
function IconPrivacy() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21" />
    </svg>
  );
}

/** Én match — signaturmotivet: to sirkler som møtes */
function IconMatch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </svg>
  );
}

/** Forskningsbasert — sirkel med målpunkt */
function IconResearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Dybde — konsentriske buer, nedover */
function IconDepth() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.4 9.6h13.2M6.9 13.2h10.2M9 16.8h6" />
    </svg>
  );
}

/** Resonans-skille — motivet i miniatyr */
function ResonanceDivider() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
        <circle cx="16" cy="10" r="7" stroke="rgba(212,175,55,0.28)" strokeWidth="1" />
        <circle cx="28" cy="10" r="7" stroke="rgba(212,175,55,0.28)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ========================
   STEG-DATA — 5 KORT
   ======================== */

const steps = [
  {
    icon: <IconWellbeing />,
    title: 'Velvære først',
    content: 'Vi senker tempoet, ikke kvaliteten. Trygghet og emosjonell komfort kommer før alt annet.',
  },
  {
    icon: <IconPrivacy />,
    title: 'Privat profil',
    content: 'Profilen din er helt privat og aldri offentlig. Du deler kun med én person du matcher med – og bare når du selv vil.',
  },
  {
    icon: <IconMatch />,
    title: 'Én match i uken',
    content: 'Vi samler mennesker gjennom uken og kobler natt til lørdag. Du får én match — valgt med omtanke, ikke tilfeldighet. Ingen endeløs sveiping. Ingen overveldende valg.',
    featured: true,
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
        {/* Hero */}
        <section className="relative overflow-hidden py-10 ph:py-14 md:py-[60px]">
          <Hero />
        </section>

        {/* ===== HVORFOR TOSOM ===== */}
        <section className="px-6 py-16 md:py-24 text-center">
          <Reveal direction="up" duration={1000}>
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
              Hvorfor Tosom?
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
              Tosom gir deg ro, tid og én gjennomtenkt match — slik at du faktisk kan bli kjent.
            </p>
          </div>
          </Reveal>
        </section>

        <ResonanceDivider />

        {/* ===== Slik fungerer det ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal direction="up" delay={0}>
            <h2
              className="text-center mb-6"
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Slik fungerer det
            </h2>
            </Reveal>

            <Reveal direction="up" delay={120}>
            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Tosom er bygget for kvalitet, ikke kvantitet. Her er hvordan det fungerer.
            </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <Reveal key={idx} direction="up" delay={idx * 80} duration={900}>
                  <GlassCard
                    padding="xl"
                    gold
                    glow={step.featured}
                    interactive
                    className={`space-y-4 h-full ${step.featured ? 'lg:col-span-2' : ''}`}
                  >
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
                </Reveal>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== BETA-BLOKK ===== */}
        {/* Under beta vises ingen pris. Betalingsvei er ikke implementert. */}
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
              Gratis i lukket beta
            </h2>

            <GlassCard
              padding="xl"
              gold
              glow
              className="space-y-6"
            >
              <div
                style={{
                  ...typographyToStyle('heading-lg'),
                  color: color.brand.gold,
                }}
              >
                Gratis
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Tosom er i lukket beta, og reisen er gratis for deg som er invitert. Vi sier fra i god tid før prismodellen trer i kraft.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        <ResonanceDivider />

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
              Logg inn og bygg profilen din. Neste kobling skjer natt til lørdag.

            </p>

            {/* Hoved-CTA: Logg inn med Vipps */}
            <ToSomButton
              href="/api/auth/vipps"
              variant="gold"
              size="xl"
            >
              Logg inn med Vipps
            </ToSomButton>

            <p
              style={{
                ...typographyToStyle('body-sm'),
                color: color.text.muted,
                lineHeight: '1.7',
              }}
            >
              Når innlogging er godkjent, blir du sendt til første steg i onboarding for å lage profilen din.
            </p>
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