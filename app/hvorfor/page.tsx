'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconNoise() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2l2-6 3 12 3-8 2 4h6" />
    </svg>
  );
}

function IconRo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path d="M12 6V12L16 14" strokeLinecap="round" />
    </svg>
  );
}

function IconWhy() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconSeek() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconLived() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function HvorforPage() {
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
            <h1
              style={{
                ...typographyToStyle('hero'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Hvorfor Tosom?
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
              Fordi mennesker er ikke skapt for å gå gjennom livet alene. Ikke nødvendigvis for å være i et forhold hele tiden — men for å ha muligheten til å møte noen som ser dem, forstår dem og vil dem vel.
            </p>
          </div>
        </section>

        {/* ===== KJERNEVERDIER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <IconHeart />,
                title: 'Modenhet',
                content: 'For deg som har levd litt og vet at modenhet er viktigere enn perfeksjon.',
              },
              {
                icon: <IconRo />,
                title: 'Trygghet',
                content: 'For deg som vil ha en trygg, moden og rolig prosess — ikke stress og jag.',
              },
              {
                icon: <IconSeek />,
                title: 'Tilstedeværelse',
                content: 'For deg som ønsker å dele livet i to, ikke bære alt alene.',
              },
            ].map((item, idx) => (
              <GlassCard key={idx} padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {item.icon}
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  {item.content}
                </p>
              </GlassCard>
            ))}
          </div>
        </ToSomSection>

        {/* ===== TOSOMHET BETYR ===== */}
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
                ...typographyToStyle('heading-lg'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Hva tosomhet betyr
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Tosomhet handler ikke bare om romantikk. Det handler om modenhet, utvikling, trygghet og tilstedeværelse.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Det handler om å dele hverdagen med noen, å vokse sammen, å ha en person som lytter, og å slippe å bære alt alene.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(212,175,55,0.9)',
                lineHeight: '1.7',
                fontStyle: 'italic',
              }}
            >
              Tosomhet er ikke det motsatte av ensomhet. Det er det som oppstår når to mennesker velger hverandre — med ro, med tid, med intensjon.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Det er ikke perfekt. Det er ikke alltid lett. Men det er ekte. Og det er verdt det.
            </p>
          </div>
        </section>

        {/* ===== HVORFOR TO SOM FINNES ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl">
            <GlassCard padding="xl" gold interactive className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconWhy />
                </div>
                <h2
                  style={{
                    ...typographyToStyle('heading-lg'),
                    color: color.text.primary,
                  }}
                >
                  Hvorfor Tosom finnes
                </h2>
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Fordi moderne dating har gjort det vanskelig å finne dette. Tempoet er for høyt. Valgene er for mange. Oppmerksomheten er for kort. Folk hopper videre før de rekker å kjenne etter.
              </p>

              <p
                style={{
                  ...typographyToStyle('heading-md'),
                  color: color.brand.gold,
                }}
              >
                Tosom gjør det motsatte.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['ro', 'trygghet', 'én match', 'én prosess', 'én reise', 'én mulighet til å faktisk bli kjent'].map((item, idx) => (
                  <p
                    key={idx}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.6',
                    }}
                  >
                    <span className="text-[#D4AF37] mr-2">✦</span>
                    {item}
                  </p>
                ))}
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.muted,
                  fontStyle: 'italic',
                }}
              >
                Ikke ti samtaler samtidig. Ikke hundre profiler. Ikke konkurranse. Ikke jag.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Bare deg — og én person som faktisk passer deg.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== FOR DEG SOM SØKER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl">
            <GlassCard padding="xl" gold interactive className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconSeek />
                </div>
                <h2
                  style={{
                    ...typographyToStyle('heading-lg'),
                    color: color.text.primary,
                  }}
                >
                  For deg som søker noe ekte
                </h2>
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Enten du:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'vil ha din første voksne relasjon',
                  'vil utvikle deg som menneske',
                  'vil møte noen som matcher verdiene dine',
                  'vil bygge familie',
                  'vil dele livet i to',
                  'vil ha en trygg, moden og rolig prosess',
                  'eller bare vil se hva som skjer når du gir én person tid',
                ].map((item, idx) => (
                  <p
                    key={idx}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.6',
                    }}
                  >
                    <span className="text-[#D4AF37] mr-2">✦</span>
                    {item}
                  </p>
                ))}
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Tosom er laget for deg.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== FOR DEG SOM HAR LEVD ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-8">
            <GlassCard padding="xl" gold interactive className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconLived />
                </div>
              </div>
              <h2
                style={{
                  ...typographyToStyle('heading-lg'),
                  color: color.text.primary,
                }}
              >
                For deg som har levd litt
              </h2>
              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                For deg som vet at relasjoner krever tid, trygghet bygges sakte, kjemi kommer fra dybde ikke overflate, modenhet er viktigere enn perfeksjon, og det er bedre å være to enn å være alene om alt.
              </p>
              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Tosom er laget for deg.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== NOE MER ===== */}
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
                ...typographyToStyle('heading-lg'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              For deg som vil noe mer
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Noe rolig.
            </p>
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Noe ekte.
            </p>
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Noe som kan vokse.
            </p>
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Noe som kan bli til noe.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(212,175,55,0.9)',
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              Tosom er ikke en app. Det er en prosess. En reise. Et rom hvor to mennesker kan møtes på ordentlig.
            </p>
          </div>
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
            Klar til å finne din tosomhet?
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