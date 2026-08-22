'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { ERQ6 } from '@/lib/psychometrics/instruments';
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
  const guiding: Record<string, string> = { 
    intimacySafety: 'Skriv f.eks. At noen trygger meg før noe dypt skjer', 
    comfortableWith: 'Skriv f.eks. Å dele sårbarhet uten å bli dømt', 
    boundary: 'Skriv f.eks. Jeg trenger tydelige signaler om når ting blir for mye', 
    nearerType: 'Skriv f.eks. Ro, stille samtaler om noe som betyr mye', 
    needsTime: 'Skriv f.eks. Tid til å bearbeide følelser før jeg deler dem' 
  };
  const placeholders: Record<string, string> = {
    intimacySafety: 'Beskriv den spesifikke betingelsen eller handlingen som gjør at du kan la vaktene senke deg når det kommer intimitet',
    comfortableWith: 'Reflekter over hva du i dag kjente deg trygg med å dele i en nær relasjon — og hva som gjør at akkurat dette føles trygt',
    boundary: 'Definer tydelig hva som utgjør din personlige grense i nærhet, og hvilken type signal fra partneren som hjelper deg å navigere den',
    nearerType: 'Beskriv den typen nærhet og kontakt du søker aktivt — med konkrete eksempler på atmosfære og form for samvær som gir deg mest',
    needsTime: 'Forhold deg til ditt eget tempo for åpenhet — hvor lang tid og hvilke typer mellomrom trenger du for å kjenne deg trygg nok til å dele dypt',
  };
  const labels: Record<string, string> = { intimacySafety: 'Hva gjør intimitet trygg for deg?', comfortableWith: 'Hva er du komfortabel med i nærheten?', boundary: 'Hva er din personlige grense?', nearerType: 'Hva type nærhet søker du?', needsTime: 'Hvor mye tid trenger du for å åpne deg?' };
  return (
    <OnboardingSlide title="Moden nysgjerrighet" subtitle="Hva trenger du for å kjenne deg trygg i nærheten?" guidingText="Dette er et rolig øyeblikk for deg — del bare det du kjenner deg trygg med." slideIndex={10} totalSlides={13}
      accentColor={OB.section.boundaries}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingTextField label={`${labels['intimacySafety']} *`} value={getValue('intimacySafety', '')} onChange={(v) => onChange('intimacySafety', v)} placeholder={placeholders['intimacySafety']} mikroguiding={guiding['intimacySafety']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['comfortableWith']} *`} value={getValue('comfortableWith', '')} onChange={(v) => onChange('comfortableWith', v)} placeholder={placeholders['comfortableWith']} mikroguiding={guiding['comfortableWith']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['boundary']} *`} value={getValue('boundary', '')} onChange={(v) => onChange('boundary', v)} placeholder={placeholders['boundary']} mikroguiding={guiding['boundary']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['nearerType']} *`} value={getValue('nearerType', '')} onChange={(v) => onChange('nearerType', v)} placeholder={placeholders['nearerType']} mikroguiding={guiding['nearerType']} maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['needsTime']} *`} value={getValue('needsTime', '')} onChange={(v) => onChange('needsTime', v)} placeholder={placeholders['needsTime']} mikroguiding={guiding['needsTime']} maxLength={300} minChars={10} rows={3} multiline />
      {/* FORSKNINGSMOTOR F-5 — ERQ-6 (emotiv romslighet) */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '28px', marginBottom: '8px' }} />
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Romslighet i kjønnsrelaterte roller. Svar det som kjennes mest riktig.
      </p>
      <div className="space-y-3">
        {ERQ6.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
          />
        ))}
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Modne svar viser hvem du er — del bare det du kjenner deg trygg med.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}