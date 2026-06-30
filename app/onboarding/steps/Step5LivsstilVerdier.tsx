/**
 * ToSom — Steg 5: Livsstil & verdier
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

export default function Step5LivsstilVerdier({ step, goToStep, data, onChange, onNext }: Props) {
  const val = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hva står øverst på prioriteringslista di?"
        name="highPriority"
        value={val('highPriority', '')}
        onChange={(e) => onChange('highPriority', e.target.value)}
        placeholder="Hva gir livet innhold og mening for deg?"
        exampleText="Familiene, kreativt arbeid, natur, spiritualitet."
      />
      <TextAreaField
        label="Hva gir du lite rom for — akkurat nå?"
        name="lowPriority"
        value={val('lowPriority', '')}
        onChange={(e) => onChange('lowPriority', e.target.value)}
        placeholder="Hva har du valgt bort eller redusert?"
        exampleText="Sosial media, overfladige relasjoner, mas med folk."
      />
      <TextAreaField
        label="Hvordan ser en god hverdag ut for deg?"
        name="goodEveryday"
        value={val('goodEveryday', '')}
        onChange={(e) => onChange('goodEveryday', e.target.value)}
        placeholder="Beskriv en ideell hverdag — fra morgen til kveld."
        exampleText="Våkne uten stress, god frokost, arbeide med noe som gir meg energi."
      />
      <TextAreaField
        label="Hva er en livsstil du drømmer om?"
        name="desiredLifestyle"
        value={val('desiredLifestyle', '')}
        onChange={(e) => onChange('desiredLifestyle', e.target.value)}
        placeholder="Hva drømmer du om å leve?"
        exampleText="Ro i hverdagen, nære relasjoner, rom for vekst."
      />
      <TextAreaField
        label="Hva ønsker du å unngå i en relasjon?"
        name="undesiredLifestyle"
        value={val('undesiredLifestyle', '')}
        onChange={(e) => onChange('undesiredLifestyle', e.target.value)}
        placeholder="Hva ønsker du absolutt ikke å oppleve?"
        exampleText="Spill, press, overfladiske dynamikker."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Livsstilssvarene dine hjelper oss å finne noen som trives i hverdagen sammen med deg.
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