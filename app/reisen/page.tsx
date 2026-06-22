'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   DATA — Reise-fasar
   ======================== */

const journeyPhases = [
  {
    day: 'Dag 1–14',
    title: 'Uten bilder — bygg tryggleik',
    desc: 'Dei fyrste 14 dagane er fokus på å byggje emosjonell forbindelse utan overflatefokus.',
    topics: ['Hvem er du egent?', 'Verdiar som binder', 'Kommunikasjon og nærheit'],
    color: 'blue',
  },
  {
    day: 'Dag 15–21',
    title: 'Med bilder — djupe samtalar',
    desc: 'No kan dere dele bilder og utforske djupe samtaletema.',
    topics: ['Sårbarheit', 'Frykt og styrke', 'Intimitet og romantikk'],
    color: 'gold',
  },
  {
    day: 'Dag 22–30',
    title: 'Felles reise — verktrueleg nærheit',
    desc: 'Den endelege fasen der dere bygger verktrueleg nærheit saman.',
    topics: ['Felles mål', 'Konflikt og løysing', 'Framtid og drømmer'],
    color: 'blue',
  },
];

const dailyElements = [
  { icon: '🔍', title: 'Refleksjonsspørsmål', desc: 'Daglege spørsmål som utfordrar dykkar forståing av kvarandre.' },
  { icon: '💬', title: 'Samtaletema', desc: 'Djupe emne som flyttar dykkar utover flateskallesamtaler.' },
  { icon: '✍️', title: 'Små oppgåver', desc: 'Kvardagseksersisar som byggjer tillit og forbindelse.' },
  { icon: '📊', title: 'Resonansmåling', desc: 'Visuell tilbakekopling på kor godt dere resonnerer saman.' },
];

const afterJourney = [
  { title: 'Fortsetje', desc: 'Paret kan velje å halde fram utan guiding.' },
  { title: 'Avslutte', desc: 'Paret kan velje å avslutte reisa på eigne vilkår.' },
  { title: 'Ny reise', desc: 'Paret kan starte en ny reise med en ny match.' },
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

export default function ReisenPage() {
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
        className="absolute top-32 right-0 w-[700px] h-[500px] pointer-events-none opacity-40"
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
              30 dagar som endrar alt
            </h1>

            <p
              className="max-w-2xl mx-auto leading-relaxed mb-6"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Når dere matcher, startar ein guided reise — designa for å bygge ekte forbindelse mellom to menneske.
            </p>

            <p
              className="max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Ingen swiping. Ingen distraksjonar. Berre dere og reisa di.
            </p>
          </div>
        </section>

        {/* ===== REISE-FASE ===== */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Reisa består av tre fasar
            </h2>

            <div className="space-y-8">
              {journeyPhases.map((phase, idx) => (
                <GlassCard key={idx}>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Dag-badge */}
                    <div
                      className="flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-center"
                      style={{
                        background: phase.color === 'gold'
                          ? 'rgba(212,175,55,0.1)'
                          : 'rgba(80,120,255,0.08)',
                        border: `1px solid ${phase.color === 'gold' ? 'rgba(212,175,55,0.2)' : 'rgba(80,120,255,0.15)'}`,
                        color: phase.color === 'gold' ? color.brand.gold : '#6A9BC7',
                      }}
                    >
                      <div style={{ fontSize: '12px' }}>{phase.day}</div>
                    </div>

                    {/* Innhald */}
                    <div className="flex-1">
                      <h3
                        className="mb-3"
                        style={{
                          ...typographyToStyle('heading-sm'),
                          color: color.text.primary,
                        }}
                      >
                        {phase.title}
                      </h3>
                      <p
                        style={{
                          ...typographyToStyle('body'),
                          color: color.text.secondary,
                          marginBottom: '16px',
                        }}
                      >
                        {phase.desc}
                      </p>

                      {/* Tema */}
                      <div className="flex flex-wrap gap-2">
                        {phase.topics.map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: phase.color === 'gold'
                                ? 'rgba(212,175,55,0.08)'
                                : 'rgba(80,120,255,0.06)',
                              border: `1px solid ${phase.color === 'gold' ? 'rgba(212,175,55,0.15)' : 'rgba(80,120,255,0.12)'}`,
                              color: phase.color === 'gold' ? color.brand.gold : '#6A9BC7',
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DAGLIG STRUKTUR ===== */}
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
              Kva skjer kvar dag?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dailyElements.map((el, idx) => (
                <GlassCard key={idx}>
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{el.icon}</div>
                  <h3
                    className="mb-2"
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.text.primary,
                    }}
                  >
                    {el.title}
                  </h3>
                  <p
                    style={{
                      ...typographyToStyle('body-sm'),
                      color: color.text.secondary,
                    }}
                  >
                    {el.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ETTER 30 DAGAR ===== */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Kva skjer etter 30 dagar?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {afterJourney.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-3"
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
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
              Berre éin match. Men éin som faktisk passar.
            </h2>
            <p
              className="mb-10 leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Klar for ei reise som faktisk betyr noko?
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