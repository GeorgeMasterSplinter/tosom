/**
 * Tosom — Steg 6: Framtid & visjon (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */
'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
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
  const placeholders: Record<string, string> = {
    futureVision: 'Beskriv livet du ser for deg om 5–10 år med konkrete elementer — hvilke verdier, omgivelser og relasjoner som vil gi deg meningsfullhet',
    dreamGoal: 'Identifiser den mest personlige visjonen du bærer på — beskriv den slik du ser den, og hvorfor den har så stor betydning for deg',
    buildTogether: 'Tenk på hva dere kan skape sammen over tid — del konkrete forestillinger om felles rutiner, mål og måter å møte utfordringer på',
    experienceAlone: 'Beskriv en opplevelse eller reise du ønsker å gjøre alene, og hva du håper å lære om deg selv gjennom den',
    experienceTogether: 'Del konkrete hverdagslige øyeblikk du drømmer om å dele med noen — de små, gjentatte ritualer som bygger fellesskap',
  };
  const labels: Record<string, string> = { futureVision: 'Hva er din fremtidsvisjon?', dreamGoal: 'Hva er din største drøm?', buildTogether: 'Hva kan dere bygge sammen?', experienceAlone: 'Hva vil du oppleve alene?', experienceTogether: 'Hva vil du oppleve sammen?' };
  return (
    <OnboardingSlide title="Framtid & visjon" subtitle="Hva drømmer du om å bygge?" guidingText="Framtidsønsker viser veien for hva dere kan bygge sammen." slideIndex={7} totalSlides={13}
      accentColor={OB.section.values}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingTextField label={`${labels['futureVision']} *`} value={getValue('futureVision', '')} onChange={(v) => onChange('futureVision', v)} placeholder={placeholders['futureVision']} mikroguiding={guiding['futureVision']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['dreamGoal']} *`} value={getValue('dreamGoal', '')} onChange={(v) => onChange('dreamGoal', v)} placeholder={placeholders['dreamGoal']} mikroguiding={guiding['dreamGoal']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['buildTogether']} *`} value={getValue('buildTogether', '')} onChange={(v) => onChange('buildTogether', v)} placeholder={placeholders['buildTogether']} mikroguiding={guiding['buildTogether']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['experienceAlone']} *`} value={getValue('experienceAlone', '')} onChange={(v) => onChange('experienceAlone', v)} placeholder={placeholders['experienceAlone']} mikroguiding={guiding['experienceAlone']} maxLength={500} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['experienceTogether']} *`} value={getValue('experienceTogether', '')} onChange={(v) => onChange('experienceTogether', v)} placeholder={placeholders['experienceTogether']} mikroguiding={guiding['experienceTogether']} maxLength={500} minChars={10} rows={3} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Framtidsønsker viser veien for hva dere kan bygge sammen.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}