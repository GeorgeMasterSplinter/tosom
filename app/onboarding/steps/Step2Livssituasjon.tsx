/**
 * ToSom — Steg 2 (ny): Livssituasjon
 * 
 * Kartlegger arbeid, bosted, økonomi, ansvar og hverdagsrutin.
 * modne, rolige formuleringer uten press.
 */

'use client';

import { useState } from 'react';
import { InputField } from '../components/InputField';
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
  
  // Ingen obligatoriske felt — på frivillig grunnlag
  return errors;
};

const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : fallback;
};

export default function Step2Livssituasjon({ data, onChange, onBack, onNext }: Props) {
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

  const getFieldError = (field: string) => {
    const err = errors.find((e) => e.field === field);
    return err ? err.message : null;
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

      {/* Arbeid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva jobber du med?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Dette hjelper oss å forstå hva for en hverdag du lever i.
        </p>
        <SelectField
          label="Arbeidstype"
          name="workType"
          value={val('workType', '')(data)}
          onChange={(v) => onChange('workType', v)}
          options={[
            'Anstett på fulltid',
            'Anstett på deltid',
            'Egen næringsdrivende',
            'Studier',
            'Frivillig arbeid',
            'Husmor / Husmann',
            'Pensjonist',
            'Permisjon',
            'Ungdomskontakt / NAV',
            'Annet',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Bosted */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva bor du i?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Hvor du bor sier noe om din hverdagsrytme og livssituasjon.
        </p>
        <SelectField
          label="Boetype"
          name="housingType"
          value={val('housingType', '')(data)}
          onChange={(v) => onChange('housingType', v)}
          options={[
            'Leilighet',
            'Hus (eiendom)',
            'Delt bo',
            'Kollektiv',
            'Studentbolig',
            'Foreldres bo',
            'Annet',
            'Vil ikke si',
          ]}
        />

        <SelectField
          label="Hvor mange bor det i hjemmet?"
          name="householdSize"
          value={val('householdSize', '')(data)}
          onChange={(v) => onChange('householdSize', v)}
          options={['1 person (jeg alene)', '2 personer', '3-4 personer', '5+ personer']}
        />
      </div>

      {/* Økonomisk trygghet */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva er viktig for deg økonomisk?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Ingen detaljer trengs — bare noe vi kan bruke til å forstå din livssituasjon bedre.
        </p>
        <SelectField
          label="Økonomisk stabilitet"
          name="economicStability"
          value={val('economicStability', '')(data)}
          onChange={(v) => onChange('economicStability', v)}
          options={[
            'Stabil økonomi',
            'Nettoppen dekker utgifter',
            'Varierer fra måned til måned',
            'Prioriterer sparing aktivt',
            'Fokus på stabilitet, ikke overskudd',
            'Vil ikke si',
          ]}
        />
      </div>

      {/* Ansvar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hva ansvar har du?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Ansvar gir retning for tid og energi — vi vil gjerne forstå hvordan din hverdag ser ut.
        </p>
        <TextAreaField
          label="Fortell litt om ansvar i livet ditt"
          name="responsibilities"
          value={val('responsibilities', '')(data)}
          onChange={(e) => onChange('responsibilities', e.target.value)}
          placeholder="Eksempel: jeg har to barn som bor hos meg, jeg tar omsorg for en forelder, jeg studerer og har studiepoeng..."
          rows={3}
        />
      </div>

      {/* Hverdagsrutine */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Hvordan starter en typisk dag for deg?
        </h2>
        <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Ingen rette svar — bare måten du lever på. Det hjelper oss å forstå hva for en rytme vi deler.
        </p>
        <TextAreaField
          label="Din typiske hverdag"
          name="dailyRoutine"
          value={val('dailyRoutine', '')(data)}
          onChange={(e) => onChange('dailyRoutine', e.target.value)}
          placeholder="Eksempel: jeg vasker meg tidlig, lager frokost, kjører barnet til skolen og går på jobb..."
          rows={4}
        />
      </div>

      {/* Knappar */}
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