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
  for (const k of ['intimacySafety','comfortableWith','boundary','nearerType','needsTime']) { const v = String(d[k] ?? '').trim(); if (!v || v.length < 10) e.push({ field: k, message: 'Skriv minst 10 tegn om feltet.' }); }
  return e;
};
export default function Step8ModenNysgjerrighet({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  const guiding: Record<string, string> = { intimacySafety: 'Skriv f.eks. At noen trygger meg før noe dypt skjer', comfortableWith: 'Skriv f.eks. Å dele sårbarhet uten å bli dømt', boundary: 'Skriv f.eks. Jeg trenger tydelige signaler om når ting blir for mykje', nearerType: 'Skriv f.eks. Ro, stille samtaler om noe som betyr mye', needsTime: 'Skriv f.eks. Tid til å bearbeide følelser før jeg deler dem' };
  const labels: Record<string, string> = { intimacySafety: 'Hva gjør intimitet trygg for deg?', comfortableWith: 'Hva er du komfortabel med i nærheten?', boundary: 'Hva er din personlige grense?', nearerType: 'Hva type nærhet søker du?', needsTime: 'Hvor mye tid trenger du for å åpne deg?' };
  return (
    <OnboardingSlide title="Moden nysgjerrighet" subtitle="Hva trenger du for å kjenne deg trygg i nærheten?" guidingText="Dette er et rolig øyeblikk for deg — del bare det du kjenner deg trygg med." slideIndex={10} totalSlides={13}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingTextField label={`${labels['intimacySafety']} *`} value={getValue('intimacySafety', '')} onChange={(v) => onChange('intimacySafety', v)} placeholder={`Skriv f.eks. ${guiding['intimacySafety'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['intimacySafety'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['intimacySafety']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['comfortableWith']} *`} value={getValue('comfortableWith', '')} onChange={(v) => onChange('comfortableWith', v)} placeholder={`Skriv f.eks. ${guiding['comfortableWith'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['comfortableWith'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['comfortableWith']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['boundary']} *`} value={getValue('boundary', '')} onChange={(v) => onChange('boundary', v)} placeholder={`Skriv f.eks. ${guiding['boundary'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['boundary'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['boundary']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['nearerType']} *`} value={getValue('nearerType', '')} onChange={(v) => onChange('nearerType', v)} placeholder={`Skriv f.eks. ${guiding['nearerType'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['nearerType'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['nearerType']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['needsTime']} *`} value={getValue('needsTime', '')} onChange={(v) => onChange('needsTime', v)} placeholder={`Skriv f.eks. ${guiding['needsTime'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['needsTime'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['needsTime']} maxLength={300} minChars={10} rows={3} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Modne svar viser hvem du er — del bare det du kjenner deg trygg med.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}