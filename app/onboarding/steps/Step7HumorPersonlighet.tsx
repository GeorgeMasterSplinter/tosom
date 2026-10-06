'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { COMMUNICATION } from '@/lib/psychometrics/instruments';
import { missingScaleItems } from '@/lib/validation/onboarding-steps';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  // PL-08b (D-1): skalasvarene er påkrevd per steg.
  const missing = missingScaleItems(d, COMMUNICATION);
  if (missing.length > 0) e.push({ field: missing[0], message: 'Svar på alle påstandene — det finnes ingen fasit.' });
  return e;
};
export default function Step7HumorPersonlighet({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  return (
    <OnboardingSlide title="Kommunikasjon & tilpasning" subtitle="Hvordan møter du endring og avklaring i en relasjon?" guidingText="Slik dere kommuniserer, er like viktig som hva dere deler." slideIndex={8} totalSlides={13}
      accentColor={OB.section.personality}>
      {/* PL-08b: error summary, samme mønster som de øvrige stegene */}
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      {/* FORSKNINGSMOTOR F-5 — Kommunikasjon & tilpasning (humor-trinn erstattet) */}
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Noen påstander om hvordan du reagerer. Svar det som kjennes mest riktig — det finnes ingen fasit.
      </p>
      <div className="space-y-3">
        {COMMUNICATION.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
            accentColor={OB.section.personality}
          />
        ))}
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Svar på alle påstandene' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}
