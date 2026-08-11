'use client';

import { color, radius, shadow, typography } from '@/config/design-tokens';
import PremiumButton from '@/components/ui/PremiumButton';

/* ═══════════════════════════════════════
   Journey Section — Forenklet "Veileder"
   ═══════════════════════════════════════ */

interface JourneySectionProps {
  currentDay: number;
  daysCompleted: number;
  phaseLabel: string;
}

/* ═══════════════════════════════════════
   Fase-definisjonar
   ═══════════════════════════════════════ */

const phases = [
  { label: 'Oppdage', days: '1–7', start: 1, end: 7 },
  { label: 'Lære hverandre', days: '8–14', start: 8, end: 14 },
  { label: 'Dybde', days: '15–23', start: 15, end: 23 },
  { label: 'Forpliktelse', days: '24–30', start: 24, end: 30 },
];

function getCurrentPhase(day: number): string {
  for (const phase of phases) {
    if (day >= phase.start && day <= phase.end) return phase.label;
  }
  return 'Ferdig';
}

/* ═══════════════════════════════════════
   Veileder-tekst per dag
   Kort tema + handledande spørsmål
   ═══════════════════════════════════════ */

function getDayGuide(day: number): { theme: string; question: string; note?: string } {
  const guides: Record<number, { theme: string; question: string; note?: string }> = {
    // Oppdage-fasen (dag 1-7)
    1: { theme: 'Hvorfor er du her?', question: 'Hva var det som fikk deg til å opprette en profil på ToSom? Hva søker du?', note: 'Start med å dele dine egentlige motivar' },
    2: { theme: 'Hva betyr trygghet for deg?', question: 'Hva trenger du av en partner for å føle deg trygg?' },
    3: { theme: 'Dine viktigste verdier', question: 'Navn tre verdier som styrer livet ditt — og hvorfor nettopp de.' },
    4: { theme: 'Når ble du virkelig glad?', question: 'Hva skapte den følelsen? Hva gjor at det har satt seg?' },
    5: { theme: 'Stille stunder', question: 'Hvor føler du deg mest deg selv — når er du helt deg sjølv?' },
    6: { theme: 'Vaner og rutiner', question: 'Hva ser en vanlig dag for deg ut? Hva fungerer, hva vil du endre?' },
    7: { theme: 'Samtaler', question: 'Tenk på en god samtale du har hatt. Hva gjorde den så spesiell?' },

    // Lære hverandre-fasen (dag 8-14)
    8: { theme: 'Hva gir deg energi?', question: 'Er det mennesker, natur, skapande arbeid, eller noe annet?' },
    9: { theme: 'Hvem har formet deg?', question: 'Hvem i familien eller livet ditt har hatt størst innflytelse på deg?' },
    10: { theme: 'Å leve ut', question: 'Hva er noe du alltid har villet prøve — men ennå ikke har gjort?' },
    11: { theme: 'Konflikter og forskjeller', question: 'Hvordan håndterer du det når dere er uenige? Hva trenger du av partneren da?' },
    12: { theme: 'Å vise følelser', question: 'Hvordan viser du noe du brenner for — eller holder du det inne til først noen stoler på deg?' },
    13: { theme: 'Drømmer og visjoner', question: 'Hvis alt kunne blitt som du ville — hva hadde da vært annerledes om 5 år?' },
    14: { theme: 'Fysisk tiltrukning', question: 'Hva tenker du om fysisk nærhet i et nytt forhold?', note: '💛 Dette er eit naturlig sted å vise bilder dersom dere ønsker det. Helt greit å vente — eller ikke vise noe i det hele tatt.' },

    // Dybde-fasen (dag 15-23)
    15: { theme: 'Å stole', question: 'Hva trenger du for virkelig å stole på noen? Kan tillit bygges raskt, eller må den vokse?' },
    16: { theme: 'Sårbarhet', question: 'Når var du sist sårbar mot noen? Hva skjedde etterpå — godt eller vondt?' },
    17: { theme: 'Drømmer sammen', question: 'Hva ønsker du at dere skal ha bygt sammen om 5 år? Et hjem, reiser, erfaringer?' },
    18: { theme: 'Å gi og ta', question: 'Hvordan vet du når du gir for mye — eller tar for lite i et forhold?' },
    19: { theme: 'Livets vanskelige øyeblikk', question: 'Hva gjør du når ting blir vanskelig? Trekker du deg, åpner du deg, eller stenger du henne ute?' },
    20: { theme: 'Framtidsvisjon', question: 'Hvordan forestiller du deg et godt liv om ti år? Hvilken rolle spiller partneren der?' },
    21: { theme: 'Å si nei', question: 'Hva er noen grenser du har lært at det er viktig å sette — og hvorfor?' },
    22: { theme: 'Tåre og latter', question: 'Hva får deg til å grine? Hva får deg til å le så magen gjør vondt?' },
    23: { theme: 'Å være partner', question: 'Hva tror du er det viktigste du bidrar med som partner i et forhold?' },

    // Forpliktelsesfasen (dag 24-30)
    24: { theme: 'Sammen eller hver for seg', question: 'Hvordan balanserer du fellesskap og egenrom — og hva trenger dere av hverandre?' },
    25: { theme: 'Å møte fremtiden', question: 'Hva er det største skreddet dere står over som par?' },
    26: { theme: 'Grunnlighet', question: 'Hva ønsker du å si til partneren din som takk for reisen deres så langt?' },
    27: { theme: 'Å fortsette å vokse', question: 'Hvordan vil dere gjøre det godt — selv når hverdagen blir hverdag?' },
    28: { theme: 'Å gi slipp på frykt', question: 'Er det en frykt du har med deg fra tidligere forhold? Har den endret seg her?' },
    29: { theme: 'Din mest ærlige refleksjon', question: 'Hva har denne reisen lært deg om deg selv og hva du trenger?' },
    30: { theme: 'Nå videre — sammen?', question: 'Tre år inn i framtiden — hva ønsker du at dere to har oppnådd?' },
  };

  // Default for days not in map (shouldn't happen, but fallback)
  return guides[day] || {
    theme: 'Refleksjon',
    question: 'Hva har den dagen betydning for deg? Del gjerne med partneren din.',
  };
}

const JourneySection = ({ currentDay, daysCompleted, phaseLabel }: JourneySectionProps) => {
  const guide = getDayGuide(currentDay);
  const currentPhase = getCurrentPhase(currentDay);

  return (
    <div
      className="w-full rounded-2xl p-6 md:p-8"
      style={{
        background: 'rgba(10, 26, 58, 0.4)',
        border: `1px solid rgba(212, 175, 55, 0.12)`,
        borderRadius: `${radius.xl}px`,
      }}
    >
      {/* ═══ Fase-indikatorar (chips) ═══ */}
      <div className="flex flex-wrap gap-2 mb-6">
        {phases.map((phase) => {
          const isActive = currentPhase === phase.label;
          return (
            <div
              key={phase.label}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))`
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isActive ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.4)',
              }}
            >
              {phase.label} <span className="opacity-60">{phase.days}</span>
            </div>
          );
        })}
      </div>

      {/* Tittel */}
      <h2
        className="mb-1"
        style={{
          fontSize: `${typography.fontSize['2xl']}px`,
          fontWeight: typography.fontWeight.semibold,
          color: color.text.primary,
        }}
      >
        Din reise — dag {currentDay} av 30
      </h2>
      <p
        className="mb-6"
        style={{
          fontSize: `${typography.fontSize.base}px`,
          lineHeight: typography.lineHeight.normal,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        {getCurrentPhase(currentDay) === 'Oppdage' && 'Utforsk hverandre — små steg, store inntrykk.'}
        {getCurrentPhase(currentDay) === 'Lære hverandre' && 'Dybde og nærvær — lær hva som gjør partneren unik.'}
        {getCurrentPhase(currentDay) === 'Dybde' && 'Sårbarhet og tillit — bygge noe ekte sammen.'}
        {getCurrentPhase(currentDay) === 'Forpliktelse' && 'Forpliktelse og framtid — tenk på veien videre.'}
        {getCurrentPhase(currentDay) === 'Ferdig' && 'Reisen er fullført. Ta deg tid til å reflektere over veien.'}
      </p>

      {/* ═══ Progress-bar (enkelt, ikke 30 bokser) ═══ */}
      <div className="mb-8">
        <div
          className="relative h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
        >
          {/* Full progress */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(currentDay / 30) * 100}%`,
              background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            }}
          />

          {/* Current day marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg transition-all duration-500"
            style={{
              left: `calc(${(currentDay / 30) * 100}% - 10px)`,
              background: '#D4AF37',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)',
            }}
          >
            {/* Puls-animasjon */}
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { box-shadow: 0 0 12px rgba(212, 175, 55, 0.5); }
                50% { box-shadow: 0 0 24px rgba(212, 175, 55, 0.8); }
              }
            `}</style>
          </div>
        </div>

        {/* Dager under bar */}
        <div className="flex justify-between mt-2">
          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.3)' }}>Dag 1</span>
          <span style={{ fontSize: '10px', color: '#D4AF37', fontWeight: 600 }}>{currentPhase}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.3)' }}>Dag 30</span>
        </div>
      </div>

      {/* ═══ Dagens veileder ═══ */}
      <div
        className="mb-6 p-5 rounded-xl"
        style={{
          background: 'rgba(212, 175, 55, 0.06)',
          border: `1px solid rgba(212, 175, 55, 0.18)`,
          borderRadius: `${radius.lg}px`,
        }}
      >
        {/* Tema + dag */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4AF37' }}
          />
          <p
            style={{
              fontSize: '14px',
              fontWeight: typography.fontWeight.semibold,
              color: '#D4AF37',
            }}
          >
            📍 Dag {currentDay} — {guide.theme}
          </p>
        </div>

        {/* Hovudspørsmål */}
        <p
          className="mb-3"
          style={{
            fontSize: `${typography.fontSize.base}px`,
            lineHeight: typography.lineHeight.normal,
            color: color.text.primary,
          }}
        >
          {guide.question}
        </p>

        {/* Merknad (valgfritt, f.eks bilde-dag) */}
        {guide.note && (
          <p
            style={{
              fontSize: `${typography.fontSize.sm}px`,
              lineHeight: typography.lineHeight.normal,
              color: 'rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic',
            }}
          >
            {guide.note}
          </p>
        )}

        {/* Call-to-action hint */}
        <p
          className="mt-4"
          style={{
            fontSize: `${typography.fontSize.sm}px`,
            color: 'rgba(212, 175, 55, 0.7)',
            fontWeight: typography.fontWeight.medium,
          }}
        >
          💡 Del svar med partneren din i chatten — og spør om hennes/hans!
        </p>
      </div>

      {/* Neste dag-knapp */}
      {currentDay < 30 && (
        <PremiumButton
          variant="primary"
          size="lg"
          className="min-h-[52px] rounded-xl justify-center px-6 py-3 text-base font-semibold w-full"
          style={{
            background: `linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']})`,
            color: color.bg.primary,
            boxShadow: shadow.gold,
          }}
        >
          Neste dag → Dag {currentDay + 1}
        </PremiumButton>
      )}

      {currentDay >= 30 && (
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: `1px solid rgba(212, 175, 55, 0.2)`,
          }}
        >
          <p
            className="text-base font-medium"
            style={{ color: color.text.primary }}
          >
            🎉 Reisen din er fullført!
          </p>
          <p
            className="mt-1"
            style={{
              fontSize: `${typography.fontSize.sm}px`,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Ta deg tid til å reflektere over veien dere har gått sammen.
          </p>
        </div>
      )}
    </div>
  );
};

export default JourneySection;