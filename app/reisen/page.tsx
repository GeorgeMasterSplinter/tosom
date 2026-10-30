'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import GoldPulseIcon from '@/components/ui/feedback/GoldPulseIcon';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconNoImage() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
      <line x1="3" y1="21" x2="21" y2="3" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  );
}

function IconFuture() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconQuestion() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconTalk() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconTask() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconResonance() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2l2-6 3 12 3-8 2 4h6" />
    </svg>
  );
}

function IconContinue() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function IconEnd() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l4 4 4-4" />
    </svg>
  );
}

function IconNew() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function ReisenPage() {
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
        <section className="px-6 pt-28 pb-16 text-center min-h-[75vh] flex flex-col justify-center">
          <div className="mx-auto max-w-[780px] space-y-6">
            <h1
              style={{
                ...typographyToStyle('hero'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              To uker i eget tempo
            </h1>

            <p
              className="max-w-2xl mx-auto"
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Når dere matcher, starter en guidet reise over 14 dager. Ingen andre profiler, ingen sveiping. Bare dere to og samtalen.
            </p>
          </div>
        </section>

        {/* ===== INTRO ===== */}
        <section className="px-6 mt-24 mb-32 md:mt-32 md:mb-48">
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
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Reisen er bygget rundt tempoet dere faktisk har. Hver dag gir dere ett fokus — et spørsmål, et tema eller en liten oppgave. Resten er opp til dere.
            </p>

            <p
              className="text-center my-8"
              style={{
                ...typographyToStyle('heading-lg'),
                color: 'rgba(212,175,55,0.9)',
              }}
            >
              Tosom gjør det motsatte.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Vi gir dere tid, fokus og struktur — og en reise som gir dere noe å ta fatt på hver dag.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Dere bestemmer tempoet. Dere kan chatte fritt og velge blant
              spørsmål og enkle oppgaver når dere ønsker det. Reisen har også
              små refleksjoner underveis, men dere trenger ikke fullføre noe
              bestemt hver dag. Bruk det som passer når det passer.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Dette er ikke en test. Spørsmålene er der for å gjøre det lettere å komme i gang.
            </p>
          </div>
        </section>

        {/* ===== TRE FASER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              className="text-center mb-6"
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Reisen består av fire faser
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Fase 1 */}
              <GlassCard padding="lg" gold interactive className="space-y-3">
                <div className="flex justify-center">
                  <GoldPulseIcon size={48}>
                    <IconNoImage />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 1 — Uten bilder (dag 1–7)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  De første dagene er uten bilder.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Spørsmålene gir dere noe å starte med, og tid til å høre på hverandre.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.brand.gold,
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  Dere får tid til å bli kjent.
                </p>
              </GlassCard>

              {/* Fase 2 */}
              <GlassCard padding="lg" gold interactive className="space-y-3">
                <div className="flex justify-center">
                  <GoldPulseIcon size={48}>
                    <IconImage />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 2 — Med bilder (dag 8–10)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Når dere har snakket sammen i én uke, åpner muligheten for bilder. Det er helt valgfritt — du deler hvis det føles naturlig.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Den første uken er uten bilder, slik at samtalen får komme først. Fra dag 8 er bildene åpne.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.brand.gold,
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  Bildene kommer inn i en samtale dere allerede har.
                </p>
              </GlassCard>

              {/* Fase 3 */}
              <GlassCard padding="lg" gold interactive className="space-y-3">
                <div className="flex justify-center">
                  <GoldPulseIcon size={48}>
                    <IconFuture />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 3 — Dypere (dag 11–12)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Dagene handler om hverdagen deres — mål, drømmer og hva som betyr mest.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Og om forskjellene: hva dere har felles, og hva dere ikke har.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.brand.gold,
                    lineHeight: '1.7',
                  }}
                >
                  Denne fasen er for å bli kjent — ikke for å finne ut av alt.
                </p>
              </GlassCard>

              {/* Fase 4 */}
              <GlassCard padding="lg" gold interactive className="space-y-3">
                <div className="flex justify-center">
                  <GoldPulseIcon size={48}>
                    <IconContinue />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 4 — Avslutning (dag 13–14)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Her handler det om fremtiden. Dere vurderer fritt om dere passer — uten press, uten forventning.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.7',
                  }}
                >
                  Dere reflekterer over hva reisen har gitt dere, og velger selv hva som skjer videre.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.brand.gold,
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  Det er greit uansett hva dere velger.
                </p>
              </GlassCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== DAGLIG GUIDE ===== */}
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
              Daglig guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guidede samtaler */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <GoldPulseIcon size={56} className="flex-shrink-0">
                    <IconQuestion />
                  </GoldPulseIcon>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      Guidede samtaler
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Velg spørsmål som hjelper dere å bli kjent. 12 kategorier med 180 spørsmål — fra lek og humor til nærhet og modne samtaler. Dere velger selv hvor dypt dere vil grave.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Små oppgaver sammen */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <GoldPulseIcon size={56} className="flex-shrink-0">
                    <IconTask />
                  </GoldPulseIcon>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      Små oppgaver sammen
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Enkelte ting er best opplevd sammen. 9 kategorier med små, enkle oppgaver skaper minner dere begge tar med dere videre.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== ETTER 14 DAGER ===== */}
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
              Hva skjer etter 14 dager?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <GoldPulseIcon size={56}>
                    <IconContinue />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                  }}
                >
                  Fortsette
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Hvis reisen har gitt dere noe spesielt, kan dere fortsette helt naturlig — uten press.
                </p>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <GoldPulseIcon size={56}>
                    <IconEnd />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                  }}
                >
                  Avslutte
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Hvis reisen har gitt det den skulle, kan dere avslutte den.
                </p>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <GoldPulseIcon size={56}>
                    <IconNew />
                  </GoldPulseIcon>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                  }}
                >
                  Ny reise
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Hvis dere ønsker det, kan dere starte en ny reise med en ny person — én om gangen.
                </p>
              </GlassCard>
            </div>
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
            Lag profilen din. Neste matcherunde er natt til lørdag.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 w-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <span
                style={{
                  ...typographyToStyle('body-sm'),
                  color: color.text.muted,
                }}
              >
                Tosom er for deg som har fylt 18
              </span>
            </div>

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