'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   HELPER — Glass kort
   ======================== */

function GlassCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: color.glass.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${color.glass.border}`,
        borderRadius: `${radius.xl}px`,
        boxShadow: shadow.lg,
        padding: `${spacing.lg}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function SlikPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.03), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <section
          className="pt-32 pb-20 text-center"
          style={{
            background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl mb-8"
              style={typographyToStyle('heading-lg')}
            >
              Slik fungerer ToSom
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              En rolig og trygg prosess som hjelper deg å møte én person som faktisk passer deg. Ingen stress. Ingen swipe. Bare kvalitet.
            </p>
          </div>
        </section>

        {/* ===== STEG 1 ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              1. Veiledet profil
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Du starter med en forskningsbasert og guidet profil som hjelper deg å forstå hvem du er, hva du trenger og hva som faktisk passer deg i en relasjon. Spørsmålene er enkle, rolige og bygget for å gi dybde.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Basert på forskning og relasjonspsykologi',
                'Hjelper deg å forstå dine behov',
                'Gir et helhetlig bilde av hvem du er',
                'Ingen stress, ingen tidspress',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STEG 2 ===== */}
        <section
          className="py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              2. Én match innen 24 timer
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Når profilen din er klar, får du én gjennomtenkt match. Ikke ti. Ikke hundre. Bare én person som faktisk passer deg basert på verdier, livsstil, kommunikasjon og fremtidsønsker.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Én match om gangen',
                'Ingen swipe',
                'Ingen konkurranse',
                'Fokus og ro',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STEG 3 ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              3. En guidet 30 dagers reise
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Når dere matches, får dere en rolig 30 dagers reise med små, trygge steg som hjelper dere å bli kjent på en naturlig måte. Ingen press. Ingen forventninger. Bare en struktur som gjør det lettere å åpne seg.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Daglige små oppgaver',
                'Fokus på trygghet og kommunikasjon',
                'Bygger emosjonell tilstedeværelse',
                'Ingen hastverk',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STEG 4 ===== */}
        <section
          className="py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              4. Trygg kommunikasjon
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              All kommunikasjon skjer i et privat rom mellom dere to. Ingen kan se profilen din. Ingen kan søke deg opp. Du bestemmer selv når du vil dele bilde eller mer personlig informasjon.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Privat rom mellom dere to',
                'Ingen offentlige profiler',
                'Ingen eksponering',
                'Du styrer tempoet',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{ color: color.text.primary }}
            >
              Klar til å starte?
            </h2>
            <p
              className="text-lg mb-10 leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Opprett profilen din og få én gjennomtenkt match innen 24 timer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding/start"
                className="inline-flex items-center justify-center px-14 py-4 font-medium transition-all duration-300 text-base"
                style={{
                  ...typographyToStyle('cta'),
                  background: color.brand.gold,
                  color: '#0B1520',
                  borderRadius: `${radius.md}px`,
                  boxShadow: `0 0 30px ${color.ambient.gold.medium}, 0 4px 12px rgba(0,0,0,0.2)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = color.brand['gold-hover'];
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = color.brand.gold;
                }}
              >
                Opprett konto
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-14 py-4 font-medium transition-all duration-300 text-base border"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: color.text.secondary,
                  border: `1px solid ${color.border.default}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.color = color.text.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = color.text.secondary;
                }}
              >
                Logg inn
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}