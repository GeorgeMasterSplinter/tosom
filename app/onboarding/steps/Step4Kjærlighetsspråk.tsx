/**
 * ToSom — Steg 4: Kjærlighetsspråk & nærhet
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

export default function Step4Kjærlighetsspråk({ step, goToStep, data, onChange, onNext }: Props) {
  const getValue = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hvordan viser du kjærlighet og omsorg?"
        name="loveGive"
        value={getValue('loveGive', '')}
        onChange={(e) => onChange('loveGive', e.target.value)}
        placeholder="Hvordan uttrykker du følelsene dine på en naturlig måte?"
        exampleText="Jeg viser omsorg ved å lytte, gjøre små ting, og være til stede."
      />
      <TextAreaField
        label="Hvordan liker du å motta kjærlighet?"
        name="loveReceive"
        value={getValue('loveReceive', '')}
        onChange={(e) => onChange('loveReceive', e.target.value)}
        placeholder="Hva får deg til å føle deg elsket og verdifull?"
        exampleText="Å høre at noen setter pris på meg, eller å få en klem."
      />
      <TextAreaField
        label="Hva skaper nærhet mellom dere?"
        name="closenessBuilder"
        value={getValue('closenessBuilder', '')}
        onChange={(e) => onChange('closenessBuilder', e.target.value)}
        placeholder="Hva gir deg følelsen av at du er nær noen?"
        exampleText="Dype samtaler, felles opplevelser, stille stunder sammen."
      />
      <TextAreaField
        label="Hva skaper avstand — selv om du ønsker nærhet?"
        name="distanceCreator"
        value={getValue('distanceCreator', '')}
        onChange={(e) => onChange('distanceCreator', e.target.value)}
        placeholder="Når trekker du deg tilbake, selv om du vil være nær?"
        exampleText="Når jeg føler meg pressa, eller når jeg ikke blir hørt."
      />
      <TextAreaField
        label="Hva er en liten ting som har stor betydning?"
        name="smallThing"
        value={getValue('smallThing', '')}
        onChange={(e) => onChange('smallThing', e.target.value)}
        placeholder="Noe lite som betyr mer enn mange store ting for deg?"
        exampleText="Å få en melding bare for å se at noen tenker på meg."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Kjærlighetsspråket ditt er viktig for å finne noen som kan møte deg på din måte.
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