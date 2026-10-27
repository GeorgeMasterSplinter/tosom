'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { ResonanceLogo } from '@/components/branding/LogoVariants';
import { ToSomSection, ToSomCard, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconRo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path d="M12 6V12L16 14" strokeLinecap="round" />
    </svg>
  );
}

function IconVerdighet() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L15.089 9.263L22 10L17 15.238L18 22L12 19L6 22L7 15.238L2 10L8.911 9.263L12 3Z" />
    </svg>
  );
}

function IconModeller() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3V21M9 17H15M9 3H15M9 3L7 6M9 3L11 6" />
      <path d="M16 21V13" />
    </svg>
  );
}

function IconPersonvern() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L3 9V15L12 21L21 15V9L12 3Z" />
      <path d="M12 21V9" />
      <path d="M3 9L12 15L21 9" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function OmOssPage() {
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
          className="px-6 text-center space-y-6 flex flex-col justify-center min-h-[75vh]"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Om Tosom
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Tosom er en datingside der du blir kjent med én person om gangen. Reisen varer i to uker, og den første uken er uten bilder.
          </p>

          {/* Standard ToSom-logo — rett under innledningen */}
          <ResonanceLogo className="mt-10" />
        </ToSomSection>

        {/* ===== INTRO ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div
            className="mx-auto max-w-3xl space-y-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Mange tjenester byr på store utvalg av profiler og rask vurdering. Vi har valgt en annen vei:
            </p>

            <p
              style={{
                ...typographyToStyle('heading-sm'),
                color: color.brand.gold,
              }}
            >
              Én person om gangen.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Du får én kobling om gangen, og du slipper å velge mellom en liste med profiler mens samtalen pågår.
            </p>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.muted,
                fontStyle: 'italic',
              }}
            >
              Vi bruker det du forteller oss — blant annet livssituasjon, verdier og hva som er viktig for deg — når vi ser etter en mulig kobling.
            </p>
          </div>
        </ToSomSection>

        {/* ===== HVA TOSOMHET BETYR ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div
            className="mx-auto max-w-4xl space-y-8"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            <h2
              className="text-center mb-6"
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Hva tosomhet betyr
            </h2>

            <div className="space-y-6">
              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Tosomhet er navnet vårt på måten å bli kjent: én person om gangen, samtalen først, med tid.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Det er et ord vi valgte fordi vi tror tempoet betyr noe. Hos oss kommer samtalen først — og dere bestemmer selv hvor langt den fører.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                <GlassCard padding="lg" interactive className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Trygghet i detaljene
                  </p>
                </GlassCard>
                <GlassCard padding="lg" interactive className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Tid til å bli kjent
                  </p>
                </GlassCard>
                <GlassCard padding="lg" interactive className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Uten spill og sveiping
                  </p>
                </GlassCard>
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                  textAlign: 'center',
                }}
              >
                Vi kan ikke vite om dere passer sammen. Vi prøver å gi dere en god start — resten finner dere ut av selv.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.brand.gold,
                  lineHeight: '1.8',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Det er dette Tosom prøver å gjøre.
              </p>
            </div>
          </div>
        </ToSomSection>

        {/* ===== HVORFOR VI FINNES ===== */}
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
              Hvorfor vi finnes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard
                padding="xl"
                gold
                interactive
                className="space-y-4"
              >
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.text.primary,
                  }}
                >
                  Støyen
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Mange tjenester byr på store utvalg av profiler og rask vurdering. For mange fungerer det fint. For andre blir det støy.
                </p>
              </GlassCard>

              <GlassCard
                padding="xl"
                gold
                glow
                interactive
                className="space-y-4"
              >
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.brand.gold,
                  }}
                >
                  Rommet
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Vi valgte en annen måte: én person om gangen, samtalen før bildet, og en reise som varer i to uker.
                </p>
              </GlassCard>

              <GlassCard
                padding="xl"
                gold
                interactive
                className="space-y-4"
              >
                <h3
                  style={{
                    ...typographyToStyle('heading-md'),
                    color: color.text.primary,
                  }}
                >
                  Grunden
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Vi bygger på kunnskap fra etablert psykologi, og spørsmål vi har laget for Tosom. På metoder-siden står hva vi bygger på — og hva vi ikke lover.
                </p>
              </GlassCard>
            </div>

            <p
              className="text-center mt-10"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.brand.gold,
                lineHeight: '1.8',
                fontWeight: 600,
              }}
            >
              Tosom finnes for deg som heller vil bli kjent med én person enn å bla gjennom mange.
            </p>
          </div>
        </ToSomSection>

        {/* ===== VERDIER ===== */}
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
              Våre verdier
            </h2>

            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Slik jobber vi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToSomCard icon={<IconRo />} title="Ro" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Én samtale om gangen. Ingen støy, ingen press, ingen endeløse lister med profiler.
              </ToSomCard>

              <ToSomCard icon={<IconVerdighet />} title="Verdighet" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Profilen din er privat. Den eneste personen som ser den, er den du kobles med.
              </ToSomCard>

              <ToSomCard icon={<IconModeller />} title="Metoder" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Vi bygger på kunnskap fra etablert psykologi — ikke trender. Se nøyaktig hva vi bygger på, og hva vi ikke lover.
              </ToSomCard>

              <ToSomCard icon={<IconPersonvern />} title="Personvern" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Dine data er dine. Vi selger aldri, deler aldri og viser aldri informasjonen din. Din profil er privat — kun for deg og den du matcher med.
              </ToSomCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== TEAM ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-8">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
                textAlign: 'center',
              }}
            >
              Teamet bak Tosom
            </h2>

            <GlassCard padding="xl" gold glow interactive className="space-y-6">
              <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                Tosom er utviklet og driftet fra Norge av et lite team.
              </p>

              <p style={{ ...typographyToStyle('body-lg'), color: color.text.primary, lineHeight: '1.8' }}>
                Vi bygger en datingside — med én person om gangen, samtalen først, og en reise på to uker.
              </p>

              <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                Vi holder produktet bevisst enkelt, og vi er ærlige om hva vi ikke kan.
              </p>
            </GlassCard>
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