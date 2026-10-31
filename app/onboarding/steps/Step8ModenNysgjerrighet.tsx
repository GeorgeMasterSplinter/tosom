'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { ERQ6 } from '@/lib/psychometrics/instruments';
import { missingScaleItems } from '@/lib/validation/onboarding-steps';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  // LIVSSTIL-2026 (D-5): 4 felt konvertert til valg-grid; boundary er valgfri
  // kort fritekst. Kun ERQ-6-skalaen må svares.
  // PL-08b (D-1): skalasvarene er påkrevd per steg.
  const missing = missingScaleItems(d, ERQ6);
  if (missing.length > 0) e.push({ field: missing[0], message: 'Svar på alle påstandene.' });
  return e;
};
export default function Step8ModenNysgjerrighet({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  return (
    <OnboardingSlide title="Følelser i hverdagen" subtitle="Disse spørsmålene handler om hvordan du vanligvis forholder deg til og uttrykker følelser." guidingText="Dette er et rolig øyeblikk for deg — del bare det du kjenner deg trygg med." slideIndex={10} totalSlides={13}
      accentColor={OB.section.boundaries}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <div className="space-y-3">
        {ERQ6.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
            accentColor={OB.section.boundaries}
          />
        ))}
      </div>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}