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
        <section className="px-6 pt-24 pb-16 text-center min-h-[75vh] flex flex-col justify-center">
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
              Tosom er laget for deg som heller vil bli kjent med én person enn å bla gjennom mange. Du får én kobling om gangen. Den første uken er uten bilder, slik at samtalen får komme først. Fra dag 8 blir bildet tilgjengelig. Vi prøver å gi dere en god start. Resten finner dere ut av selv.
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
                title: 'Én person om gangen',
                content: 'Du får én kobling om gangen. Ingen liste med profiler å velge mellom mens samtalen pågår.',
              },
              {
                icon: <IconRo />,
                title: 'Samtalen før bildet',
                content: 'Den første uken er uten bilder. Dere begynner med samtalen, og fra dag 8 blir bildet tilgjengelig.',
              },
              {
                icon: <IconSeek />,
                title: 'En reise på to uker',
                content: 'Hver dag får dere et spørsmål eller et tema, og samtalen ligger der gjennom hele reisen. Avslutning skjer på dag 14.',
              },
            ].map((item, idx) => (
              <GlassCard key={idx} padding="xl" gold interactive className="space-y-4 text-center">
                <div className="flex justify-center">
                  <GoldPulseIcon size={56}>
                    {item.icon}
                  </GoldPulseIcon>
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
              Tosomhet er navnet vårt på måten å bli kjent: én person om gangen, samtalen først, med tid.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Det er et ord vi valgte fordi vi tror tempoet betyr noe. Hos oss kommer samtalen først — og dere bestemmer selv hvor langt den fører.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(212,175,55,0.9)',
                lineHeight: '1.7',
                fontStyle: 'italic',
              }}
            >
              Vi kan ikke vite om dere kommer til å passe sammen. Vi prøver å gi dere en god start. Resten finner dere ut av selv.
            </p>
          </div>
        </section>

        {/* ===== SIDSTE 4 — 2×2-gruppe (to på hverandre på laptop, én i kolonne på mobil) ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kart 1 */}
            <GlassCard padding="lg" gold interactive className="space-y-4">
              <div className="flex items-center gap-3">
                <GoldPulseIcon size={44} className="flex-shrink-0">
                  <IconWhy />
                </GoldPulseIcon>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  Hvorfor Tosom finnes
                </h3>
              </div>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.secondary,
                  lineHeight: '1.7',
                }}
              >
                Mange tjenester byr på store utvalg av profiler og rask vurdering. For mange fungerer det fint. For andre blir det støy — de hopper videre før de rekker å kjenne etter.
              </p>

              <p
                style={{
                  ...typographyToStyle('heading-sm'),
                  color: color.brand.gold,
                }}
              >
                Tosom gjør det motsatte.
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {['én kobling om gangen', 'kobling natt til lørdag', 'første uke uten bilder', 'bilde fra dag 8', 'reise på 14 dager', 'neste runde hvis ingen god nok'].map((item, idx) => (
                  <p
                    key={idx}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.5',
                    }}
                  >
                    <span className="text-[#D4AF37] mr-2">✦</span>
                    {item}
                  </p>
                ))}
              </div>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.muted,
                  fontStyle: 'italic',
                }}
              >
                Ikke ti samtaler samtidig. Ikke hundre profiler. Ikke konkurranse. Ikke jag.
              </p>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Vi vil heller la deg vente enn å koble deg tilfeldig.
              </p>
            </GlassCard>

            {/* Kart 2 */}
            <GlassCard padding="lg" gold interactive className="space-y-4">
              <div className="flex items-center gap-3">
                <GoldPulseIcon size={44} className="flex-shrink-0">
                  <IconSeek />
                </GoldPulseIcon>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  Hvem er Tosom for?
                </h3>
              </div>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.secondary,
                  lineHeight: '1.7',
                }}
              >
                Enten du:
              </p>

              <div className="space-y-2">
                {[
                  'ønsker en seriøs relasjon',
                  'heller vil bli kjent med én person enn å bla gjennom mange',
                  'setter verdier, livssituasjon og relasjoner høyt',
                  'eller bare vil se hva som skjer når du gir én person tid',
                ].map((item, idx) => (
                  <p
                    key={idx}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.5',
                    }}
                  >
                    <span className="text-[#D4AF37] mr-2">✦</span>
                    {item}
                  </p>
                ))}
              </div>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Da kan dette passe deg.
              </p>
            </GlassCard>

            {/* Kart 3 */}
            <GlassCard padding="lg" gold interactive className="space-y-4">
              <div className="flex items-center gap-3">
                <GoldPulseIcon size={44} className="flex-shrink-0">
                  <IconLived />
                </GoldPulseIcon>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  For deg som vet at det tar tid
                </h3>
              </div>
              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.secondary,
                  lineHeight: '1.7',
                }}
              >
                Noen ting tar tid — å bli kjent med noen, å vite hva man vil, å finne ordene. Reisen er bygd for at dere skal få den tiden: to uker, ett fokus om gangen.
              </p>
              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.brand.gold,
                  fontWeight: 600,
                }}
              >
                Slik er reisen bygd.
              </p>
            </GlassCard>

            {/* Kart 4 */}
            <GlassCard padding="lg" gold interactive className="space-y-4">
              <div className="flex items-center gap-3">
                <GoldPulseIcon size={44} className="flex-shrink-0">
                  <IconMore />
                </GoldPulseIcon>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  Hva du får
                </h3>
              </div>

              <p
                style={{
                  ...typographyToStyle('body'),
                  color: 'rgba(255,255,255,0.88)',
                  lineHeight: '1.7',
                  letterSpacing: '0.25px',
                }}
              >
                En guidet 14-dagers reise der samtalen kommer først. Fra dag 8 kan dere dele bilder. Når dere er ferdige, avslutter dere reisen.
              </p>
              <p
                style={{
                  ...typographyToStyle('body'),
                  color: 'rgba(212,175,55,0.9)',
                  fontWeight: 600,
                  fontStyle: 'italic',
                }}
              >
                Tosom er en datingside. Forskjellen er at du blir kjent med én person om gangen — ikke i en strøm av profiler.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== MOTPOL-Lenke (ACT MOTPOL, D1) ===== */}
        <section className="px-6 pb-4 pt-2 text-center">
          <p
            style={{
              ...typographyToStyle('body'),
              color: 'rgba(255,255,255,0.65)',
              lineHeight: '1.7',
            }}
          >
            Lurer du på hvorfor vi har valgt akkurat denne veien?{' '}
            <Link
              href="/motpol"
              className="underline decoration-[rgba(212,175,55,0.35)] decoration-1 underline-offset-4 hover:decoration-[#D4AF37] transition-all duration-300"
              style={{ color: color.brand.gold }}
            >
              Les motpolen vår
            </Link>
          </p>
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