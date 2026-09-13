'use client';

/**
 * ToSom — Tips
 *
 * En kort, ærlig side med praktiske råd: en god profil, en god match og
 * en reise dere bruker vel. Tonen er veiviser, ikke fasit — vi lover ikke
 * resultat, vi lover ærlighet.
 */

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconJourney() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ========================
   SEKSJONER
   ======================== */

const tipsSections: Array<{
  icon: React.ReactNode;
  title: string;
  intro: string;
  points: string[];
}> = [
  {
    icon: <IconProfile />,
    title: 'En ærlig, konkret profil',
    intro: 'Profilen er det matchingen bygger på. Jo mer ærlig og konkret du er, jo bedre passer den du blir matchet med.',
    points: [
      "Svar ærlig — ikke «flott». Det er de reelle svarene som gir en match som faktisk passer.",
      'Fyll inn de praktiske feltene (barn, røyking, tro, livsstil). Tomt felt gir nøytral poeng.',
      'Hold «om deg» kort og konkret — en liten detalj forteller mer enn en lang generalisering.',
      'Oppdater profilen din når livet endrer seg.',
    ],
  },
  {
    icon: <IconMatch />,
    title: 'Øk sjansen for en god match',
    intro: 'Vi kobler én person til deg hver lørdag. Du påvirker kvaliteten — gjennom ærlighet, ikke gjetteri.',
    points: [
      'Ha profilen din klar før matchrunden, så er du med.',
      'Matchingen vektlegger verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon.',
      'Dealbreakere (barn, modenhetsnivå, avstand) jobber for deg — da matcher vi deg med noen som faktisk passer.',
      'En match er et utgangspunkt, ikke en dom. Du bestemmer alltid selv.',
    ],
  },
  {
    icon: <IconJourney />,
    title: 'Bruk reisen — rolig og kreativt',
    intro: 'De 30 dagene er en struktur for trygghet, ikke en øvelse i å imponere.',
    points: [
      'Gjør de daglige små oppgavene med mening — de er laget for å bygge resonans.',
      'Ikke rus. Strukturen er ment å gi deg og den andre rom.',
      'Bruk oppgavene som samtalestoff — de er skrevet for å få dere i gang.',
      'Vær proaktiv, men gi plass.',
    ],
  },
  {
    icon: <IconCalendar />,
    title: 'Konkrete råd: dates og tidspunkt',
    intro: 'Når dere har blitt kjent, gjør dere det enkelt for hverandre.',
    points: [
      'Foreslå konkret: en dag, en tid og et sted — ikke «når det passer».',
      'Planlegg 2–3 korte, lavterskel-treff utover ukene (kaffe eller en tur først), ikke én stor begivenhet.',
      'Gjør det enkelt: lite forpliktelse, kjent sted, en tid som passer begge.',
      'Sett av en mild sjekk inn (f.eks. etter to uker) for å se hvordan det føles.',
    ],
  },
];

/* ========================
   PAGE COMPONENT
   ======================== */

export default function TipsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — blue */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6 text-center space-y-6"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Slik får du mest ut av reisen
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
              lineHeight: '1.8',
            }}
          >
            Et par enkle råd — om profilen, matchingen og selve reisen. Målet er ro og ærlighet, ikke å «optimere» deg til å se best mulig ut.
          </p>
        </ToSomSection>

        {/* ===== TIPS-SEKSJONER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {tipsSections.map((section, idx) => (
              <GlassCard key={idx} padding="xl" gold interactive className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {section.icon}
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-md'),
                      color: color.brand.gold,
                    }}
                  >
                    {section.title}
                  </h3>
                </div>
                <p
                  style={{
                    ...typographyToStyle('body-lg'),
                    color: color.text.secondary,
                    lineHeight: '1.8',
                  }}
                >
                  {section.intro}
                </p>
                <div className="space-y-2">
                  {section.points.map((point, pIdx) => (
                    <p
                      key={pIdx}
                      style={{
                        ...typographyToStyle('body'),
                        color: color.text.secondary,
                        lineHeight: '1.6',
                      }}
                    >
                      <span className="text-[#D4AF37] mr-2">✦</span>
                      {point}
                    </p>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </ToSomSection>

        {/* ===== GULL-LINJE ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl text-center"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: '32px',
            }}
          >
            <h2
              style={{
                ...typographyToStyle('heading-md'),
                color: color.brand.gold,
                marginBottom: '12px',
              }}
            >
              Veiviser, ikke fasit
            </h2>
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Tipset her er veiviser, ikke fasit. Tosom lover ikke at du får en match — vi lover at matchingen er ærlig, og at du alltid har kontroll.
            </p>
          </div>
        </ToSomSection>

        {/* ===== CTA ===== */}
        <ToSomSection
          spotlight="cta"
          className="px-6 text-center space-y-6"
        >
          <h2
            style={{
              ...typographyToStyle('heading-lg'),
              color: color.text.primary,
            }}
          >
            Klar til å starte?
          </h2>

          <p
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Lag profilen din i ditt eget tempo og møt én person, valgt med omtanke.
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