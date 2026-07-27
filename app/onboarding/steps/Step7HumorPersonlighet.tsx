'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  const qh = String(d['quirkyHabit'] ?? '').trim(); if (!qh || qh.length < 5) e.push({ field: 'quirkyHabit', message: 'Skriv minst 5 tegn om en quirky vane.' });
  const gp = String(d['guiltyPleasure'] ?? '').trim(); if (!gp || gp.length < 10) e.push({ field: 'guiltyPleasure', message: 'Skriv minst 10 tegn om din guilty pleasure.' });
  const ty = String(d['totallyYou'] ?? '').trim(); if (!ty || ty.length < 10) e.push({ field: 'totallyYou', message: 'Skriv minst 10 tegn om noe som er helt deg.' });
  return e;
};
export default function Step7HumorPersonlighet({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  return (
    <OnboardingSlide title="Lek, humor & personlighet" subtitle="De små detaljene som gjør deg til deg." guidingText="De små detaljene — som humor — forteller hvem du er." slideIndex={8} totalSlides={13}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingTextField label="Hva får deg til å le mest? *" value={getValue('laughterTrigger', '')} onChange={(v) => onChange('laughterTrigger', v)} placeholder="Skriv f.eks. Når noen prøver å være seriøs" mikroguiding="Skriv f.eks. Når noen prøver å være seriøs klarer ikke å holde ansiktet" maxLength={200} minChars={5} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva er en quirky vane du har? *" value={getValue('quirkyHabit', '')} onChange={(v) => onChange('quirkyHabit', v)} placeholder="Skriv f.eks. Jeg sorterer snacks etter farger" mikroguiding="Skriv f.eks. Jeg sorterer snacks etter farger i skuffen" maxLength={200} minChars={5} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva er din guilty pleasure? *" value={getValue('guiltyPleasure', '')} onChange={(v) => onChange('guiltyPleasure', v)} placeholder="Skriv f.eks. Jeg ser reality-TV alene" mikroguiding="Skriv f.eks. Jeg ser reality-TV alene på nettsider" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva er noe som kjennes helt deg? *" value={getValue('totallyYou', '')} onChange={(v) => onChange('totallyYou', v)} placeholder="Skriv f.eks. Jeg kan snakke om kaffe i timer" mikroguiding="Skriv f.eks. Jeg kan snakke i timer om kaffe uten å bli lei meg" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva tror du partneren din ville le av? *" value={getValue('partnerWouldLaugh', '')} onChange={(v) => onChange('partnerWouldLaugh', v)} placeholder="Skriv f.eks. Hvordan jeg danser i kjøkkenet" mikroguiding="Skriv f.eks. Hvordan jeg danser i kjøkkenen når ingen ser" maxLength={200} minChars={5} rows={3} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Dei små detaljene — som humor — forteller hvem du er.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}