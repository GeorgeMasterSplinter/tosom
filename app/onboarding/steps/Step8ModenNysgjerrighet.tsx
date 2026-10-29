'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
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
  const guiding: Record<string, string> = { 
    intimacySafety: 'Skriv f.eks. At noen trygger meg før noe dypt skjer', 
    comfortableWith: 'Skriv f.eks. Å dele sårbarhet uten å bli dømt', 
    boundary: 'Skriv f.eks. Jeg trenger tydelige signaler om når ting blir for mye', 
    nearerType: 'Skriv f.eks. Ro, stille samtaler om noe som betyr mye', 
    needsTime: 'Skriv f.eks. Tid til å bearbeide følelser før jeg deler dem' 
  };
  const labels: Record<string, string> = { intimacySafety: 'Hva gjør intimitet trygg for deg?', comfortableWith: 'Hva er du komfortabel med i nærheten?', boundary: 'Hva er din personlige grense?', nearerType: 'Hva type nærhet søker du?', needsTime: 'Hvor mye tid trenger du for å åpne deg?' };
  return (
    <OnboardingSlide title="Moden nysgjerrighet" subtitle="Hva trenger du for å kjenne deg trygg i nærheten?" guidingText="Dette er et rolig øyeblikk for deg — del bare det du kjenner deg trygg med." slideIndex={10} totalSlides={13}
      accentColor={OB.section.boundaries}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      {/* LIVSSTIL-2026 (D-5): 4 felt konvertert til valg-grid; boundary valgfri */}
      <OnboardingSelectGrid label={labels['intimacySafety']} mikroguiding="Velg det som gjør at du kan senke vaktene." options={[
        { value: 'tydelighet', label: 'Tydelighet', icon: '💎' },
        { value: 'langsomt-tempo', label: 'Langsommere tempo', icon: '🐢' },
        { value: 'ord-for-naerhet', label: 'Ord før nærhet', icon: '💬' },
        { value: 'trygghet-hjemme', label: 'Trygghet hjemme', icon: '🏡' },
      ]} selectedValue={getValue('intimacySafety', '')} onChange={(v) => onChange('intimacySafety', v)} columns={2} testId="ob-intimacy-safety" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['comfortableWith']} mikroguiding="Velg det du i dag kjente deg trygg med å dele." options={[
        { value: 'stille-samtaler', label: 'Stille samtaler', icon: '🌙' },
        { value: 'fysisk-naerhet', label: 'Fysisk nærhet', icon: '🤗' },
        { value: 'dele-hverdager', label: 'Dele hverdager', icon: '☕' },
        { value: 'svarbarhet', label: 'Sårbarhet', icon: '💛' },
      ]} selectedValue={getValue('comfortableWith', '')} onChange={(v) => onChange('comfortableWith', v)} columns={2} testId="ob-comfortable-with" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      {/* Valgfri kort fritekst — den personlige grensen */}
      <OnboardingTextField label={labels['boundary']} value={getValue('boundary', '')} onChange={(v) => onChange('boundary', v)} placeholder="Hva er din personlige grense i nærhet?" mikroguiding={guiding['boundary']} maxLength={300} rows={2} multiline testId="ob-personal-boundary" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['nearerType']} mikroguiding="Velg det typen nærhet og kontakt du søker aktivt." options={[
        { value: 'ro-og-stille', label: 'Ro og stille', icon: '🕯️' },
        { value: 'fysisk-kontakt', label: 'Fysisk kontakt', icon: '🫂' },
        { value: 'dype-samtaler', label: 'Dype samtaler', icon: '💬' },
        { value: 'felles-aktivitet', label: 'Felles aktivitet', icon: '🥾' },
      ]} selectedValue={getValue('nearerType', '')} onChange={(v) => onChange('nearerType', v)} columns={2} testId="ob-nearer-type" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['needsTime']} mikroguiding="Velg ditt eget tempo for åpenhet." options={[
        { value: 'lite-tid', label: 'Lite tid', icon: '⚡' },
        { value: 'noen-dager', label: 'Noen dager', icon: '📅' },
        { value: 'noen-uker', label: 'Noen uker', icon: '🗓️' },
        { value: 'eget-tempo', label: 'Mitt eget tempo', icon: '🐢' },
      ]} selectedValue={getValue('needsTime', '')} onChange={(v) => onChange('needsTime', v)} columns={2} testId="ob-needs-time" />
      {/* Følelser i hverdagen — spørsmålene handler om hvordan man vanligvis
          håndterer og uttrykker følelser (internen kilde: ERQ-6, usynlig
          for brukeren). */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '28px', marginBottom: '8px' }} />
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Følelser i hverdagen. Disse spørsmålene handler om hvordan du vanligvis
        forholder deg til og uttrykker følelser.
      </p>
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