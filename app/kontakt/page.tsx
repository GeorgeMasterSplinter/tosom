'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomCard, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconMail() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4AF37]">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function KontaktPage() {
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
            Kontakt oss
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Vi er her for å hjelpe deg. Ta kontakt hvis du har spørsmål, tilbakemeldinger eller trenger støtte.
          </p>
        </ToSomSection>

        {/* ===== Slik når du oss ===== */}
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
              Slik når du oss
            </h2>

            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Vi svarer så raskt vi kan, vanligvis innen 24 timer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconMail />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  E‑post
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                    textAlign: 'center',
                  }}
                >
                  support@tosom.no
                </p>
              </GlassCard>

              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconClock />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Åpningstider
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                    textAlign: 'center',
                  }}
                >
                  Mandag–fredag, 09:00–17:00
                </p>
              </GlassCard>

              <GlassCard padding="xl" interactive className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    <IconSend />
                  </div>
                </div>
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                    textAlign: 'center',
                  }}
                >
                  Forventet svartid
                </h3>
                <p
                  style={{
                    ...typographyToStyle('body'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                    textAlign: 'center',
                  }}
                >
                  Innen 24 timer
                </p>
              </GlassCard>
            </div>
          </div>
        </ToSomSection>

        {/* ===== Når bør du ta kontakt? ===== */}
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
              Når bør du ta kontakt?
            </h2>

            <p
              className="max-w-3xl mx-auto text-center mb-12"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Du kan alltid ta kontakt hvis du trenger hjelp, men her er noen vanlige situasjoner hvor vi kan bistå.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ToSomCard icon={<IconProfile />} title="Spørsmål om profilen din" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Er du usikker på hvordan profilen fungerer? Skriv til oss — vi svarer raskt.
              </ToSomCard>

              <ToSomCard icon={<IconHeart />} title="Problemer med match eller reise" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Vi ser sammen med deg hva som kan forbedres.
              </ToSomCard>

              <ToSomCard icon={<IconCode />} title="Tekniske utfordringer" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Tech-problemer fikses raskt — skriv gjerne til oss.
              </ToSomCard>

              <ToSomCard icon={<IconMessage />} title="Tilbakemeldinger eller forslag" iconWrapperClassName="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)]">
                Vi elsker tilbakemeldinger. De gjør Tosom bedre.
              </ToSomCard>
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