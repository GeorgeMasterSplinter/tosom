/**
 * Tosom — Steg 6: Framtid & visjon (Premium rebuild 2026 — Fase 4)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */
'use client';
import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; step: number; goToStep: (s: number) => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  // LIVSSTIL-2026 (D-5): futureVision/experienceAlone/experienceTogether er nå
  // valg-grid; dreamGoal er valgfri kort; kun buildTogether (varme) blokkerer.
  const bt = String(d['buildTogether'] ?? '').trim();
  if (!bt || bt.length < 10) e.push({ field: 'buildTogether', message: 'Skriv minst 10 tegn om hva dere kan bygge sammen.' });
  return e;
};
export default function Step6FramtidVisjon({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  const guiding: Record<string, string> = { futureVision: 'Skriv f.eks. Jeg drømmer om et rolig liv med dype relasjoner', dreamGoal: 'Skriv f.eks. Å bygge et eget hus i naturen sammen med noen jeg elsker', buildTogether: 'Skriv f.eks. En hverdag der vi deler både moro og utfordringer', experienceAlone: 'Skriv f.eks. Å reise alene til Japan for å lære om meg selv', experienceTogether: 'Skriv f.eks. Å lage mat sammen kveld etter kveld' };
  const labels: Record<string, string> = { futureVision: 'Hva er din fremtidsvisjon?', dreamGoal: 'Hva er din største drøm?', buildTogether: 'Hva kan dere bygge sammen?', experienceAlone: 'Hva vil du oppleve alene?', experienceTogether: 'Hva vil du oppleve sammen?' };
  return (
    <OnboardingSlide title="Framtid & visjon" subtitle="Hva drømmer du om å bygge?" guidingText="Framtidsønsker viser veien for hva dere kan bygge sammen." slideIndex={7} totalSlides={13}
      accentColor={OB.section.values}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      {/* LIVSSTIL-2026 (D-5): 3 felt konvertert til valg-grid; dreamGoal valgfri;
          buildTogether beholdes som det «varme» feltet. */}
      <OnboardingSelectGrid label={`${labels['futureVision'].replace('?', '')} *`} mikroguiding="Velg det som kjennes mest riktig." options={[
        { value: 'ro-og-stabilitet', label: 'Ro og stabilitet', icon: '🌿' },
        { value: 'vekst-og-maal', label: 'Vekst og mål', icon: '📈' },
        { value: 'familie-og-hjem', label: 'Familie og hjem', icon: '🏡' },
        { value: 'frihet-og-reiser', label: 'Frihet og reiser', icon: '🧭' },
      ]} selectedValue={getValue('futureVision', '')} onChange={(v) => onChange('futureVision', v)} columns={2} testId="ob-future-vision" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={labels['dreamGoal']} value={getValue('dreamGoal', '')} onChange={(v) => onChange('dreamGoal', v)} placeholder="Noe du drømmer om — del det hvis du kjenner deg trygg med det" mikroguiding={guiding['dreamGoal']} maxLength={300} rows={2} multiline testId="ob-dream-goal" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label={`${labels['buildTogether']} *`} value={getValue('buildTogether', '')} onChange={(v) => onChange('buildTogether', v)} placeholder="Hva kan dere skape sammen over tid?" mikroguiding={guiding['buildTogether']} maxLength={300} minChars={10} rows={2} multiline testId="ob-build-together" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['experienceAlone']} mikroguiding="Velg det som betyr mest for deg." options={[
        { value: 'reiser', label: 'Reiser', icon: '✈️' },
        { value: 'natur', label: 'Natur', icon: '🌲' },
        { value: 'kreativt-arbeid', label: 'Kreativt arbeid', icon: '🎨' },
        { value: 'hobier', label: 'Hobier', icon: '🎸' },
      ]} selectedValue={getValue('experienceAlone', '')} onChange={(v) => onChange('experienceAlone', v)} columns={2} testId="ob-experience-alone" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label={labels['experienceTogether']} mikroguiding="Velg det dere kan dele." options={[
        { value: 'hverdags-ritualer', label: 'Hverdags-ritualer', icon: '☕' },
        { value: 'reiser-sammen', label: 'Reiser sammen', icon: '🗺️' },
        { value: 'bygge-noe-felles', label: 'Bygge noe felles', icon: '🏗️' },
        { value: 'kos-og-fellesskap', label: 'Kos og fellesskap', icon: '🫶' },
      ]} selectedValue={getValue('experienceTogether', '')} onChange={(v) => onChange('experienceTogether', v)} columns={2} testId="ob-experience-together" />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.6)' }}>Framtidsønsker viser veien for hva dere kan bygge sammen.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}