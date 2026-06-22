'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   DATA — Seksjonar
   ======================== */

const notFeatures = [
  { title: 'Ingen swipe', desc: 'Ingen overflatefokus. Ingen raske dømar.' },
  { title: 'Ingen feed', desc: 'Ingen uendeleg rulling. Ingen støy.' },
  { title: 'Ingen markedsplass', desc: 'Ingen "finn flest mogleg". Berre éin person.' },
  { title: 'Ingen gamification', desc: 'Ingen poeng, nivå eller belønningar.' },
  { title: 'Ingen åpne profiler', desc: 'Profilen din er privat. Ingen kan sjå han.' },
  { title: 'Ingen konkurranse', desc: 'Ingen som konkurrerer om di oppmerksomheit.' },
];

const whyExist = [
  { 
    title: 'Datingkultur er brotten', 
    desc: 'Dei største plattformene i verda tjenar pengar på at du forblir aleine. Dei vil ha så mange brukarar som mogleg — så lenge du ikkje finn nokon. Det er ein modell som aktivt skadar menneske.' 
  },
  { 
    title: 'Overflatefokus øydelegger djupde', 
    desc: 'Når utseende blir det viktigaste, forsvinn personlegdom, verdier og emosjonar. ToSom byggjer på det som faktisk betyr noko i ein relasjon.' 
  },
  { 
    title: 'Menneske treng tryggleik', 
    desc: 'Forskning viser at tryggleik er forutsetninga for alt av nære relasjonar. Utan tryggleik — ingen sårbarheit. Utan sårbarheit — ingen kjærleik.' 
  },
];

const delivers = [
  { title: 'Éin match per 24 time', desc: 'Den beste kompatibiliteten, ikkje dei mange verste.' },
  { title: 'Guidet 30-dagers reise', desc: 'Ein strukturert veg frå fyrste møte til ekte forbindelse.' },
  { title: 'Privat profil', desc: 'Din djupaste profil — aldri synleg for andre. Berre match-motoren.' },
  { title: 'Resonans-matching', desc: 'Matcher basert på resonans, ikkje score.' },
  { title: 'Djupde og modenheit', desc: 'Alt på ToSom er designa for vaksne menneske.' },
  { title: 'Null stress, null jag', desc: 'Ingen overflate, ingen press, ingen støy.' },
];

const researchPoints = [
  { 
    title: 'Attachment-teori', 
    desc: 'Psykologar har vist at tryggleik er forutsetninga for nære relasjonar. Utan tryggleik — ingen sårbarheit. Utan sårbarheit — ingen kjærleik.' 
  },
  { 
    title: 'Overflate vs. djupde', 
    desc: 'Studiar viser at når utseende blir det viktigaste, forsvinn personlegdom, verdier og emosjonar. ToSom bygger på det som faktisk betyr noko.' 
  },
  { 
    title: 'Kvalitet over kvantitet', 
    desc: 'Psykologisk forskning viser at éin god match er verdt fleire dårlige. Fokuserer på éin person, ikkje titalls.' 
  },
];

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

export default function KviforPage() {
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
              className="mb-8"
              style={typographyToStyle('heading-lg')}
            >
              Kvifor velje ToSom?
            </h1>

            <p
              className="max-w-2xl mx-auto leading-relaxed mb-6"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Datingmarkedet er brukt av selskap som tjenar på at du forblir aleine. Dei vil ha så mange brukarar som mogleg — så lenge du ikkje finn nokon.
            </p>

            <p
              className="max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              ToSom er annerledes. Vi tjenar berre når du finn din person. Vårt motiv er difor heilt annerledes — og det pregar kvar eining på plattformen.
            </p>
          </div>
        </section>

        {/* ===== TO SOM ER IKKJE EN DATINGAPP ===== */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              ToSom er ikkje ein datingapp
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notFeatures.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-3"
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.text.primary,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...typographyToStyle('body-sm'),
                      color: color.text.secondary,
                    }}
                  >
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DET ER KVIFOR TO SOM EKISTERER ===== */}
        <section
          className="py-24 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Det er kvifor ToSom eksisterer
            </h2>

            <div className="space-y-8">
              {whyExist.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-4"
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
                    }}
                  >
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DET TO SOM LEVERER ===== */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Det ToSom leverer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {delivers.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-3"
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.text.primary,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...typographyToStyle('body-sm'),
                      color: color.text.secondary,
                    }}
                  >
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KVIFOR VI VALDE ROLEGHEIT ===== */}
        <section
          className="py-24 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Kvifor vi valde rolegheit
            </h2>

            <div className="space-y-8">
              {researchPoints.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-4"
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
                    }}
                  >
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="mb-6"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Første steg er ein privat profil
            </h2>
            <p
              className="mb-10 leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Ingen swipe. Ingen feed. Ingen jag. Berre du og din neste match.
            </p>
            <Link
              href="/onboarding/start"
              className="inline-flex items-center justify-center px-10 py-3.5 font-medium transition-all duration-300"
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
              Kom i gang
            </Link>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}