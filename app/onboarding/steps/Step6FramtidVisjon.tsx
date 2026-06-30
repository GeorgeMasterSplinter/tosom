/**
 * ToSom — Steg 6: Framtid & visjon
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

export default function Step6FramtidVisjon({ step, goToStep, data, onChange, onNext }: Props) {
  const val = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hvordan ser en god framtid ut for deg?"
        name="futureVision"
        value={val('futureVision', '')}
        onChange={(e) => onChange('futureVision', e.target.value)}
        placeholder="Hva drømmer du om å oppnå i livet?"
        exampleText="En rolig, men meningsfull tilværelse med dype relasjoner og kreativitet."
      />
      <TextAreaField
        label="Hva er en drøm du jobber mot?"
        name="dreamGoal"
        value={val('dreamGoal', '')}
        onChange={(e) => onChange('dreamGoal', e.target.value)}
        placeholder="Noe du jobber hardt for å nå — nå eller seinere?"
        exampleText="Å bygge et eget studio der jeg kan arbeide fritt."
      />
      <TextAreaField
        label="Hva vil du bygge sammen med en partner?"
        name="buildTogether"
        value={val('buildTogether', '')}
        onChange={(e) => onChange('buildTogether', e.target.value)}
        placeholder="Hva ønsker du å skape sammen med noen?"
        exampleText="En trygg base, felles erfaringer, et liv med mening."
      />
      <TextAreaField
        label="Hva vil du oppleve på egen hånd?"
        name="experienceAlone"
        value={val('experienceAlone', '')}
        onChange={(e) => onChange('experienceAlone', e.target.value)}
        placeholder="Noe du vil oppleve alene — og som er viktig for deg?"
        exampleText="Å reise alene, utfordre meg selv, finne ro inni meg."
      />
      <TextAreaField
        label="Hva vil du oppleve som par?"
        name="experienceTogether"
        value={val('experienceTogether', '')}
        onChange={(e) => onChange('experienceTogether', e.target.value)}
        placeholder="Hva ønsker du å oppleve sammen med en partner?"
        exampleText="Å lage et hjem, reise verden rundt, bygge noe varig."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Framtidsønsker viser veien for hvilken relasjon som passer deg best.
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