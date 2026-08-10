'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomCard, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

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

function IconForskning() {
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
   HELPER — Premium GlassCard
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
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: `${radius.xl}px`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
        padding: `${paddingMap[padding]}px`,
        transition: 'all 300ms ease-out',
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.20)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212,175,55,0.08)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
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
          className="px-6 text-center space-y-6"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Om ToSom
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            ToSom ble skapt med én tanke: at ekte forbindelse fortsatt er mulig — når vi gir rom for den.
          </p>
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
              I en verden som går fort, hvor mennesker sveiper, vurderer og forsvinner før de rekker å kjenne etter, ville vi bygge det motsatte:
            </p>

            <p
              style={{
                ...typographyToStyle('heading-sm'),
                color: color.brand.gold,
              }}
            >
              Et rolig rom.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Et sted der to mennesker kan senke skuldrene, være til stede og faktisk møtes.
            </p>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.muted,
                fontStyle: 'italic',
              }}
            >
              ToSom er ikke en markedsplass. Det er ikke en app som jager effektivitet. Det er en prosess — en reise — som hjelper to mennesker å bli kjent på ordentlig.
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
                Tosomhet er et ord som finnes dypt i norsk språk og kultur. Det beskriver noe stille, varmt og modent — et rom mellom to mennesker hvor det er plass til begge.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Tosomhet er ikke det motsatte av ensomhet. Det er det som oppstår når to mennesker våger å være åpne nok til å bli sett, og rolige nok til å se tilbake.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                <GlassCard padding="lg" className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Trygghet uten støy
                  </p>
                </GlassCard>
                <GlassCard padding="lg" className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Nærhet uten hastverk
                  </p>
                </GlassCard>
                <GlassCard padding="lg" className="text-center">
                  <p
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Kontakt uten spill
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
                Det er ikke bare &ldquo;to personer&rdquo;. Det er et mellomrom — et rom som oppstår når man møter noen som faktisk passer, og man gir det tid til å vokse.
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
                Det er dette ToSom bygger.
              </p>
            </div>
          </div>
        </ToSomSection>

        {/* ===== HVORFOR VI FINNES ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div
            className="mx-auto max-w-3xl space-y-8"
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
              Hvorfor vi finnes
            </h2>

            <div className="space-y-6">
              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Moderne dating er rask, støyende og fragmentert. Folk sveiper, vurderer og hopper videre før de rekker å kjenne etter.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Vi ønsket å skape det motsatte: et rom hvor to mennesker kan ta tiden tilbake, kjenne etter, og møtes på en måte som faktisk betyr noe.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.primary,
                  lineHeight: '1.8',
                }}
              >
                ToSom finnes fordi mennesker fortjener mer enn tilfeldige matcher og raske vurderinger. Vi finnes fordi relasjoner ikke er effektivitet — de er tilstedeværelse. Vi finnes fordi forskning viser at ekte kontakt oppstår når mennesker møtes med ro, struktur og nysgjerrighet.
              </p>
            </div>
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
              Hver detalje i ToSom reflekterer verdiene vi bærer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToSomCard icon={<IconRo />} title="Ro" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Alt i ToSom er designet for trygghet, fokus og lav puls. Ingen støy. Ingen press. Bare et rolig rom hvor to mennesker kan bli kjent uten hastverk.
              </ToSomCard>

              <ToSomCard icon={<IconVerdighet />} title="Verdighet" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Alle mennesker fortjener en plattform som behandler dem med respekt og varme. Hvert element, hver tekst og hvert valg er laget med omtanke.
              </ToSomCard>

              <ToSomCard icon={<IconForskning />} title="Forskning" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Vi bygger på psykologiske modeller og relasjonsforskning — ikke trender. Hvert designvalg, hver match og hver guiding er forskningsinformert for å skape ekte forbindelse.
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
              Teamet bak ToSom
            </h2>

            <GlassCard padding="xl" className="space-y-6">
              <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                ToSom er utviklet og driftet fra Norge av et lite, dedikert team som tror på relasjoner, teknologi og menneskelig varme.
              </p>

              <p style={{ ...typographyToStyle('body-lg'), color: color.text.primary, lineHeight: '1.8' }}>
                Vi bygger ikke en app.
              </p>

              <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>
                Vi bygger et rom.
              </p>

              <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                Et rom der mennesker kan møtes på en trygg, moden og meningsfull måte.
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