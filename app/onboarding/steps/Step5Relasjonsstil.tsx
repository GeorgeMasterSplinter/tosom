/**
 * ToSom — Steg 5b: Relasjonsstil (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */
'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  if (!String(d['relationshipSeeking'] ?? '').trim()) e.push({ field: 'relationshipSeeking', message: 'Velg hva type relasjon du søker.' });
  if (!String(d['closenessNeed'] ?? '').trim()) e.push({ field: 'closenessNeed', message: 'Velg hvor mye nærhet du trenger.' });
  return e;
};
export default function Step5Relasjonsstil({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  return (
    <OnboardingSlide title="Relasjonsstil" subtitle="Hvordan søker du relasjon — og hvordan balanserer du selvstende med fellesskap?" guidingText="Relasjonsstil forteller oss hvordan du søker — og det er like viktig som verdier." slideIndex={6} totalSlides={13}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingSelectGrid label="Hva type relasjon søker du? *" mikroguiding="Velg det som kjennes mest riktig" options={[{ value: 'langvarig', label: 'Langvarig, dyp relasjon', icon: '💍' }, { value: 'partnerskap', label: 'Partnerskap med felles liv', icon: '🏡' }, { value: 'komplisert', label: 'Noe mer uavklagt ennå', icon: '🤔' }]} selectedValue={getValue('relationshipSeeking', '')} onChange={(v) => onChange('relationshipSeeking', v)} />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hvor mye nærhet trenger du? *" mikroguiding="Det er ingen rette eller gale svar her" options={[{ value: 'mykje', label: 'Mye — jeg vil tilbringe mest tid sammen', icon: '💞' }, { value: 'balansert', label: 'Balansert — nær men med eget rom', icon: '⚖️' }, { value: 'lite', label: 'Lite — jeg trenger mye eget rom', icon: '🏔️' }]} selectedValue={getValue('closenessNeed', '')} onChange={(v) => onChange('closenessNeed', v)} />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hvordan balanserer du selvstende med fellesskap? *" value={getValue('independenceBalance', '')} onChange={(v) => onChange('independenceBalance', v)} placeholder="Skriv f.eks. Jeg trenger tid alene for å lade batteriene, men elsker også å dele hverdagen" mikroguiding="Skriv f.eks. Jeg trenger tid alene for å lade batteriene, men elsker også å dele hverdagen" maxLength={300} minChars={10} rows={4} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Relasjonsstilen din er viktig for å finne noen som passer deg.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}