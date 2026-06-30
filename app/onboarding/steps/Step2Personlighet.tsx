/**
 * ToSom — Steg 2: Personlighet & identitet
 * Knappar: PremiumButton + BackButton.
 */

'use client';

import { TextAreaField } from '../components/TextAreaField';
import { PremiumButton } from '@/components/onboarding/PremiumButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Personlighet({ data, onChange, onBack, onNext }: Props) {
  const getValue = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <div className="space-y-8">
      <TextAreaField
        label="Hvordan vil du beskrive deg selv når du er på ditt beste?"
        name="selfDesc"
        value={getValue('selfDesc', '')}
        onChange={(e) => onChange('selfDesc', e.target.value)}
        placeholder="Fortell litt om hvem du er når ting flyter naturlig..."
        exampleText="Jeg er den som alltid lytter først og tenker etter før jeg snakker."
      />
      <TextAreaField
        label="Hva gir deg energi?"
        name="energyGiver"
        value={getValue('energyGiver', '')}
        onChange={(e) => onChange('energyGiver', e.target.value)}
        placeholder="Hva får deg til å føle deg levende og til stede?"
        exampleText="Gode samtaler, natur, kreativt arbeid."
      />
      <TextAreaField
        label="Hva tapper deg for energi?"
        name="energyDrainer"
        value={getValue('energyDrainer', '')}
        onChange={(e) => onChange('energyDrainer', e.target.value)}
        placeholder="Hva gjør deg sliten eller drar deg ned?"
        exampleText="Store folkemengder, konflikt, uvissighet."
      />
      <TextAreaField
        label="Hvordan reagerer du når presset øker?"
        name="pressureReact"
        value={getValue('pressureReact', '')}
        onChange={(e) => onChange('pressureReact', e.target.value)}
        placeholder="Hva skjer med deg når ting blir krevjende?"
        exampleText="Jeg trekker meg tilbake litt til jeg føler meg trygg igjen."
      />
      <TextAreaField
        label="Hva er en egenskap eller uvane du ler av hos deg selv?"
        name="quirk"
        value={getValue('quirk', '')}
        onChange={(e) => onChange('quirk', e.target.value)}
        placeholder="Noe lite og spesielt med deg som du finner morsomt?"
        exampleText="Jeg har alltid målt ha orden på ting før jeg kan slappe av."
      />

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.
      </p>

      {/* Knappar */}
      <div className="space-y-4 mt-10">
        <BackButton onClick={onBack} />
        <PremiumButton onClick={onNext}>
          Fortsett til neste steg
        </PremiumButton>
      </div>
    </div>
  );
}