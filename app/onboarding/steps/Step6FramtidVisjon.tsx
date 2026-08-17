/**
 * Tosom — Steg 6: Framtid & visjon (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */
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
  for (const k of ['futureVision','dreamGoal','buildTogether','experienceAlone','experienceTogether']) { const v = String(d[k] ?? '').trim(); if (!v || v.length < 10) e.push({ field: k, message: 'Skriv minst 10 tegn om feltet.' }); }
  return e;
};
export default function Step6FramtidVisjon({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  const guiding: Record<string, string> = { futureVision: 'Skriv f.eks. Jeg drømmer om et rolig liv med dype relasjoner', dreamGoal: 'Skriv f.eks. Å bygge et eget hus i naturen sammen med noen jeg elsker', buildTogether: 'Skriv f.eks. En hverdag der vi deler både moro og utfordringer', experienceAlone: 'Skriv f.eks. Å reise alene til Japan for å lære om meg selv', experienceTogether: 'Skriv f.eks. Å lage mat sammen kveld etter kveld' };
  const labels: Record<string, string> = { futureVision: 'Hva er din framtidvisjon?', dreamGoal: 'Hva er din største drøm?', buildTogether: 'Hva kan dere bygge sammen?', experienceAlone: 'Hva vil du oppleve alene?', experienceTogether: 'Hva vil du oppleve sammen?' };
  return (
    <OnboardingSlide title="Framtid & visjon" subtitle="Hva drømmer du om å bygge?" guidingText="Framtidsønsker viser veien for hva dere kan bygge sammen." slideIndex={7} totalSlides={13}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingTextField label={`${labels['futureVision']} *`} value={getValue('futureVision', '')} onChange={(v) => onChange('futureVision', v)} placeholder={`Skriv f.eks. ${guiding['futureVision'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['futureVision'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['futureVision']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['dreamGoal']} *`} value={getValue('dreamGoal', '')} onChange={(v) => onChange('dreamGoal', v)} placeholder={`Skriv f.eks. ${guiding['dreamGoal'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['dreamGoal'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['dreamGoal']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['buildTogether']} *`} value={getValue('buildTogether', '')} onChange={(v) => onChange('buildTogether', v)} placeholder={`Skriv f.eks. ${guiding['buildTogether'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['buildTogether'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['buildTogether']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['experienceAlone']} *`} value={getValue('experienceAlone', '')} onChange={(v) => onChange('experienceAlone', v)} placeholder={`Skriv f.eks. ${guiding['experienceAlone'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['experienceAlone'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['experienceAlone']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['experienceTogether']} *`} value={getValue('experienceTogether', '')} onChange={(v) => onChange('experienceTogether', v)} placeholder={`Skriv f.eks. ${guiding['experienceTogether'].replace('Skriv f.eks. ', '').charAt(0).toLowerCase() + guiding['experienceTogether'].replace('Skriv f.eks. ', '').slice(1)}`} mikroguiding={guiding['experienceTogether']} maxLength={500} minChars={10} rows={3} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Framtidsønsker viser veien for hva dere kan bygge sammen.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}