'use client';

import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const team = [
  { name: 'ToSom-teamet', role: 'Gründer', bio: 'Vi er eit lite team som trur på at ekte forbindelse er mogleg.' },
];

const values = [
  { title: 'Ro', desc: 'Vi skaper aldri stress. Alt på ToSom er designa for ro og tryggleik.' },
  { title: 'Verdighet', desc: 'Alle menneske fortener ei Plattform som respekterer dygd deira.' },
  { title: 'Forskning', desc: 'Vi byggjer på psykologisk forskning, ikkje trendy.' },
  { title: 'Privatliv', desc: 'Dine data er dine. Vi sel aldri, deler aldri, viser aldri.' },
];

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

export default function OmOssPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>Om ToSom</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              ToSom blei skapt av eit enekt: at ekte forbindelse er mogleg — når vi gir rom for det. Vi trur på rolegheit, verdighet og forskningsbasert matching.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Våre verdiar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, idx) => (
                <GlassCard key={idx}>
                  <h3 className="mb-3" style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>{v.title}</h3>
                  <p style={{ ...typographyToStyle('body-sm'), color: color.text.secondary }}>{v.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Teamet</h2>
            {team.map((t, idx) => (
              <GlassCard key={idx}>
                <h3 className="mb-2" style={{ ...typographyToStyle('heading-sm'), color: color.text.primary }}>{t.name}</h3>
                <p className="mb-3" style={{ ...typographyToStyle('body-sm'), color: color.brand.gold, fontStyle: 'italic' }}>{t.role}</p>
                <p style={{ ...typographyToStyle('body-sm'), color: color.text.secondary }}>{t.bio}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Vil du vere ein del av det?</h2>
            <p className="mb-10 leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Vi byggjer noko varig. Kom med oss.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}