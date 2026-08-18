/**
 * Tosom — Steg 2b: Livssituasjon (Premium rebuild 2026 — Fase 4)
 * 
 * Oppdatert med:
 * - OnboardingSlide for hel-steg layout
 * - OnboardingTextField + OnboardingSelectGrid med mikroguiding per felt
 * - PremiumCTAButton + BackButton
 * - Mikroguiding per felt
 * - 48px spacing (desktop)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
}

/* ====== Validering ====== */

interface ValidationError {
  field: string;
  message: string;
}

const validate = (data: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!String(data['workType'] ?? '').trim()) errors.push({ field: 'workType', message: 'Velg hva du jobber med.' });
  if (!String(data['housingType'] ?? '').trim()) errors.push({ field: 'housingType', message: 'Velg hva du bor i.' });
  if (!String(data['householdSize'] ?? '').trim()) errors.push({ field: 'householdSize', message: 'Velg hvor mange som bor i hjemmet.' });
  if (!String(data['economicStability'] ?? '').trim()) errors.push({ field: 'economicStability', message: 'Velg økonomisk stabilitet.' });
  
  const responsibilities = String(data['responsibilities'] ?? '').trim();
  if (!responsibilities || responsibilities.length < 10) {
    errors.push({ field: 'responsibilities', message: 'Skriv minst 10 tegn om dine ansvar.' });
  }
  
  const dailyRoutine = String(data['dailyRoutine'] ?? '').trim();
  if (!dailyRoutine || dailyRoutine.length < 10) {
    errors.push({ field: 'dailyRoutine', message: 'Skriv minst 10 tegn om din hverdagsrutine.' });
  }
  
  return errors;
};

/* ====== Hovedkomponent ====== */

export default function Step2Livssituasjon({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;

  const handleNext = () => {
    const validationErrors = validate(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onNext();
  };

  const getValue = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <OnboardingSlide
      title="Livssituasjon"
      subtitle="Hva jobber du med, hva bor du i, og hvordan ser hverdagen din ut?"
      guidingText="Livssituasjonen din gir oss en viktig oversikt over hverdagen din."
      slideIndex={2}
      totalSlides={13}
      accentColor={OB.section.personality}
    >
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.08)',
          borderColor: 'rgba(255, 77, 77, 0.2)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut alle påkrevde felt:
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ────────────────────────────────────── */}
      {/* ARBEID */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Hva jobber du med? *"
        mikroguiding="Velg det som passer best for deg nå"
        options={[
          { value: 'anstatt-fulltid', label: 'Ansett på fulltid', icon: '💼' },
          { value: 'anstatt-deltid', label: 'Ansett på deltid', icon: '🕐' },
          { value: 'egen-næring', label: 'Egen næringsdrivende', icon: '🏢' },
          { value: 'studier', label: 'Studier', icon: '📚' },
          { value: 'frivillig', label: 'Frivillig arbeid', icon: '🤝' },
          { value: 'husmor-husmann', label: 'Husmor / Husmann', icon: '🏠' },
          { value: 'pensjonist', label: 'Pensjonist', icon: '🎖️' },
          { value: 'permisjon', label: 'Permisjon', icon: '🌿' },
          { value: 'nav', label: 'Ungdomskontakt / NAV', icon: '📋' },
          { value: 'annet', label: 'Annet', icon: '✨' },
        ]}
        selectedValue={getValue('workType', '')}
        onChange={(v) => onChange('workType', v)}
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* BOSETTING */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Hva bor du i? *"
        options={[
          { value: 'leilighet', label: 'Leilighet', icon: '🏢' },
          { value: 'hus', label: 'Hus (eiendom)', icon: '🏡' },
          { value: 'delt-bo', label: 'Delt bo', icon: '🤝' },
          { value: 'kollektiv', label: 'Kollektiv', icon: '👥' },
          { value: 'studentbolig', label: 'Studentbolig', icon: '🎓' },
          { value: 'foreldres-bo', label: 'Foreldres bo', icon: '🏠' },
          { value: 'annet', label: 'Annet', icon: '✨' },
        ]}
        selectedValue={getValue('housingType', '')}
        onChange={(v) => onChange('housingType', v)}
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <OnboardingSelectGrid
        label="Hvor mange bor det i hjemmet? *"
        mikroguiding="Inkluder deg selv i tellingen"
        options={[
          { value: '1', label: 'Jeg alene', icon: '🧍' },
          { value: '2', label: '2 personer', icon: '👫' },
          { value: '3-4', label: '3–4 personer', icon: '👨‍👩‍👧‍👦' },
          { value: '5+', label: '5+ personer', icon: '🏘️' },
        ]}
        selectedValue={getValue('householdSize', '')}
        onChange={(v) => onChange('householdSize', v)}
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* ØKONOMI */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Økonomisk stabilitet? *"
        mikroguiding="Ingen detaljar trengs — bare hva som passer best"
        options={[
          { value: 'stabil', label: 'Stabil økonomi', icon: '💰' },
          { value: 'dekker', label: 'Nøye penninger dekker utgifter', icon: '📊' },
          { value: 'varierer', label: 'Varierer fra måned til måned', icon: '📈' },
          { value: 'sparning', label: 'Prioriterer sparing aktivt', icon: '🏦' },
          { value: 'stabilitet', label: 'Fokus på stabilitet, ikke overskudd', icon: '⚖️' },
        ]}
        selectedValue={getValue('economicStability', '')}
        onChange={(v) => onChange('economicStability', v)}
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* ANSVAR & HVERDAG */}
      {/* ────────────────────────────────────── */}
      <div className="space-y-6">
        <OnboardingTextField
          label="Hva ansvar har du i livet ditt? *"
          value={getValue('responsibilities', '')}
          onChange={(v) => onChange('responsibilities', v)}
          placeholder="Skriv f.eks. Jeg har to barn som bor hos meg, jeg tar omsorg for en foreldre..."
          mikroguiding="Skriv f.eks. Jeg har to barn som bor hos meg, jeg tar omsorg for en forelder"
          maxLength={500}
          minChars={10}
          rows={4}
          multiline
        />

        <OnboardingTextField
          label="Hvordan starter en typisk dag for deg? *"
          value={getValue('dailyRoutine', '')}
          onChange={(v) => onChange('dailyRoutine', v)}
          maxLength={500}
          minChars={10}
          rows={4}
          multiline
        />
      </div>

      {/* Trust text */}
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
        Svarene dine hjelper oss å finne noen som passer din hverdagsrytme.
      </p>

      {/* Knappar — Back + CTA */}
      <div className="mt-8 space-y-4">
        <BackButton onClick={onBack} />
        <PremiumCTAButton
          onClick={handleNext}
          label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'}
          disabled={!canProceed}
          fullWidth
        />
      </div>
    </OnboardingSlide>
  );
}