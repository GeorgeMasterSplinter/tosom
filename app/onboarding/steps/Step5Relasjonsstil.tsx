/**
 * ToSom — Steg 5 (ny): Relasjonsstil
 * 
 * Kartlegger hva slags relasjon brukeren søker, nærhetsbehov,
 selvstendighet vs felles, og viktigste grense.
 */

'use client';

import { useState } from 'react';
import { SelectField } from '../components/SelectField';
import { TextAreaField } from '../components/TextAreaField';
import { PremiumButton } from '@/components/onboarding/PremiumButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
}

interface ValidationError {
  field: string;
  message: string;
}

const validate = (data: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  return errors;
};

const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : fallback;
};

export default function Step5Relasjonsstil({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleNext = () => {
    const validationErrors = validate(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">

      {/* Error summary */}
      {errors.length > 0 && (
        <div className="rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.08)',
          borderColor: 'rgba(255, 77, 77, 0.2)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut de markerte feltene:
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Relasjonsmål */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva søker du i en relasjon?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Det finnes ingen rette svar — bare det som stemmer for deg.
        </p>
        <SelectField
          label="Hva slags relasjon søker du?"
          name="relationshipSeeking"
          value={val('relationshipSeeking', '')(data)}
          onChange={(v) => onChange('relationshipSeeking', v)}
          options={[
            'Langvarig, dype forhold',
            'Utforske hva som skjer — uten press',
            'Vennskap først, kanskje mer senere',
            'En jevnbyrdig samarbeidspartner',
            'Noen å dele hverdagen med',
            'Annet',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Nærhetsbehov */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hvor mye nærhet føler du deg mest lykkelig i?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Nærhet betyr ulikt for ulike mennesker. Hva er din naturlige rytme?
        </p>
        <SelectField
          label="Nærhetsbehov"
          name="closenessNeed"
          value={val('closenessNeed', '')(data)}
          onChange={(v) => onChange('closenessNeed', v)}
          options={[
            'Mye tid sammen — jeg trives med nære dager',
            'Balansert rom og felles stunder',
            'Jeg trenger mye eget rom for å lade opp',
            'Det kommer an på hvordan vi begge har det',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Självstendighet vs felles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hvordan balanserer du egne interesser med felles?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          De beste relasjonene har ofte både eget rom og felles opptak. Hva er ditt svar?
        </p>
        <SelectField
          label="Självstendighet vs felles"
          name="independenceBalance"
          value={val('independenceBalance', '')(data)}
          onChange={(v) => onChange('independenceBalance', v)}
          options={[
            'Jeg trives med å ha egne interesser — og felles ting vi også har',
            'Jeg vil gjerne dele mesteparten av det jeg gjør',
            'Det kommer an på hva type aktivitet det er',
            'Jeg føler meg sterkest når jeg har full frihet til å velge',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Viktigste grense */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva er viktigste grensen din i et forhold?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Grenser hjelper oss å forstå hva du ikke kan leve uten. Ingen vil dømme svarene dine.
        </p>
        <TextAreaField
          label="Din viktigste grense"
          name="importantBoundary"
          value={val('importantBoundary', '')(data)}
          onChange={(e) => onChange('importantBoundary', e.target.value)}
          placeholder="Eksempel: jeg trenger at min privat tid blir respektert, jeg vil ikke ha kontroller... "
          rows={4}
        />
      </div>

      {/* Knapper */}
      <div className="space-y-4 mt-10">
        <button
          onClick={onBack}
          className="block text-sm hover:underline transition-colors"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          ← Tilbake
        </button>
        <PremiumButton onClick={handleNext}>
          Fortsett til neste steg
        </PremiumButton>
      </div>

      {/* Trust text */}
      <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
        Svarene dine brukes kun til å bygge profilen din og finne en god match.
      </p>

    </div>
  );
}