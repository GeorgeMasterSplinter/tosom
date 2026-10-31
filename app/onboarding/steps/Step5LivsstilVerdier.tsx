/**
 * Tosom — Steg 5a: Livsstil & verdier (Premium rebuild 2026 — Fase 4)
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
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { PVQ10 } from '@/lib/psychometrics/instruments';
import { missingScaleItems } from '@/lib/validation/onboarding-steps';

interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }

const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  // PL-08b (D-1): skalasvarene er påkrevd per steg.
  const missing = missingScaleItems(d, PVQ10);
  if (missing.length > 0) e.push({ field: missing[0], message: 'Svar på alle påstandene.' });
  return e;
};

export default function Step5LivsstilVerdier({ data, onChange, onBack, onNext, step, goToStep }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };

  // O2 P1: kosthold maks 2 — «Spiser det meste» (spiser-koett) kan ikke kombineres
  // med vegetar/vegan. Velger man en konflikt, fjernes spiser-koett (beholder de strenge).
  const handleKostholdChange = (v: string) => {
    const parts = v.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.includes('spiser-koett') && (parts.includes('vegetar') || parts.includes('vegan'))) {
      onChange('kosthold', parts.filter((p) => p !== 'spiser-koett').join(','));
      return;
    }
    onChange('kosthold', v);
  };

  return (
    <OnboardingSlide title="Livsstil & verdier" subtitle="Hva prioriterer du i hverdagen?" guidingText="Livsstilssvarene dine hjelper oss å finne noen som trives i hverdag sammen med deg." slideIndex={5} totalSlides={13}
      accentColor={OB.section.lifestyle}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingSelectGrid label="Hva er viktigst for deg nå?" mikroguiding="Velg det som kjennes mest riktig" options={[{ value: 'karriere', label: 'Karriere og mål', icon: '🎯' }, { value: 'familie', label: 'Familie og nære relasjoner', icon: '👨‍👩‍👧‍👦' }, { value: 'venner', label: 'Venner og fellesskap', icon: '🤝' }, { value: 'personlig-vekst', label: 'Personlig vekst og læring', icon: '🌱' }, { value: 'frihet', label: 'Frihet og selvstendighet', icon: '🕊️' }, { value: 'spirituell', label: 'Spirituell/religiøst livssyn', icon: '✨' }]} selectedValue={getValue('highPriority', '')} onChange={(v) => onChange('highPriority', v)} maxSelected={2} />

      {/* ────────────────────────────────────────────────────── */}
      {/* Nye hverdagsvalg (LIVSSTIL-2026, D-2/D-4) — alle valgfrie */}
      {/* ────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '28px', marginBottom: '20px' }} />

      {/* bil + vektmodell */}
      <div>
        <OnboardingSelectGrid label="Hvordan kommer du deg rundt?" mikroguiding="Velg det som beskriver deg best." options={[
          { value: 'full-el', label: 'Full lader', icon: '🔌' },
          { value: 'phev', label: 'Plug-in hybrid', icon: '⚡' },
          { value: 'bensin', label: 'Bensin', icon: '⛽' },
          { value: 'diesel', label: 'Diesel', icon: '🛢️' },
          { value: 'esykkel-ingen', label: 'Elsykkel / kollektiv', icon: '🚲' },
        ]} selectedValue={getValue('bil', '')} onChange={(v) => onChange('bil', v)} maxSelected={1} columns={2} testId="ob-l2026-bil" />
        <Valgvikt value={getValue('bilViktig', '')} onChange={(v) => onChange('bilViktig', v)} testId="ob-l2026-bil-viktig" />
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* kosthold + vektmodell */}
      <div>
        <OnboardingSelectGrid label="Hvordan spiser du?" mikroguiding="Velg opptil to." options={[
          { value: 'spiser-koett', label: 'Spiser det meste', icon: '🍖' },
          { value: 'fleksitar', label: 'Mest plantebasert', icon: '🥗' },
          { value: 'vegetar', label: 'Vegetar', icon: '🥦' },
          { value: 'vegan', label: 'Vegan', icon: '🌱' },
          { value: 'fisk', label: 'Fokus på fisk', icon: '🐟' },
        ]} selectedValue={getValue('kosthold', '')} onChange={(v) => handleKostholdChange(v)} maxSelected={2} columns={2} testId="ob-l2026-kosthold" />
        <Valgvikt value={getValue('kostholdViktig', '')} onChange={(v) => onChange('kostholdViktig', v)} testId="ob-l2026-kosthold-viktig" />
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* klima — 3 trinn, ingen vektmodell */}
      <OnboardingSelectGrid label="Hvor viktig er klima og miljø for deg?" mikroguiding="Velg det som kjennes mest riktig." options={[
        { value: 'veldig-viktig', label: 'Veldig viktig', icon: '🌍' },
        { value: 'viktig', label: 'Viktig', icon: '🌿' },
        { value: 'ikke-stor-sak', label: 'Ikke en stor sak', icon: '🤷' },
      ]} selectedValue={getValue('klima', '')} onChange={(v) => onChange('klima', v)} columns={1} testId="ob-l2026-klima" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* alkohol + vektmodell */}
      <div>
        <OnboardingSelectGrid label="Hvordan er det med alkohol?" mikroguiding="Velg det som gjelder for deg." options={[
          { value: 'aldri', label: 'Aldri', icon: '🚫' },
          { value: 'sjelden', label: 'Sjelden', icon: '🥂' },
          { value: 'helligdager', label: 'Ved helligdager', icon: '🎄' },
          { value: 'ofte', label: 'Ofte', icon: '🍷' },
        ]} selectedValue={getValue('alkohol', '')} onChange={(v) => onChange('alkohol', v)} columns={2} testId="ob-l2026-alkohol" />
        <Valgvikt value={getValue('alkoholViktig', '')} onChange={(v) => onChange('alkoholViktig', v)} testId="ob-l2026-alkohol-viktig" />
      </div>
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* aktivitet — flervalg */}
      <div>
        <OnboardingSelectGrid label="Hvor aktiv er du?" mikroguiding="Velg opptil tre — hva fyller fritiden din?" options={[
          { value: 'gym', label: 'Gym og trening', icon: '🏋️' },
          { value: 'lop-turer', label: 'Løping og turer', icon: '🏃' },
          { value: 'lagidrett', label: 'Lagidrett', icon: '⚽' },
          { value: 'natur-fritid', label: 'Natur og fritid', icon: '🥾' },
          { value: 'lite', label: 'Tar det rolig', icon: '🛋️' },
        ]} selectedValue={getValue('aktivitet', '')} onChange={(v) => onChange('aktivitet', v)} maxSelected={3} columns={2} testId="ob-l2026-aktivitet" />
        <Valgvikt value={getValue('aktivitetViktig', '')} onChange={(v) => onChange('aktivitetViktig', v)} testId="ob-l2026-aktivitet-viktig" />
      </div>
      {/* FORSKNINGSMOTOR F-5 — PVQ-10 (verdier) */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '28px', marginBottom: '8px' }} />
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Noen ting som kan være viktige. Hvor viktig er hvert for deg — i et parforhold?
      </p>
      <div className="space-y-3">
        {PVQ10.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
            accentColor={OB.section.lifestyle}
          />
        ))}
      </div>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}