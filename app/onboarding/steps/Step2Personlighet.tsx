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
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { OB } from '@/app/onboarding/theme';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { TOSOM_PERSONALITY } from '@/lib/psychometrics/instruments';
import { missingScaleItems } from '@/lib/validation/onboarding-steps';

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

  // LIVSSTIL-2026 (D-5): energyGiver/energyDrainer/pressureReact er nå valg-grid
  // (ingen min-lengde lenger); quirk er valgfri kort. Kun selfDesc blokkerer.

  // PL-08b (D-1): skalasvarene er påkrevd per steg.
  const missing = missingScaleItems(data, TOSOM_PERSONALITY);
  if (missing.length > 0) {
    errors.push({ field: missing[0], message: 'Svar på alle påstandene — det finnes ingen fasit.' });
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
        testId="ob-self-desc"
      />

      {/* Separator */}
      <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

      {/* energyGiver — LIVSSTIL-2026 (D-5): flervalg-grid i stedet for fritekst */}
      <OnboardingSelectGrid
        label="Hva gir deg energi?"
        mikroguiding="Velg opptil tre — det hjelper oss å forstå hva som fyller deg."
        options={[
          { value: 'natur', label: 'Natur og frisk luft', icon: '🌲' },
          { value: 'dype-samtaler', label: 'Dype samtaler', icon: '💬' },
          { value: 'sosialt', label: 'Sosialt selskap', icon: '👥' },
          { value: 'kreativt-arbeid', label: 'Kreativt arbeid', icon: '🎨' },
          { value: 'bevegelse', label: 'Bevegelse', icon: '🏃' },
          { value: 'god-musikk', label: 'God musikk', icon: '🎵' },
          { value: 'familie-og-venner', label: 'Familie og venner', icon: '🏡' },
          { value: 'meningsfullt-arbeid', label: 'Meningsfullt arbeid', icon: '🧭' },
        ]}
        selectedValue={getValue('energyGiver', '')}
        onChange={(v) => onChange('energyGiver', v)}
        maxSelected={3}
        testId="ob-energy-giver"
      />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* energyDrainer — flervalg-grid i stedet for fritekst */}
        <OnboardingSelectGrid
          label="Hva tapper deg for energi?"
          mikroguiding="Velg opptil tre — det hjelper oss å forstå hva som tømmer deg."
          options={[
            { value: 'støy', label: 'Støy og trange rom', icon: '🔊' },
            { value: 'konflikt', label: 'Konflikt og skrik', icon: '⚡' },
            { value: 'ubestemthet', label: 'Ubestemthet og venting', icon: '🌫️' },
            { value: 'store-folkmengder', label: 'Store folkemengder', icon: '🏙️' },
            { value: 'overfladiske-samtaler', label: 'Overfladiske samtaler', icon: '💬' },
            { value: 'arbeidspress', label: 'Arbeidspress', icon: '📉' },
            { value: 'skjerm-tid', label: 'For mye skjerm', icon: '📱' },
          ]}
          selectedValue={getValue('energyDrainer', '')}
          onChange={(v) => onChange('energyDrainer', v)}
          maxSelected={3}
          testId="ob-energy-drainer"
        />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* pressureReact — 1 av 4 i stedet for fritekst */}
        <OnboardingSelectGrid
          label="Hvordan reagerer du når presset øker?"
          mikroguiding="Velg det som kjennes mest kjent."
          options={[
            { value: 'trekker-meg-tilbake', label: 'Trekker meg tilbake litt', icon: '🌙' },
            { value: 'prater-meg-igjennom', label: 'Prater meg gjennom det', icon: '🗣️' },
            { value: 'blir-irritabel', label: 'Blir litt irritabel', icon: '🌩️' },
            { value: 'blir-handlingsparat', label: 'Blir handlingsparat', icon: '🛠️' },
          ]}
          selectedValue={getValue('pressureReact', '')}
          onChange={(v) => onChange('pressureReact', v)}
          columns={2}
          testId="ob-pressure-react"
        />

        {/* Separator */}
        <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '20px', marginBottom: '20px' }} />

        {/* quirk — valgfri kort fritekst (varme i profilen) */}
      <OnboardingTextField
        label="Hva er en egenskap eller vane du ler av deg selv?"
        value={getValue('quirk', '')}
        onChange={(v) => onChange('quirk', v)}
        placeholder="Noe lite og spesielt med deg som du finner morsomt?"
        mikroguiding="Skriv f.eks. Jeg har alltid målt ha orden på ting før jeg kan slappe av"
        maxLength={200}
        rows={2}
        multiline
        testId="ob-quirk"
      />

      {/* PERSONALITY V2 — Tosoms egne personlighetsspørsmål (15) */}
      <div style={{ borderTop: `1px solid ${OB.divider}`, marginTop: '28px', marginBottom: '8px' }} />
      <p className="text-sm mb-4" style={{ color: OB.textSecondary }}>
        Hvordan er du vanligvis? Noen påstander — svar det som kjennes riktigst.
        Det finnes ingen fasit.
      </p>
      <div className="space-y-3">
        {TOSOM_PERSONALITY.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
            accentColor={OB.section.personality}
          />
        ))}
      </div>

      {/* Trust text */}
      <p className="text-center text-xs mt-8" style={{ color: OB.textSubtle }}>
        Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.
      </p>

      {/* Knapper — Back + CTA */}
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