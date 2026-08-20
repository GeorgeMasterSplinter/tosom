/**
 * Tosom — Steg 2a: Personlighet & identitet (Premium rebuild 2026 — Fase 4)
 * 
 * Oppdatert med:
 * - OnboardingSlide for hel-steg layout
 * - OnboardingTextField med mikroguiding + progresjon per felt
 * - PremiumCTAButton + BackButton
 * - Mikroguiding per felt
 * - 48px spacing (desktop)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { OB } from '@/app/onboarding/theme';

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

  const selfDesc = String(data['selfDesc'] ?? '').trim();
  if (!selfDesc || selfDesc.length < 10) {
    errors.push({ field: 'selfDesc', message: 'Skriv minst 10 tegn om hvem du er.' });
  }

  const energyGiver = String(data['energyGiver'] ?? '').trim();
  if (!energyGiver || energyGiver.length < 10) {
    errors.push({ field: 'energyGiver', message: 'Skriv minst 10 tegn om hva som gir deg energi.' });
  }

  const energyDrainer = String(data['energyDrainer'] ?? '').trim();
  if (!energyDrainer || energyDrainer.length < 10) {
    errors.push({ field: 'energyDrainer', message: 'Skriv minst 10 tegn om hva som taper deg for energi.' });
  }

  const pressureReact = String(data['pressureReact'] ?? '').trim();
  if (!pressureReact || pressureReact.length < 10) {
    errors.push({ field: 'pressureReact', message: 'Skriv minst 10 tegn om hvordan du reagerer under press.' });
  }

  const quirk = String(data['quirk'] ?? '').trim();
  if (!quirk || quirk.length < 5) {
    errors.push({ field: 'quirk', message: 'Skriv minst 5 tegn om en egenskap du ler av deg selv.' });
  }

  return errors;
};

/* ====== Hovedkomponent ====== */

export default function Step2Personlighet({ data, onChange, onBack, onNext }: Props) {
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
      title="Personlighet & identitet"
      subtitle="Fortell litt om hvem du er — uten filter."
      guidingText="Personligheten din er det som gjør deg til deg."
      slideIndex={1}
      totalSlides={13}
      accentColor={OB.section.personality}
    >
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.06)',
          borderColor: 'rgba(255, 77, 77, 0.15)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut alle påkrevde felt:
          </p>
          <ul className="text-sm space-y-1" style={{ color: OB.textSecondary }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ────────────────────────────────────── */}
      {/* KJERNE — Personlighet */}
      {/* ────────────────────────────────────── */}
      {/* Ingen space-y — jeg legger til separatorer manuelt */}

      {/* selfDesc med mikroguiding */}
      <OnboardingTextField
        label="Hvem er du når ting flyter naturlig? *"
        value={getValue('selfDesc', '')}
        onChange={(v) => onChange('selfDesc', v)}
        placeholder="Fortell litt om hvem du er når ting flyter..."
        mikroguiding="Skriv f.eks. Den som alltid lytter først og tenker etter før jeg snakker"
        maxLength={500}
        minChars={10}
        rows={4}
        multiline
      />

      {/* Separator */}
      <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

      {/* energyGiver med mikroguiding */}
      <OnboardingTextField
          label="Hva gir deg energi? *"
          value={getValue('energyGiver', '')}
          onChange={(v) => onChange('energyGiver', v)}
          placeholder="Hva får deg til å kjenne deg levende og til stede?"
          mikroguiding="Skriv f.eks. Gode samtaler, natur, kreativt arbeid"
          maxLength={300}
          minChars={10}
          rows={3}
          multiline
        />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* energyDrainer med mikroguiding */}
        <OnboardingTextField
          label="Hva taper deg for energi? *"
          value={getValue('energyDrainer', '')}
          onChange={(v) => onChange('energyDrainer', v)}
          placeholder="Hva gjør deg sliten eller drar deg ned?"
          mikroguiding="Skriv f.eks. Store folkemengder, konflikt, uvissighet"
          maxLength={300}
          minChars={10}
          rows={3}
          multiline
        />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* pressureReact med mikroguiding */}
        <OnboardingTextField
          label="Hvordan reagerer du når presset øker? *"
          value={getValue('pressureReact', '')}
          onChange={(v) => onChange('pressureReact', v)}
          placeholder="Hva skjer med deg når ting blir krevende?"
          mikroguiding="Skriv f.eks. Jeg trekker meg tilbake litt til jeg kjenner meg trygg igjen"
          maxLength={300}
          minChars={10}
          rows={3}
          multiline
        />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* quirk med mikroguiding */}
      <OnboardingTextField
        label="Hva er en egenskap eller vane du ler av deg selv? *"
        value={getValue('quirk', '')}
        onChange={(v) => onChange('quirk', v)}
        placeholder="Noe lite og spesielt med deg som du finner morsomt?"
        mikroguiding="Skriv f.eks. Jeg har alltid målt ha orden på ting før jeg kan slappe av"
        maxLength={200}
        minChars={5}
        rows={3}
        multiline
      />

      {/* Trust text */}
      <p className="text-center text-xs mt-8" style={{ color: OB.textSubtle }}>
        Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.
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