/**
 * ToSom — Steg 3: Tilknytning & trygghet
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

export default function Step3Tilknytning({ step, goToStep, data, onChange, onNext }: Props) {
  const val = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hva får deg til å føle deg trygg i en relasjon?"
        name="safetyNeed"
        value={val('safetyNeed', '')}
        onChange={(e) => onChange('safetyNeed', e.target.value)}
        placeholder="Hva hjelper deg når du trenger trygghet?"
        exampleText="Å vite at partneren min er der når jeg trenger det."
      />
      <TextAreaField
        label="Hva gjør deg utrygg?"
        name="insecurityTrigger"
        value={val('insecurityTrigger', '')}
        onChange={(e) => onChange('insecurityTrigger', e.target.value)}
        placeholder="Hva utløser utrygghet hos deg?"
        exampleText="Når noen blir distrahert eller trekker seg unna."
      />
      <TextAreaField
        label="Hva trenger du når humøret er lavt?"
        name="sadnessNeed"
        value={val('sadnessNeed', '')}
        onChange={(e) => onChange('sadnessNeed', e.target.value)}
        placeholder="Hva hjelper deg når du føler deg nedfor?"
        exampleText="En god samtale eller å få bli sett og hørt."
      />
      <TextAreaField
        label="Hva trenger du når belastningen er stor?"
        name="stressNeed"
        value={val('stressNeed', '')}
        onChange={(e) => onChange('stressNeed', e.target.value)}
        placeholder="Hva hjelper deg når stresset øker?"
        exampleText="Rom for meg selv, og en trygghet i at det går over."
      />
      <TextAreaField
        label="Hva er en grense som er viktig for deg?"
        name="importantBoundary"
        value={val('importantBoundary', '')}
        onChange={(e) => onChange('importantBoundary', e.target.value)}
        placeholder="Noe du aldri vil kompromitte med?"
        exampleText="At jeg alltid får være meg selv — uten å måtte passe alle."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Tilknytningsmønsteret ditt er viktig for å finne noen som kan møte deg der du er.
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