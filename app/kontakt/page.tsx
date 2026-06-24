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

        {/* ===== CTA ===== */}
        <section className="relative pt-[120px] pb-[140px] text-center overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)' }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-[1]">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-[1]">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kontaktCtaWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#kontaktCtaWave2)" /></svg>
          </div>

          <div className="mx-auto max-w-[900px] px-6 relative z-10">
            <h2
              className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1]"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Klar til å starte?
            </h2>
            <p
              className="mt-6 text-lg md:text-xl"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.6', maxWidth: '620px', margin: '0 auto 52px', letterSpacing: '0.2px' }}
            >
              Opprett profilen din og få en gjennomtenkt match innen 24 timer.
            </p>
            <div className="flex flex-col sm:flex-row gap-7 justify-center max-w-[680px] mx-auto">
              <Link
                href="/onboarding/start"
                className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] rounded-2xl font-semibold transition-all duration-300 ease-out text-[1.25rem]"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.92) 0%, rgba(232,194,122,0.92) 100%)',
                  color: '#0A0F1A',
                  boxShadow: '0 8px 28px rgba(212,175,55,0.18)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 34px rgba(212,175,55,0.22), 0 12px 38px rgba(0,0,0,0.18)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.008)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(212,175,55,0.18)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                Opprett konto
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] rounded-2xl font-medium transition-all duration-300 ease-out text-[1.25rem]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255,255,255,0.90)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 6px 22px rgba(0,0,0,0.18)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.20)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.90)';
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 22px rgba(0,0,0,0.18)';
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