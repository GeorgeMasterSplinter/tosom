/**
 * ToSom — Steg 1: Grunnprofil (premium)
 * Knappar: PremiumButton berre (ingen Tilbake).
 */

'use client';

import { useState } from 'react';
import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { PremiumButton } from '@/components/onboarding/PremiumButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onNext: () => void;
}

// Type assertion for å unngå TypeScript-feil — ProfileData → Record<string, unknown>

interface ValidationError {
  field: string;
  message: string;
}

const validate = (data: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  const name = String(data['identityName'] ?? '').trim();
  const age = String(data['age'] ?? '').trim();
  const gender = String(data['gender'] ?? '').trim();
  const seekingGender = String(data['seekingGender'] ?? '').trim();

  if (!name) errors.push({ field: 'identityName', message: 'Navn er påkrevd' });
  if (!age || parseInt(age) < 23) errors.push({ field: 'age', message: 'Du må være 23+ for å bruke ToSom' });
  if (!gender) errors.push({ field: 'gender', message: 'Kjønn er påkrevd' });
  if (!seekingGender) errors.push({ field: 'seekingGender', message: 'Kjønn du søker etter er påkrevd' });

  return errors;
};

const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : fallback;
};

const num = (field: string, fallback = 50) => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? Number(v) : fallback;
};

export default function Step1Profile({ data, onChange, onNext }: Props) {
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

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: '#FFFFFF' }}>
          Grunnprofil
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'rgba(212, 175, 55, 0.55)' }}>
          La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte.
        </p>
      </div>

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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <InputField
          label="Hva vil du at vi skal kalle deg?"
          name="firstName"
          value={val('identityName', '')(data)}
          onChange={(e) => onChange('identityName', e.target.value)}
          placeholder="Eksempel: Ane"
        />

        <InputField
          label="Alder"
          name="age"
          type="number"
          value={val('age', '')(data)}
          onChange={(e) => onChange('age', e.target.value)}
          placeholder="25"
          min={18}
          max={99}
        />

        <SelectField
          label="Ditt kjønn"
          name="gender"
          value={val('gender', '')(data)}
          onChange={(v) => onChange('gender', v)}
          options={['Mann', 'Kvinne', 'Ikke-binær', 'Annet', 'Vil ikke si']}
        />

        <SelectField
          label="Hva søker du?"
          name="seeking"
          value={val('seekingGender', '')(data)}
          onChange={(v) => onChange('seekingGender', v)}
          options={['Mann', 'Kvinne', 'Ikke-binær', 'Åpen for flere', 'Vil ikke si']}
        />

        <InputField
          label="Høyde (cm)"
          name="height"
          type="number"
          value={val('height', '')(data)}
          onChange={(e) => onChange('height', e.target.value)}
          placeholder="178"
          min={100}
          max={250}
        />

        <SelectField
          label="Kroppstype"
          name="bodyType"
          value={val('bodyType', '')(data)}
          onChange={(v) => onChange('bodyType', v)}
          options={['Slank', 'Gjennomsnittlig', 'Atletisk', 'Kraftig', 'Myk', 'Vil ikke si']}
        />

        <SelectField
          label="Livsstil"
          name="lifestyle"
          value={val('lifestyle', '')(data)}
          onChange={(v) => onChange('lifestyle', v)}
          options={['Aktiv', 'Rolig', 'Balansert', 'Eventyrlysten', 'Treningsfokusert', 'Hjemmekjær', 'Sosial', 'Vil ikke si']}
        />

        <SelectField
          label="Røyking / snus"
          name="smoking"
          value={val('smoking', '')(data)}
          onChange={(v) => onChange('smoking', v)}
          options={['Nei', 'Av og til', 'Ja', 'Vil ikke si']}
        />

        <SelectField
          label="Religion / livssyn"
          name="religion"
          value={val('religion', '')(data)}
          onChange={(v) => onChange('religion', v)}
          options={['Kristen', 'Humanetiker', 'Muslim', 'Buddhist', 'Hindu', 'Ikke religiøs', 'Annet', 'Vil ikke si']}
        />

        <SelectField
          label="Barn?"
          name="children"
          value={val('children', '')(data)}
          onChange={(v) => onChange('children', v)}
          options={['Ja', 'Nei', 'Ja, voksne barn', 'Nei, men åpen for kontakt', 'Vil ikke si']}
        />

        <SelectField
          label="Ønsker du barn?"
          name="wantChildren"
          value={val('wantChildren', '')(data)}
          onChange={(v) => onChange('wantChildren', v)}
          options={['Ja', 'Nei', 'Kanskje', 'Usikker', 'Vil ikke si']}
        />

        <InputField
          label="Bosted"
          name="location"
          value={val('city', '')(data)}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Eksempel: Bergen"
        />

      </div>

      {/* Avstand & alder */}
      <div className="space-y-12 pt-12">
        <h2 className="text-xl font-semibold" style={{ color: '#D4AF37' }}>
          Avstand & alder
        </h2>

        <div className="space-y-12">
          {/* Maks avstand */}
          <div className="space-y-3">
            <label className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Maks avstand (km)
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min={1}
                max={200}
                value={num('distancePref', 50)(data)}
                onChange={(e) => onChange('distancePref', Number(e.target.value))}
                className="flex-1 h-2 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.15)', accentColor: '#D4AF37' }}
              />
              <span className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {num('distancePref', 50)(data)} km
              </span>
            </div>
          </div>

          {/* Min alder */}
          <div className="space-y-3">
            <label className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Minste alder du søker
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min={18}
                max={90}
                value={num('minAge', 23)(data)}
                onChange={(e) => onChange('minAge', Number(e.target.value))}
                className="flex-1 h-2 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.15)', accentColor: '#D4AF37' }}
              />
              <span className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {num('minAge', 23)(data)} år
              </span>
            </div>
          </div>

          {/* Maks alder */}
          <div className="space-y-3">
            <label className="text-base font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Maks alder du søker
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min={23}
                max={95}
                value={num('maxAge', 40)(data)}
                onChange={(e) => onChange('maxAge', Number(e.target.value))}
                className="flex-1 h-2 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.15)', accentColor: '#D4AF37' }}
              />
              <span className="text-sm font-normal" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {num('maxAge', 40)(data)} år
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Knappar — berre PremiumButton (ingen Tilbake på steg 1) */}
      <div className="space-y-4 mt-10">
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