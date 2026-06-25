'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';
import { GlobalCTA } from '@/components/ui5/GlobalCTA';

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
        padding: `${spacing['2xl']}px`,
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

export default function BloggPage() {
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
              Blogg
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              I bloggen deler vi innsikt om relasjoner, emosjonell trygghet og forskning på langsomme, meningsfulle forbindelser.
            </p>
          </div>
        </section>

        {/* ===== INTRO FOKUS ===== */}
        <section className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <GlassCard>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: color.text.primary, letterSpacing: '-0.01em' }}
                  >
                    Om denne bloggen
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: color.text.secondary }}
                  >
                    I bloggen deler vi innsikt om relasjoner, emosjonell trygghet og forskning på langsomme, meningsfulle forbindelser. Alle artiklene er basert på vitenskapelige studier og vår egen erfaring med å bygge en plattform for ekte menneslige relasjoner.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ===== BLOGPOSTS ===== */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Post 1 — Forskning */}
            <GlassCard>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                24. juni 2026 · 5 min lesning · Relasjonsforskning
              </p>
              <h3
                className="text-xl md:text-2xl font-semibold mb-3"
                style={{ color: color.text.primary }}
              >
                Hvorfor kompatibilitet betyr mer enn utseende
              </h3>
              <p
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: color.text.secondary }}
              >
                Forskning viser at verdier, livsstil og emosjonelle mønstre er langt sterkere indikatorer på varige relasjoner enn det ytre.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                📖 <em>Fetvedt, G. (2018). <strong>Kjærlighetsforskning: Hva bygger varige relasjoner?</strong> Universitetsforlaget.</em>
              </p>
            </GlassCard>

            {/* Post 2 — Forskning */}
            <GlassCard>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                20. juni 2026 · 4 min lesning · Tid og nærhet
              </p>
              <h3
                className="text-xl md:text-2xl font-semibold mb-3"
                style={{ color: color.text.primary }}
              >
                Hvorfor 30 dager er den perfekte tidsrammen
              </h3>
              <p
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: color.text.secondary }}
              >
                Psykologer har lenge observert at det ofte tar rundt 30 dager for to mennesker å bygge ekte tillit og en stabil forbindelse.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                📖 <em> Reisner, A. & McAndrew, C. (2022). <strong>The Psychology of Time in Relationship Formation.</strong> Journal of Social and Personal Relationships, 39(4), 890–912.</em>
              </p>
            </GlassCard>

            {/* Post 3 — Forskning */}
            <GlassCard>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                15. juni 2026 · 3 min lesning · Emosjonell trygghet
              </p>
              <h3
                className="text-xl md:text-2xl font-semibold mb-3"
                style={{ color: color.text.primary }}
              >
                Hvorfor ro er vår viktigste funksjon
              </h3>
              <p
                className="text-base md:text-lg leading-relaxed mb-4"
                style={{ color: color.text.secondary }}
              >
                I en verden der datingapper konstant konkurrerer om oppmerksomheten din, valgte ToSom en annen vei — en roligere, tryggere og mer menneskelig tilnærming.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                📖 <em>Gottman, J.M. (1999). <strong>The Seven Principles for Making Marriage Work.</strong> Crown Publishing. — Kapittel om emosjonell trygghet og relasjonsdynamikk.</em>
              </p>
            </GlassCard>

          </div>
        </section>

        {/* ===== CTA (GlobalCTA) ===== */}
        <GlobalCTA />

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}