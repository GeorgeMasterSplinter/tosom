'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3V21M9 17H15M9 3H15M9 3L7 6M9 3L11 6" />
      <path d="M16 21V13" />
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

function IconRoom() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function IconJourney() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function PriserPage() {
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
          spotlight="blue-strong"
          className="px-6 text-center space-y-6"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Priser
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
              lineHeight: '1.8',
            }}
          >
            Én enkel pris. Ingen abonnement. Ingen skjulte kostnader. Bare ro, trygghet og en gjennomtenkt prosess.
          </p>
        </ToSomSection>

        {/* ===== HVORFOR ÉN PRIS ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <GlassCard padding="xl" gold interactive className="space-y-4">
              <h2
                style={{
                  ...typographyToStyle('heading-lg'),
                  color: color.text.primary,
                  textAlign: 'center',
                }}
              >
                Hvorfor én pris?
              </h2>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Vi tror at relasjoner trenger ro — ikke press, ikke stress, ikke løpende betalinger. Derfor har Tosom ingen abonnement, ingen nivåer og ingen skjulte funksjoner.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                  lineHeight: '1.8',
                }}
              >
                Du får alt fra første dag. Du betaler kun når du er klar til å starte reisen. Ingen binding. Ingen overraskelser. Ingen &ldquo;premium-pakker&rdquo;.
              </p>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.brand.gold,
                  lineHeight: '1.8',
                }}
              >
                Bare én pris, én reise, én mulighet til å møte én person, valgt med omtanke.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== HVA DU FÅR ===== */}
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
              Hva du får
            </h2>

            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Tosom gir deg en komplett, trygg prosess — underbygd av etablerte relasjonsmodeller (se det vi bygger på) — for å møte én person, valgt med omtanke.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconProfile />
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      Veiledet profil, underbygd av relasjonsmodeller
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Du svarer på et gjennomtenkt sett med spørsmål om livet ditt, verdiene dine, personligheten din og hva du søker i et forhold. Profilene dine blir målt mot hverandre gjennom resonansmålingen — for å finne den rytmen som svinger med din.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconMatch />
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      Én match hver lørdag
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Natt til lørdag måler vi resonansen. Vi leter ikke etter den som ser lik deg ut — vi leter etter den som får svingen din til å vokse. Du får kun én match om gangen.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconRoom />
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      Privat rom mellom dere to
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Når dere matcher, får dere et helt privat rom med guidede samtaler, refleksjoner, oppgaver og resonansmåling. Et rom designet for trygghet og dypde — uten distraksjoner.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="xl" gold interactive className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconJourney />
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      30 dagers guidet reise
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      Dere går gjennom en strukturert 30-dagers reise med daglige refleksjonsspørsmål, samtaletema, små oppgaver og resonansmåling. Dette er kjernen i Tosom — en prosess som faktisk hjelper dere å bli kjent.
                    </p>
                  </div>
                </div>
              </GlassCard>
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
                  ...typographyToStyle('heading-xl'),
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
                Tosom er i lukket beta. Reisen er gratis for deg som er invitert, og det kreves ingen betaling.
              </p>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.muted,
                  lineHeight: '1.7',
                }}
              >
                Når Tosom åpner for alle, blir reisen gratis for de første 5 000 brukerne. Deretter koster én reise 349 kroner, betalt én gang. Vi varsler i god tid før dette trer i kraft.
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
            Lag profilen din i ditt eget tempo og møt én person, valgt med omtanke — på ordentlig.
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