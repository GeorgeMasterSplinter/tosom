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

export default function KontaktPage() {
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
              Kontakt oss
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Vi er her for å hjelpe deg. Ta kontakt hvis du har spørsmål, tilbakemeldinger eller trenger støtte.
            </p>
          </div>
        </section>

        {/* ===== HVORDAN DU KAN KONTAKTE OSS ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Slik når du oss
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Vi svarer så raskt vi kan, vanligvis innen 24 timer.
            </p>

            <div className="max-w-md mx-auto space-y-4">
              <GlassCard>
                <p
                  className="text-base md:text-lg mb-1"
                  style={{ color: color.brand.gold }}
                >
                  E‑post
                </p>
                <p
                  className="text-base md:text-lg"
                  style={{ color: color.text.secondary }}
                >
                  support@tosom.no
                </p>
              </GlassCard>
              <GlassCard>
                <p
                  className="text-base md:text-lg mb-1"
                  style={{ color: color.brand.gold }}
                >
                  Åpningstider
                </p>
                <p
                  className="text-base md:text-lg"
                  style={{ color: color.text.secondary }}
                >
                  Mandag–fredag, 09:00–17:00
                </p>
              </GlassCard>
              <GlassCard>
                <p
                  className="text-base md:text-lg mb-1"
                  style={{ color: color.brand.gold }}
                >
                  Forventet svartid
                </p>
                <p
                  className="text-base md:text-lg"
                  style={{ color: color.text.secondary }}
                >
                  Innen 24 timer
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* ===== NÅR DU BØR KONTAKTE OSS ===== */}
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
              Når bør du ta kontakt?
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Du kan alltid ta kontakt hvis du trenger hjelp, men her er noen vanlige situasjoner hvor vi kan bistå.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Spørsmål om profilen din',
                'Problemer med match eller reise',
                'Tekniske utfordringer',
                'Tilbakemeldinger eller forslag',
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

        {/* ===== CTA (GlobalCTA) ===== */}
        <GlobalCTA />

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}