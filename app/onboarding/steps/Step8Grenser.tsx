/**
 * ToSom — Steg 8 (ny): Grenser & Behov
 * 
 * Kartlegger viktigste grenser, behov for å forstå partnerens grenser,
 og begrensninger som påvirker relasjon.
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

export default function Step8Grenser({ data, onChange, onBack, onNext }: Props) {
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

      {/* Grenser — viktigste */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          En grense jeg aldri vil krysse er...
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Grenser beskytter deg — og den du elsker. Del bare det du føler deg trygg med.
        </p>
        <TextAreaField
          label="Din viktigste grense"
          name="neverCrossBoundary"
          value={val('neverCrossBoundary', '')(data)}
          onChange={(e) => onChange('neverCrossBoundary', e.target.value)}
          placeholder="Eksempel: jeg vil aldri akseptere å bli snakket ned til, jeg trives ikke med kontroll..."
          rows={4}
        />
      </div>

      {/* Forstå partnerens grenser */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hvor viktig er det for deg å forstå partnerens grenser?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Å forstå noens grenser er en del av kjærlighet. Hva er ditt svar?
        </p>
        <SelectField
          label="Forstå partnerens grenser"
          name="understandPartnersBoundaries"
          value={val('understandPartnersBoundaries', '')(data)}
          onChange={(v) => onChange('understandPartnersBoundaries', v)}
          options={[
            'Veldig viktig — jeg vil aldri krysje en grense vennlig',
            'Viktig, men jeg tror at samtale bygger broer',
            'Noen grenser kan forhandles gjennom åpenhet',
            'Det kommer an på situasjonen',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Begrensninger */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva begrensninger har du som påvirker relasjon?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Begrensninger er ingen svake punkter — de er bare deler av hvem du er.
        </p>
        <TextAreaField
          label="Dine begrensninger"
          name="limitations"
          value={val('limitations', '')(data)}
          onChange={(e) => onChange('limitations', e.target.value)}
          placeholder="Eksempel: jeg arbeider mye og har derfor lite tid på uker, jeg har behov for alene timer hver dag..."
          rows={4}
        />
      </div>

      {/* Behov for forståelse */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva trenger du at partneren din forstår om deg?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Det kan være noe noen ser — eller noe du selv har funnet ut om deg selv.
        </p>
        <TextAreaField
          label="Hva partneren må forstå"
          name="partnerMustUnderstand"
          value={val('partnerMustUnderstand', '')(data)}
          onChange={(e) => onChange('partnerMustUnderstand', e.target.value)}
          placeholder="Eksempel: jeg trenger å føle meg trygg før jeg åpner meg, jeg viser ikke kjærlighet på standard måter..."
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