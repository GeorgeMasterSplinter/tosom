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

export default function HvorforPage() {
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
              Hvorfor ToSom
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Ekte relasjoner trenger ro, trygghet og tid. ToSom er laget for mennesker som ønsker noe mer enn overfladiske møter og endeløs scrolling.
            </p>
          </div>
        </section>

        {/* ===== PROBLEMET MED DAGENS DATING ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Dagens dating skaper støy, stress og overfladighet
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Dagens dating skaper støy, stress og overfladighet. De fleste plattformer er bygget for hastighet, ikke dybde. Swipe-kultur, uendelige valg og konstante distraksjoner gjør det vanskelig å lande i én relasjon. Mange opplever utmattelse, usikkerhet og følelsen av å være erstattbar.

ToSom er bygget for ro, trygghet og ekte tilstedeværelse. Vi har fjernet alt som skaper støy. Ingen offentlige profiler. Ingen swipe. Ingen jag. Bare én gjennomtenkt match basert på hvem du er og hva du faktisk trenger.

Ekte relasjoner trenger tid. Å bygge tillit krever rom, ro og en felles reise. ToSom gir dere det grunnlaget — med én match, en guidet prosess og alt som trengs for å bli virkelig kjent.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'For mange valg skaper stress',
                'Overfladiske profiler gir lite innsikt',
                'Swipe-kultur gjør det vanskelig å lande',
                'Lite trygghet og lite ro',
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

        {/* ===== HVORFOR TOSOM ER ANNERLEDES ===== */}
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
              ToSom er bygget for ro, trygghet og ekte tilstedeværelse
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Vi har fjernet alt som skaper støy. Ingen offentlige profiler. Ingen swipe. Ingen jag. Bare én gjennomtenkt match basert på hvem du er og hva du faktisk trenger.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Én match om gangen',
                'Ingen konkurranse, ingen sammenligning',
                'Ingen eksponering',
                'En forskningsbasert profil som gir dybde',
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

        {/* ===== ÉN MATCH – HVORFOR DET FUNGERER ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Én match. Kvalitet over kvantitet.
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Når du kun får én match, endrer alt seg. Du får tid, ro og fokus. Du slipper å sammenligne, jage eller tvile. Du kan være til stede i én relasjon — og det gir bedre grunnlag for trygghet og ekte kontakt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Mindre stress',
                'Mer tilstedeværelse',
                'Bedre samtaler',
                'Større sjanse for ekte kjemi',
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

        {/* ===== 30 DAGERS REISE ===== */}
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
              En guidet reise som bygger trygghet
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              ToSom gir dere en 30-dagers reise med små, trygge steg som hjelper dere å bli kjent på en naturlig måte. Ingen press. Ingen forventninger. Bare en rolig struktur som gjør det lettere å åpne seg.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Daglige små oppgaver',
                'Fokus på kommunikasjon',
                'Fokus på trygghet og grenser',
                'Fokus på emosjonell tilstedeværelse',
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

        {/* ===== PERSONVERN OG RO ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Trygghet og personvern i sentrum
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              ToSom er bygget for mennesker som ønsker trygghet. Ingen kan se profilen din. Ingen kan søke deg opp. Ingen kan kontakte deg uten at du selv ønsker det. Alt skjer i et privat rom mellom dere to.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Ingen offentlige profiler',
                'Ingen søkefunksjon',
                'Ingen eksponering',
                'Du bestemmer når du deler bilde',
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
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hvorforCtaWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#hvorforCtaWave2)" /></svg>
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