/**
 * ToSom — Steg 7: Lek, humor & personlighet
 * Knappar: PremiumButton + BackButton.
 */

'use client';

import { TextAreaField } from '../components/TextAreaField';
import { PremiumButton } from '@/components/onboarding/PremiumButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  step: number;
  goToStep: (s: number) => void;
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onNext: () => void;
}

export default function Step7HumorPersonlighet({ step, goToStep, data, onChange, onNext }: Props) {
  const val = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hva får deg til å le — ekte og høyt?"
        name="laughterTrigger"
        value={val('laughterTrigger', '')}
        onChange={(e) => onChange('laughterTrigger', e.target.value)}
        placeholder="Hva finner du virkelig morsomt?"
        exampleText="Indirekte humor, absurde situasjoner, og nyskapende komedier."
      />
      <TextAreaField
        label="Hva er en spesiell vane eller egenskap du har?"
        name="quirkyHabit"
        value={val('quirkyHabit', '')}
        onChange={(e) => onChange('quirkyHabit', e.target.value)}
        placeholder="Hva er unikt med deg som du kanskje bare merker med nære venner?"
        exampleText="Jeg har en liste over alle de rreste fakta jeg finner på."
      />
      <TextAreaField
        label="Hva er et guilty pleasure?"
        name="guiltyPleasure"
        value={val('guiltyPleasure', '')}
        onChange={(e) => onChange('guiltyPleasure', e.target.value)}
        placeholder="Noe du elsker — selv om det er litt skammfullt?"
        exampleText="Reality-TV på helga, eller karaoke når ingen ser."
      />
      <TextAreaField
        label="Hva føles mest autentisk for deg?"
        name="totallyYou"
        value={val('totallyYou', '')}
        onChange={(e) => onChange('totallyYou', e.target.value)}
        placeholder="Hva føler du er mest «deg» i alle situasjoner?"
        exampleText="Å være kreativ, være nysgjerrig, og vise omsorg på din egen måte."
      />
      <TextAreaField
        label="Hva vil partneren din finne mest morsomt med deg?"
        name="partnerWouldLaugh"
        value={val('partnerWouldLaugh', '')}
        onChange={(e) => onChange('partnerWouldLaugh', e.target.value)}
        placeholder="Hva er noe som kanskje er litt rart — men som du elsker?"
        exampleText="At jeg alltid finner på egne ord og uttrykk."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Disse små detaljene — som humor — er det som gjør deg til deg.
      </p>

      {/* Knappar */}
      <div className="space-y-4 mt-10">
        <BackButton onClick={() => goToStep(step - 1)} />
        <PremiumButton onClick={onNext}>
          Fortsett til neste steg
        </PremiumButton>
      </div>
    </div>
  );
}