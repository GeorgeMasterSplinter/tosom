'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconResearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3V21M9 17H15M9 3H15M9 3L7 6M9 3L11 6" />
      <path d="M16 21V13" />
    </svg>
  );
}

function IconTime() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ========================
   BLOGG-ARTIKKEL-DATA
   ======================== */

const articles = [
  {
    dato: '24. juni 2026',
    lesetid: '5 min',
    kategori: 'Relasjonsmodeller',
    tittel: 'Hvorfor kompatibilitet betyr mer enn utseende',
    excerpt: 'Studier viser at verdier, livsstil og emosjonelle mønstre er langt sterkere indikatorer på varige relasjoner enn det ytre.',
    reference: 'Fetvedt, G. (2018). Kjærlighetsforskning: Hva bygger varige relasjoner? Universitetsforlaget.',
    icon: <IconResearch />,
  },
  {
    dato: '20. juni 2026',
    lesetid: '4 min',
    kategori: 'Tid og nærhet',
    tittel: 'Hvorfor 30 dager er den perfekte tidsrammen',
    excerpt: 'Psykologer har lenge observert at det ofte tar rundt 30 dager for to menneske å bygge ekte tillit og en stabil forbindelse.',
    reference: 'Reisner, A. & McAndrew, C. (2022). The Psychology of Time in Relationship Formation. Journal of Social and Personal Relationships, 39(4), 890–912.',
    icon: <IconTime />,
  },
  {
    dato: '15. juni 2026',
    lesetid: '3 min',
    kategori: 'Emosjonell trygghet',
    tittel: 'Hvorfor ro er vår viktigste funksjon',
    excerpt: 'I en verden der datingapper konstant konkurrerer om oppmerksomheten din, valgte Tosom en annan vei — en roligare, tryggere og mer mennesleg tilnærming.',
    reference: 'Gottman, J.M. (1999). The Seven Principles for Making Marriage Work. Crown Publishing.',
    icon: <IconHeart />,
  },
];

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
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <ToSomSection spotlight="blue" className="px-6 text-center space-y-6">
          <h1 style={{ ...typographyToStyle('hero'), color: color.text.primary }}>
            Blogg
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
          >
            I bloggen deler vi innsikt om relasjoner, emosjonell trygghet og langsomme, meningsfulle forbindelser.
          </p>
        </ToSomSection>

        {/* ===== OM BLOGGEN ===== */}
        <ToSomSection spotlight="soft" className="px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <GlassCard padding="xl" gold interactive className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                  <IconBook />
                </div>
                <div className="space-y-3">
                  <h2 style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>
                    Om denne bloggen
                  </h2>
                  <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                    Alle artiklene bygger på etablerte relasjonsmodeller og vår erfaring med å bygge en plattform for ekte menneskelige relasjoner. Vi tror at kunnskap er grunnen til trygge relasjoner — og at ro og dybde alltid vil vinne over støy og overflate.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== ARTIKLER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center mb-6" style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Siste artikler
            </h2>

            <div className="space-y-6">
              {articles.map((art, idx) => (
                <GlassCard key={idx} padding="xl" gold interactive className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                      {art.icon}
                    </div>
                    <div>
                      <p style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}>
                        {art.dato} · {art.lesetid} · {art.kategori}
                      </p>
                    </div>
                  </div>

                  <h3 style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>
                    {art.tittel}
                  </h3>

                  <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
                    {art.excerpt}
                  </p>

                  <p style={{ ...typographyToStyle('body-sm'), color: 'rgba(255,255,255,0.50)', fontStyle: 'italic' }}>
                    📖 <em>{art.reference}</em>
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== CTA ===== */}
        <ToSomSection spotlight="cta" className="px-6 text-center space-y-6">
          <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
            Klar til å starte?
          </h2>
          <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
            Lag profilen din i ditt eget tempo og møt én person, valgt med omtanke — på ordentlig.
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