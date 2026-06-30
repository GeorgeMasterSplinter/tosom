/**
 * ToSom — Steg 8: Moden nysgjerrighet
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

export default function Step8ModenNysgjerrighet({ step, goToStep, data, onChange, onNext }: Props) {
  const val = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hva får deg til å føle trygg nærhet?"
        name="intimacySafety"
        value={val('intimacySafety', '')}
        onChange={(e) => onChange('intimacySafety', e.target.value)}
        placeholder="Når og hvordan føler du at nærhet kjennes trygg for deg?"
        exampleText="Når vi tar det rolig, og ingen presser."
      />
      <TextAreaField
        label="Hva hjelper deg å åpne deg for en annen?"
        name="comfortableWith"
        value={val('comfortableWith', '')}
        onChange={(e) => onChange('comfortableWith', e.target.value)}
        placeholder="Hva gjør at du klarer å være sårbar?"
        exampleText="Å høre at det er greit å være seg selv."
      />
      <TextAreaField
        label="Hva er en grense du alltid vil verne om?"
        name="boundary"
        value={val('boundary', '')}
        onChange={(e) => onChange('boundary', e.target.value)}
        placeholder="Hva er viktig for deg å ha hver dag?"
        exampleText="At jeg alltid har rom for å være meg selv."
      />
      <TextAreaField
        label="Hva slags nærhet føles mest naturlig for deg?"
        name="nearerType"
        value={val('nearerType', '')}
        onChange={(e) => onChange('nearerType', e.target.value)}
        placeholder="Føles fysisk nærhet, emosjonell dypde, eller noe annet best?"
        exampleText="Emosjonell dypde — å ha samtaler som kjennes ekte."
      />
      <TextAreaField
        label="Hva trenger du tid for — før du føler deg trygg?"
        name="needsTime"
        value={val('needsTime', '')}
        onChange={(e) => onChange('needsTime', e.target.value)}
        placeholder="Hva føler du trenger litt tid på deg med?"
        exampleText="Å stole på folk, og å vise hvem jeg er virkelig."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Dine svar viser deg som person — del det du er komfortabel med.
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