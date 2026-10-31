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
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { Valgvikt } from '@/app/onboarding/components/Valgvikt';
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
  
  
  // O2 P1: ingen påkrevde felt i dette steget lenger (workType/housingType/
  // householdSize/economicStability/responsibilities/dailyRoutine tatt ut av
  // aktiv innsamling). Hverdag-2026-feltene (arbeidsrytme/bosted/reiser/dyr/
  // skjerm) er valgfrie.
  
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
      {/* HVERDAG (LIVSSTIL-2026, D-2/D-4) — alt valgfritt */}
      {/* ────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ÉN gang her: hva viktighetsnivåene betyr — første sted Valgvikt
          vises. «Må stemme» er en hard grense i matchingmotoren (D-4). */}
      <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        På disse kan du også si hvor viktig svaret er for deg. Velger du
        «Må stemme», er det en hard grense: passer dere ikke sammen der,
        blir dere ikke koblet.
      </p>

      <div>
        <OnboardingSelectGrid
          label="Hvordan ser jobben din ut?"
          mikroguiding="Arbeidsrytmen din former tiden dere har sammen."
          options={[
            { value: 'kontorbundet', label: 'Kontorbundet', icon: '🏢' },
            { value: 'hybrid', label: 'Hybrid', icon: '🔀' },
            { value: 'hjemmearbeid', label: 'Hjemmearbeid', icon: '🏠' },
            { value: 'skift', label: 'Skiftarbeid', icon: '🕐' },
          ]}
          selectedValue={getValue('arbeidsrytme', '')}
          onChange={(v) => onChange('arbeidsrytme', v)}
          columns={2}
          testId="ob-l2026-arbeidsrytme"
        />
        <Valgvikt
          value={getValue('arbeidsrytmeViktig', '')}
          onChange={(v) => onChange('arbeidsrytmeViktig', v)}
          testId="ob-l2026-arbeidsrytme-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvor trives du?"
          mikroguiding="Hvor du bor, former hverdagen dere kan dele."
          options={[
            { value: 'sentrum', label: 'Sentrum', icon: '🏙️' },
            { value: 'forstad', label: 'Forstad', icon: '🏘️' },
            { value: 'land', label: 'Land', icon: '🌿' },
            { value: 'ubestemt', label: 'Ikke bestemt ennå', icon: '❔' },
          ]}
          selectedValue={getValue('bosted', '')}
          onChange={(v) => onChange('bosted', v)}
          columns={2}
          testId="ob-l2026-bosted"
        />
        <Valgvikt
          value={getValue('bostedViktig', '')}
          onChange={(v) => onChange('bostedViktig', v)}
          testId="ob-l2026-bosted-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvordan reiser du?"
          mikroguiding="Velg det som beskriver deg best."
          options={[
            { value: 'fjell-bobil', label: 'Fjell og bobil', icon: '🚐' },
            { value: 'utlandet', label: 'Utlandet', icon: '✈️' },
            { value: 'naturen-naermest', label: 'Naturen nærmest', icon: '🥾' },
            { value: 'lite-reising', label: 'Lite reising', icon: '🛋️' },
          ]}
          selectedValue={getValue('reiser', '')}
          onChange={(v) => onChange('reiser', v)}
          columns={2}
          testId="ob-l2026-reiser"
        />
        <Valgvikt
          value={getValue('reiserViktig', '')}
          onChange={(v) => onChange('reiserViktig', v)}
          testId="ob-l2026-reiser-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* dyr + vektmodell (D-4) */}
      <div>
        <OnboardingSelectGrid
          label="Hva med dyr i hverdagen?"
          mikroguiding="Velg det som gjelder for deg."
          options={[
            { value: 'hund', label: 'Hund', icon: '🐕' },
            { value: 'katt', label: 'Katt', icon: '🐈' },
            { value: 'annet-dyr', label: 'Annet kjæledyr', icon: '🐹' },
            { value: 'ingen', label: 'Ingen dyr', icon: '🪶' },
          ]}
          selectedValue={getValue('dyr', '')}
          onChange={(v) => onChange('dyr', v)}
          columns={2}
          testId="ob-l2026-dyr"
        />
        <Valgvikt
          value={getValue('dyrViktig', '')}
          onChange={(v) => onChange('dyrViktig', v)}
          testId="ob-l2026-dyr-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvor mye tid bruker du på skjermen?"
          mikroguiding="Velg det som passer best for deg."
          options={[
            { value: 'mye', label: 'Mye', icon: '📱' },
            { value: 'moderat', label: 'Moderat', icon: '⚖️' },
            { value: 'vil-skru-ned', label: 'Vil gjerne skru ned', icon: '📉' },
          ]}
          selectedValue={getValue('skjerm', '')}
          onChange={(v) => onChange('skjerm', v)}
          columns={2}
          testId="ob-l2026-skjerm"
        />
        <Valgvikt
          value={getValue('skjermViktig', '')}
          onChange={(v) => onChange('skjermViktig', v)}
          testId="ob-l2026-skjerm-viktig"
        />
      </div>


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