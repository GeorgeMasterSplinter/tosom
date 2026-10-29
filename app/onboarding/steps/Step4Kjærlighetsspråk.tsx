/**
 * Tosom — Steg 4: Kjærlighetsspråk & nærhet (Premium rebuild 2026 — Fase 4)
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
  if (!String(d['loveGive'] ?? '').trim()) e.push({ field: 'loveGive', message: 'Velg hvordan du viser kjærlighet.' });
  if (!String(d['loveReceive'] ?? '').trim()) e.push({ field: 'loveReceive', message: 'Velg hvordan du ønsker kjærlighet.' });
  // LIVSSTIL-2026 (D-5): closenessBuilder/distanceCreator er nå valg-grid;
  // smallThing er valgfri kort fritekst.
  return e;
};

export default function Step4Kjærlighetsspråk({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };

  return (
    <OnboardingSlide title="Kjærlighetsspråk & nærhet" subtitle="Hvordan viser og mottar du kjærlighet?" guidingText="Hvordan du viser kjærlighet er viktig for å finne noen som passer deg." slideIndex={4} totalSlides={13}
      accentColor={OB.section.values}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingSelectGrid label="Hvordan viser du kjærlighet?" mikroguiding="Velg det som passer best" options={[{ value: 'ord', label: 'Ord og ros', icon: '💬' }, { value: 'tjenester', label: 'Gjør ting for andre', icon: '🎁' }, { value: 'tid', label: 'Kvalitetstid sammen', icon: '⏰' }, { value: 'kjønnlig', label: 'Fysiske klemmer og berøring', icon: '🤗' }, { value: 'gaver', label: 'Å gi gaver', icon: '🎀' }]} selectedValue={getValue('loveGive', '')} onChange={(v) => onChange('loveGive', v)} maxSelected={2} testId="ob-love-give" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hvordan ønsker du kjærlighet?" mikroguiding="Velg det som får deg til å kjenne deg elsket" options={[{ value: 'ord', label: 'Ord og ros', icon: '💬' }, { value: 'tjenester', label: 'Gjør ting for meg', icon: '🎁' }, { value: 'tid', label: 'Kvalitetstid sammen', icon: '⏰' }, { value: 'kjønnlig', label: 'Fysiske klemmer og berøring', icon: '🤗' }, { value: 'gaver', label: 'Å få gaver', icon: '🎀' }]} selectedValue={getValue('loveReceive', '')} onChange={(v) => onChange('loveReceive', v)} maxSelected={2} testId="ob-love-receive" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      {/* LIVSSTIL-2026 (D-5): fritekst konvertert til valg-grid */}
      <OnboardingSelectGrid label="Hva bygger nærhet mellom mennesker?" mikroguiding="Velg det som betyr mest for deg." options={[
        { value: 'dype-samtaler', label: 'Dype samtaler', icon: '💬' },
        { value: 'felles-aktivitet', label: 'Felles aktivitet', icon: '🥾' },
        { value: 'fysisk-naerhet', label: 'Fysisk nærhet', icon: '🤗' },
        { value: 'smaa-ritualer', label: 'Små ritualer', icon: '☕' },
      ]} selectedValue={getValue('closenessBuilder', '')} onChange={(v) => onChange('closenessBuilder', v)} columns={2} testId="ob-closeness-builder" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hva skaper avstand mellom deg og andre?" mikroguiding="Velg det som kjennes mest kjent." options={[
        { value: 'stress', label: 'Stress og press', icon: '🌩️' },
        { value: 'manglende-oppmerksomhet', label: 'Manglende oppmerksomhet', icon: '👀' },
        { value: 'konflikt', label: 'Konflikt', icon: '⚡' },
        { value: 'taushet-eller-avstand', label: 'Taushet eller avstand', icon: '↔️' },
      ]} selectedValue={getValue('distanceCreator', '')} onChange={(v) => onChange('distanceCreator', v)} columns={2} testId="ob-distance-creator" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      {/* Valgfri kort fritekst — det lille som betyr mye */}
      <OnboardingTextField label="Hva er de små tingene som betyr mest for deg?" value={getValue('smallThing', '')} onChange={(v) => onChange('smallThing', v)} placeholder="En liten, hverdagslig gest som får deg til å kjenne deg sett" mikroguiding="Skriv f.eks. At noen husker at jeg vil ha kaffe på morgenen" maxLength={200} rows={2} multiline testId="ob-small-thing" />
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}