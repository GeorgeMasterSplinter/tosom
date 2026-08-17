'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { AgeBadge } from '@/components/ui/age-badge/AgeBadge';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconNoImage() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1l22 22" />
      <path d="M16 16c-3 0-5-3-5-3l1-1" />
      <path d="M12 12c0 3 2 5 5 5" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-6" />
      <path d="M2 9.5A2.5 2.5 0 0 1 4.5 7H21a2 2 0 0 1 2 2v5" />
      <path d="M12 3l-2 2" />
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
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9" />
      <path d="M20 20v-5h-.581m-15.356-2a8.001 8.001 0 0 0 15.356-2m0 0h-5.5" />
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
        <section className="px-6 mt-32 mb-24 md:mt-48 md:mb-32 text-center">
          <div className="mx-auto max-w-[780px] space-y-6">
            <h1
              style={{
                ...typographyToStyle('hero'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              30 dager som kan endre alt
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
              Når dere matcher, starter en guidet reise — skapt for å bygge ekte forbindelse mellom to mennesker. Ingen sveiping. Ingen distraksjoner. Bare dere to, i et rom som gir trygghet, tid og struktur.
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
              De fleste relasjoner stopper før de får sjansen til å bli noe ekte. Tempoet er for høyt. Distraksjonene er for mange. Folk hopper videre før de rekker å forstå hverandre.
            </p>

            <p
              className="text-center my-8"
              style={{
                ...typographyToStyle('heading-lg'),
                color: 'rgba(212,175,55,0.9)',
              }}
            >
              ToSom gjør det motsatte.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Vi gir dere: tid, fokus, trygghet, struktur — og en reise som bygger nærhet steg for steg.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Dette er ikke en test. Det er en opplevelse — designet for å hjelpe to mennesker å møtes på en måte som føles naturlig, varm og ekte.
            </p>
          </div>
        </section>

        {/* ===== TRE FASER ===== */}
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
              Reisen består av tre faser
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fase 1 */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconNoImage />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 1 — Uten bilder (dag 1–14)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  De første dagene er uten bilder.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Ekte forbindelse bygges gjennom ord, tanker og sårbarhet — ikke gjennom utseende. Når dere ikke ser hverandre, lytter dere dypere.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Dere får rom til å føle, forstå og bli sett for den dere er.
                </p>
              </GlassCard>

              {/* Fase 2 */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconImage />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 2 — Med bilder (dag 15–21)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Etter to uker med dype samtaler, kommer bildene.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Men nå er grunnlaget allerede lagt — dere kjenner hverandre innenfra.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.brand.gold,
                    lineHeight: '1.8',
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  Bildene bekrefter det hjertet allerede vet: "Ja, det er deg."
                </p>
              </GlassCard>

              {/* Fase 3 */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconFuture />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Fase 3 — Felles reise (dag 22–30)
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Disse dagene handler om fremtiden.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Dere deler mål, drømmer, frykter og styrker.
                </p>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.brand.gold,
                    lineHeight: '1.8',
                  }}
                >
                  Dette er der forbindelsen blir til noe varig — et fundament av tillit, forståelse og felles visjon.
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
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconQuestion />
                  </div>
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
                      Hver dag får dere nye spørsmål som hjelper dere å bli kjent dypere. Vil dere grave dypere? Samlingen med over 160 spørsmål dekker alt fra hverdag til verdier, drømmer og fortid — slik at dere aldri går tom for stoff.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Små oppgaver sammen */}
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconTask />
                  </div>
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
                      Enkelte ting er best opplevd sammen. Små oppgaver skaper minner dere begge tar med dere videre.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== ETTER 30 DAGER ===== */}
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
              Hva skjer etter 30 dager?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconContinue />
                  </div>
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
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconEnd />
                  </div>
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
                  Hvis reisen har oppfylt sitt formål, kan dere avslutte med takknemlighet og klarhet.
                </p>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconNew />
                  </div>
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
                  Hvis dere ønsker det, kan dere starte en ny reise med en ny match — én om gangen.
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
            Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg — på ordentlig.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 w-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <AgeBadge />
              <span
                style={{
                  ...typographyToStyle('body-sm'),
                  color: color.text.muted,
                }}
              >
                ToSom er for deg som har fylt 21+
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