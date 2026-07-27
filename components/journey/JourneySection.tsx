/**
 * ToSom — JourneySection (Unified Premium Dashboard)
 * 
 * 30-dagers reise med kalender, refleksjon og neste-dag-knapp.
 * Bruker design-tokens konsekvent.
 * Bokmål tekstmodell.
 */

'use client';

import { color, radius, shadow, spacing, typography } from '@/config/design-tokens';
import PremiumButton from '@/components/ui/PremiumButton';

interface JourneySectionProps {
  currentDay: number;
  daysCompleted: number;
  phaseLabel: string;
}

/** Refleksjonstekst basert på dag (bokmål) */
function getReflectionText(day: number): string {
  if (day <= 14) {
    // Dag 1-14: rolige, lette refleksjoner
    const reflections = [
      'I dag handler det om å kjenne etter hva som gir deg ro i møte med nye mennesker.',
      'Ta deg et øyeblikk til å tenke på når du sist følte deg truly sett.',
      'Hva er det ved din egen historie som du er mest stolt av?',
      'Tenk på en plass som gjør deg tryggen. Hva er det ved den plassen som betyr mest for deg?',
      'I dag kan du utforske hva som får deg til å le — uten grunn.',
      'Hva er noe du ønsker at noen skulle spørre deg om?',
      'Tenk på en god samtale du har hatt. Hva gjorde den så spesiell?',
      'Hva er det første du legger merke til hos noen du møter?',
      'Reflekter over når du sist følte deg virkelig forstått.',
      'Hva gir energi til deg i møte med ukjente mennesker?',
      'Tenk på en tid du sto over noe vanskelig. Hva hjalp deg fram?',
      'I dag handler det om å lytte til den stille stemmen inni deg selv.',
      'Hva tror du partneren din legger merke til først?',
      'Nyd stillheten. I den finner du ofte de beste svarene.',
    ];
    return reflections[day - 1] || reflections[0];
  }

  // Dag 15-30: dypere refleksjoner
  const reflections = [
    'I dag kan du utforske hva som gjør deg trygg i møte med andre — og hva som krev mot.',
    'Tenk på en verdi du aldri kompromisser med. Hvorfor er den viktig for deg?',
    'Hva tror du din partner vil si at de setter mest pris på ved dere?',
    'Reflekter over når du sist vågde å være sårbart. Hva skjedde etterpå?',
    'Hva må du slippe for å gi rom for noe nytt i relasjoner?',
    'Tenk på en tid du sto over noe viktig. Hva lærte du om deg selv?',
    'I dag handler det om å se gjennom partnerens øyne — hva ser du?',
    'Hva er noe du har endret syn på gjennom årene?',
    'Reflekter over stillheten sammen med partneren din. Hva finnes der?',
    'Tenk på en drøm du ennå ikke har fortalt noen om.',
    'Hva trenger du for å føle deg virkelig sett av partneren din?',
    'I dag kan du utforske hva tålmodighet betyr i en voksende relasjon.',
    'Hva er noe du aldri har latt noen se — og vil gjøre nå?',
    'Reflekter over når tillit ble testet, og hvordan den stod igjen. Eller forsvant.',
  ];
  const idx = Math.min(day - 15, reflections.length - 1);
  return reflections[idx] || reflections[0];
}

const JourneySection = ({ currentDay, daysCompleted, phaseLabel }: JourneySectionProps) => {
  // Dag status: completed / current / future
  const getDayStatus = (day: number): 'completed' | 'current' | 'future' => {
    if (day < currentDay) return 'completed';
    if (day === currentDay) return 'current';
    return 'future';
  };

  return (
    <div
      className="w-full rounded-2xl p-6 md:p-8"
      style={{
        background: color.glass['bg'],
        border: `1px solid ${color.glass.border}`,
        borderRadius: `${radius.xl}px`,
      }}
    >
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
          color: color.text.secondary,
        }}
      >
        Hver dag gir en ny mulighet til å forstå deg selv og partneren din.
      </p>

      {/* Kalender — 30 dager (5 rader x 6 kolonner) */}
      <div className="mb-8 grid grid-cols-6 gap-2 md:gap-3">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
          const status = getDayStatus(day);
          const isBildeDag = day === 14;

          return (
            <div
              key={day}
              className="relative flex items-center justify-center rounded-lg transition-all duration-300"
              style={{
                width: '100%',
                paddingBottom: '100%', // kvadratisk
                background: status === 'current'
                  ? `linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']})`
                  : status === 'completed'
                    ? color.glass['bg-active']
                    : 'rgba(255, 255, 255, 0.03)',
                border: isBildeDag
                  ? `2px solid ${color.brand.gold}`
                  : `1px solid ${color.border.default}`,
                opacity: status === 'future' ? 0.4 : 1,
                cursor: status !== 'future' ? 'pointer' : 'default',
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: `${typography.fontSize.xs}px`,
                  fontWeight: status === 'current' ? typography.fontWeight.bold : typography.fontWeight.regular,
                  color: status === 'current' ? color.bg.primary : color.text.secondary,
                }}
              >
                {day}
              </span>

              {/* Bilde-dag marker */}
              {isBildeDag && (
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: color.brand.gold }}
                >
                  <span style={{ fontSize: '8px', color: color.bg.primary }}>★</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dagens refleksjon */}
      <div
        className="mb-6 p-4 rounded-xl"
        style={{
          background: 'rgba(212, 175, 55, 0.04)',
          border: `1px solid rgba(212, 175, 55, 0.1)`,
          borderRadius: `${radius.lg}px`,
        }}
      >
        <p
          className="mb-2"
          style={{
            fontSize: '14px',
            fontWeight: typography.fontWeight.medium,
            color: color.brand.gold,
          }}
        >
          Dagens refleksjon
        </p>
        <p
          style={{
            fontSize: `${typography.fontSize.base}px`,
            lineHeight: typography.lineHeight.normal,
            color: color.text.primary,
            fontStyle: 'italic',
          }}
        >
          "{getReflectionText(currentDay)}"
        </p>
      </div>

      {/* Neste dag-knapp */}
      {currentDay < 30 && (
        <PremiumButton
          variant="primary"
          size="lg"
          className="min-h-[52px] rounded-xl justify-center px-6 py-3 text-base font-semibold"
          style={{
            background: `linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']})`,
            color: color.bg.primary,
            boxShadow: shadow.gold,
          }}
        >
          Neste dag →
        </PremiumButton>
      )}

      {currentDay >= 30 && (
        <p
          className="text-base"
          style={{
            color: color.text.secondary,
            fontStyle: 'italic',
          }}
        >
          Reisen din er fullført. Ta deg tid til å reflektere over veien dere har gått sammen.
        </p>
      )}
    </div>
  );
};

export default JourneySection;
