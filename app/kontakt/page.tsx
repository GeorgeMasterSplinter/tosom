'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const faqs = [
  { q: 'Kva skjer med databene mine?', a: 'Alle svarene dine er krypterte og aldri synlege for andre brukarar. Vi sel aldri data til tredjepart.' },
  { q: 'Kan eg slette kontoen min?', a: 'Ja, du kan når som helst slette kontoen din og alle databer. Det er ditt rett.' },
  { q: 'Kor lang tid tar det å få ein match?', a: 'Du får éin match kvar 24. time. Match-motor køyra automatisk.' },
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

export default function KontaktPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}
      />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>Kontakt oss</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Har du spørsmål? Vi er her for deg. Skriv oss ei melding, og vi svarer innan 24 timar.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <GlassCard>
              <h2 className="mb-8" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Skriv ei melding</h2>
              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: color.text.secondary }}>Namn</label>
                  <input type="text" className="w-full" style={{ ...typographyToStyle('body'), background: 'rgba(255,255,255,0.03)', border: `1px solid ${color.glass.border}`, borderRadius: `${radius.md}px`, padding: '12px 16px', color: color.text.primary }} placeholder="Ditt namn" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: color.text.secondary }}>E-post</label>
                  <input type="email" className="w-full" style={{ ...typographyToStyle('body'), background: 'rgba(255,255,255,0.03)', border: `1px solid ${color.glass.border}`, borderRadius: `${radius.md}px`, padding: '12px 16px', color: color.text.primary }} placeholder="din@epost.no" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: color.text.secondary }}>Melding</label>
                  <textarea className="w-full" rows={5} style={{ ...typographyToStyle('body'), background: 'rgba(255,255,255,0.03)', border: `1px solid ${color.glass.border}`, borderRadius: `${radius.md}px`, padding: '12px 16px', color: color.text.primary }} placeholder="Skriv meldinga di her..." />
                </div>
                <button type="submit" className="w-full py-3.5 font-medium transition-all duration-300" style={{ ...typographyToStyle('cta'), background: color.brand.gold, color: '#0B1520', borderRadius: `${radius.md}px`, boxShadow: `0 0 30px ${color.ambient.gold.medium}` }}>
                  Send melding
                </button>
              </form>
            </GlassCard>
          </div>
        </section>

        <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Vanlege spørsmål</h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <GlassCard key={idx}>
                  <h3 className="mb-2" style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>{faq.q}</h3>
                  <p style={{ ...typographyToStyle('body-sm'), color: color.text.secondary }}>{faq.a}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Spørsmål? Vi er her for deg.</h2>
            <Link href="/onboarding/start" className="inline-flex items-center justify-center px-10 py-3.5 font-medium transition-all duration-300" style={{ ...typographyToStyle('cta'), background: color.brand.gold, color: '#0B1520', borderRadius: `${radius.md}px`, boxShadow: `0 0 30px ${color.ambient.gold.medium}` }}>
              Kom i gang
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}