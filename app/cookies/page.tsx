'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H3a2 2 0 0 1 0-4h18" />
      <path d="M3 19l3-3 4 4 4-8 3 3" />
      <path d="M21 12v7" />
    </svg>
  );
}

function IconCookie() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8l.01.01" />
      <path d="M12 8v2" />
      <path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="M14 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function CookiesPage() {
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
            Cookies
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Tosom bruker bare det nødvendige av cookies. Vi tar personvern alvorlig og deler aldri data med tredjeparts-tracking.
          </p>
        </ToSomSection>

        {/* ===== HVARFOR VI BRUKER COOKIES ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
                textAlign: 'center',
              }}
            >
              Hvorfor vi bruker cookies
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Cookies lar Tosom fungere trygt og effektivt. Vi samler inn minimalt med data — kun det som trengs for å gi deg en god og trygg opplevelse.
            </p>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.primary,
                lineHeight: '1.8',
              }}
            >
              Vi deler aldri informasjonen din med annonsører, sporingstjenester eller tredjeparter. Din personvern er en del av Tosom-dnaet.
            </p>
          </div>
        </ToSomSection>

        {/* ===== COOKIE-KATEGORIER ===== */}
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
              Cookie-guiden
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teknisk nødvendige cookies */}
              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconShield />
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Teknisk nødvendige cookies
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Disse er nødvendige for at plattformen skal fungere. De lagrer session-token og autentisering. Du kan ikke slå av disse.
                </p>
              </GlassCard>

              {/* Analytics-cookies */}
              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconAnalytics />
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Analytics-cookies
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Vi bruker ingen analytics-cookies som sporer deg personlig. Vi har et minimalt, privat analyserverktøy som ikke deler data med noen.
                </p>
              </GlassCard>

              {/* Hva er en cookie? */}
              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconCookie />
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Hva er en cookie?
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  En cookie er en liten tekstfil som nettleseren din lagrer. Det gjør at vi kan huske innstillingene dine og gi deg en bedre opplevelse.
                </p>
              </GlassCard>

              {/* Hvor lenge lagres cookies? */}
              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconClock />
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    Hvor lenge lagres cookies?
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Session-cookies blir slettet når du lukker nettleseren. Permanente cookies kan bli lagret i opptil 1 år.
                </p>
              </GlassCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== KONTROLLERE COOKIES ===== */}
        <ToSomSection
          spotlight="soft"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
                textAlign: 'center',
              }}
            >
              Kontrollere cookies
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Du kan kontrollere cookies gjennom innstillingene i nettleseren din. Merk at hvis du blokkerer alle cookies, vil plattformen ikke fungere som den skal.
            </p>

            <GlassCard padding="xl" interactive className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconSettings />
                </div>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  Gå til nettleserens innstillinger for å administrere cookies. De fleste nettlesere tilbyr alternativer for å velge hvilke typer cookies du vil akseptere.
                </p>
              </div>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== KONTAKT ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Spørsmål om cookies?
            </h2>

            <GlassCard padding="xl" interactive className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconMail />
                </div>
              </div>

              <p
                style={{
                  ...typographyToStyle('body-lg'),
                  color: color.text.secondary,
                }}
              >
                Kontakt oss på{' '}
                <Link
                  href="mailto:support@tosom.no"
                  style={{
                    color: color.brand.gold,
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(212,175,55,0.3)',
                  }}
                >
                  support@tosom.no
                </Link>
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
            Lag profilen din i ditt eget tempo og møt noen som passer deg — på ordentlig.
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