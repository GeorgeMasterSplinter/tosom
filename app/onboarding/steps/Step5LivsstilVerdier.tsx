/**
 * Tosom — Steg 5a: Livsstil & verdier (Premium rebuild 2026 — Fase 4)
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
  const ge = String(d['goodEveryday'] ?? '').trim();
  if (!ge || ge.length < 10) e.push({ field: 'goodEveryday', message: 'Skriv minst 10 tegn om din gode hverdag.' });
  return e;
};

export default function Step5LivsstilVerdier({ data, onChange, onBack, onNext, step, goToStep }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };

  return (
    <OnboardingSlide title="Livsstil & verdier" subtitle="Hva prioriterer du i hverdagen?" guidingText="Livsstilssvarene dine hjelper oss å finne noen som trives i hverdag sammen med deg." slideIndex={5} totalSlides={13}
      accentColor={OB.section.lifestyle}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingSelectGrid label="Hva er viktigst for deg nå? *" mikroguiding="Velg det som kjennes mest riktig" options={[{ value: 'karriere', label: 'Karriere og mål', icon: '🎯' }, { value: 'familie', label: 'Familie og nære relasjoner', icon: '👨‍👩‍👧‍👦' }, { value: 'venner', label: 'Venner og fellesskap', icon: '🤝' }, { value: 'personlig-vekst', label: 'Personlig vekst og læring', icon: '🌱' }, { value: 'frihet', label: 'Frihet og selvstende', icon: '🕊️' }, { value: 'spirituell', label: 'Spirituell/religiøst livssyn', icon: '✨' }]} selectedValue={getValue('highPriority', '')} onChange={(v) => onChange('highPriority', v)} />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hva er mindre viktig for deg? *" mikroguiding="Velg det som betyr minst for deg nå" options={[{ value: 'materiell', label: 'Materielle ting', icon: '💰' }, { value: 'status', label: 'Status og anerkjennelse', icon: '🏆' }, { value: 'sosial-media', label: 'Sosialt mediabruk', icon: '📱' }, { value: 'sport', label: 'Sport og konkurranse', icon: '⚽' }, { value: 'underholdning', label: 'Underholding og kos', icon: '🎬' }]} selectedValue={getValue('lowPriority', '')} onChange={(v) => onChange('lowPriority', v)} />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva gjør en god hverdag for deg? *" value={getValue('goodEveryday', '')} onChange={(v) => onChange('goodEveryday', v)} placeholder="Beskriv en ideal-dag for deg — fra morgen til kveld — med konkrete elementer som gir deg mening og tilfredsstillelse i hverdagen" mikroguiding="Skriv f.eks. Frokost sammen med noen jeg bryr meg om" maxLength={300} minChars={10} rows={4} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hvordan ønsker du å leve? *" mikroguiding="Dette er hva du drømmer om" options={[{ value: 'roleg', label: 'Rogelig og forutsigbart', icon: '🌿' }, { value: 'eventyr', label: 'Eventyr og endring', icon: '🧭' }, { value: 'balansert', label: 'Balansen mellom ro og aktivitet', icon: '⚖️' }, { value: 'skapende', label: 'Skapende og kunstnarisk', icon: '🎨' }]} selectedValue={getValue('desiredLifestyle', '')} onChange={(v) => onChange('desiredLifestyle', v)} />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hvordan ønsker du IKKE å leve? *" mikroguiding="Hva du vil unngå" options={[{ value: 'ensom', label: 'Alene og isolert', icon: '😔' }, { value: 'stress', label: 'Konstant stress', icon: '🌀' }, { value: 'rutine', label: 'Monoton rutine', icon: '😐' }, { value: 'økonomisk-utrygg', label: 'Økonomisk utrygghet', icon: '💸' }]} selectedValue={getValue('undesiredLifestyle', '')} onChange={(v) => onChange('undesiredLifestyle', v)} />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Hverdagssvarene dine hjelper oss å finne noen som trives sammen med deg.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}