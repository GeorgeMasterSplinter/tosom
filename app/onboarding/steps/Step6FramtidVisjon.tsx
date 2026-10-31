/**
 * Tosom — Steg 6: Framtid & visjon (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */
'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (_d: Record<string, unknown>): ValidationError[] => {
  // O2 P1: dreamGoal + buildTogether tatt ut av aktiv innsamling — ingenting blokkerer steget.
  // (futureVision/experienceAlone/experienceTogether er valgfrie valg-grid.)
  return [];
};
export default function Step6FramtidVisjon({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  const labels: Record<string, string> = { futureVision: 'Hva er din fremtidsvisjon?', experienceAlone: 'Hva vil du oppleve alene?', experienceTogether: 'Hva vil du oppleve sammen?' };
  return (
    <OnboardingSlide title="Framtid & visjon" subtitle="Hva drømmer du om å bygge?" guidingText="Framtidsønsker viser veien for hva dere kan bygge sammen." slideIndex={7} totalSlides={13}
      accentColor={OB.section.values}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      {/* O2 P1: 3 valgfrie valg-grid (futureVision/experienceAlone/experienceTogether).
          dreamGoal + buildTogether tatt ut av aktiv innsamling. */}
      <OnboardingSelectGrid label={labels['futureVision']} mikroguiding="Velg det som kjennes mest riktig." options={[
        { value: 'ro-og-stabilitet', label: 'Ro og stabilitet', icon: '🌿' },
        { value: 'vekst-og-maal', label: 'Vekst og mål', icon: '📈' },
        { value: 'familie-og-hjem', label: 'Familie og hjem', icon: '🏡' },
        { value: 'frihet-og-reiser', label: 'Frihet og reiser', icon: '🧭' },
      ]} selectedValue={getValue('futureVision', '')} onChange={(v) => onChange('futureVision', v)} columns={2} testId="ob-future-vision" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['experienceAlone']} mikroguiding="Velg det som betyr mest for deg." options={[
        { value: 'reiser', label: 'Reiser', icon: '✈️' },
        { value: 'natur', label: 'Natur', icon: '🌲' },
        { value: 'kreativt-arbeid', label: 'Kreativt arbeid', icon: '🎨' },
        { value: 'hobier', label: 'Hobbyer', icon: '🎸' },
      ]} selectedValue={getValue('experienceAlone', '')} onChange={(v) => onChange('experienceAlone', v)} columns={2} testId="ob-experience-alone" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['experienceTogether']} mikroguiding="Velg det dere kan dele." options={[
        { value: 'hverdags-ritualer', label: 'Hverdags-ritualer', icon: '☕' },
        { value: 'reiser-sammen', label: 'Reiser sammen', icon: '🗺️' },
        { value: 'bygge-noe-felles', label: 'Bygge noe felles', icon: '🏗️' },
        { value: 'kos-og-fellesskap', label: 'Kos og fellesskap', icon: '🫶' },
      ]} selectedValue={getValue('experienceTogether', '')} onChange={(v) => onChange('experienceTogether', v)} columns={2} testId="ob-experience-together" />
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}