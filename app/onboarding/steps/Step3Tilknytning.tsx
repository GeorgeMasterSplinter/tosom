/**
 * Tosom — Steg 3: Tilknytning & trygghet (Premium rebuild 2026 — Fase 4)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { ATTACHMENT } from '@/lib/psychometrics/instruments';
import { missingScaleItems } from '@/lib/validation/onboarding-steps';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  step: number;
  goToStep: (s: number) => void;
  onNext: () => void;
}

interface ValidationError { field: string; message: string; }

const validate = (data: Record<string, unknown>): ValidationError[] => {
  // LIVSSTIL-2026 (D-5): 4 felt konvertert til valg-grid (blokkerer ikke lenger).
  // importantBoundary er valgfri kort fritekst. Tilknytningsskalaen må svares.
  const errors: ValidationError[] = [];
  // PL-08b (D-1): skalasvarene er påkrevd per steg.
  const missing = missingScaleItems(data, ATTACHMENT);
  if (missing.length > 0) errors.push({ field: missing[0], message: 'Svar på alle påstandene — det finnes ingen fasit.' });
  return errors;
};

export default function Step3Tilknytning({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;

  const handleNext = () => {
    const ve = validate(data);
    if (ve.length > 0) { setErrors(ve); return; }
    setErrors([]); onNext();
  };

  const getValue = (f: string, fb = '') => {
    const v = data[f];
    return v !== undefined && v !== null ? String(v) : fb;
  };

  return (
    <OnboardingSlide 
      title="Tilknytning & trygghet" 
      subtitle="Dette hjelper oss å forstå hva du trenger for å kjenne deg trygg." 
      guidingText="Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker." 
      slideIndex={3} 
      totalSlides={13}
      accentColor={OB.section.personality}
    >
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255, 77, 77, 0.08)', borderColor: 'rgba(255, 77, 77, 0.2)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p>
          <ul className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{errors.map((e) => (<li key={e.field}>• {e.message}</li>))}</ul>
        </div>
      )}
      {/* LIVSSTIL-2026 (D-5): fritekst konvertert til valg-grid */}
      <OnboardingSelectGrid label="Hva gjør deg trygg i en relasjon?" mikroguiding="Velg opptil tre — det hjelper oss å forstå hva som gir deg trygghet." options={[
        { value: 'aerlighet', label: 'Ærlighet', icon: '💎' },
        { value: 'konsekvens', label: 'Konsekvens', icon: '🧭' },
        { value: 'rom-for-egen-tempo', label: 'Rom for eget tempo', icon: '🌙' },
        { value: 'fysisk-naerhet', label: 'Fysisk nærhet', icon: '🤗' },
        { value: 'praktisk-omsorg', label: 'Praktisk omsorg', icon: '🍲' },
        { value: 'humor', label: 'Humor', icon: '😄' },
      ]} selectedValue={getValue('safetyNeed', '')} onChange={(v) => onChange('safetyNeed', v)} maxSelected={3} testId="ob-safety-need" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hva utløser usikkerhet hos deg?" mikroguiding="Velg opptil tre — det finnes ingen fasit." options={[
        { value: 'endringer-uten-avtale', label: 'Endringer uten avtale', icon: '🌪️' },
        { value: 'taushet', label: 'Taushet og stille', icon: '🤐' },
        { value: 'avstand', label: 'Avstand', icon: '↔️' },
        { value: 'ubestemthet', label: 'Ubestemthet', icon: '🌫️' },
        { value: 'manglende-oppmerksomhet', label: 'Manglende oppmerksomhet', icon: '👀' },
      ]} selectedValue={getValue('insecurityTrigger', '')} onChange={(v) => onChange('insecurityTrigger', v)} maxSelected={3} testId="ob-insecurity-trigger" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hva trenger du når du er lei?" mikroguiding="Velg det som hjelper deg mest gjennom en tung periode." options={[
        { value: 'bare-tilstedevaerelse', label: 'Bare tilstedeværelse', icon: '🫂' },
        { value: 'trygge-ord', label: 'Trygge ord', icon: '💬' },
        { value: 'praktisk-hjelp', label: 'Praktisk hjelp', icon: '🤝' },
        { value: 'tid-aleine', label: 'Tid alene', icon: '🌙' },
        { value: 'humor', label: 'Humor', icon: '😄' },
      ]} selectedValue={getValue('sadnessNeed', '')} onChange={(v) => onChange('sadnessNeed', v)} columns={2} testId="ob-sadness-need" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hva trenger du under stress?" mikroguiding="Velg det som hjelper deg mest til å regulere og gjenopprette balanse." options={[
        { value: 'rom-til-a-roe-meg', label: 'Rom til å roe meg', icon: '🧘' },
        { value: 'praktisk-hjelp', label: 'Praktisk hjelp', icon: '🤝' },
        { value: 'a-snakke-det-gjennom', label: 'Å snakke det gjennom', icon: '🗣️' },
        { value: 'fysisk-naerhet', label: 'Fysisk nærhet', icon: '🤗' },
      ]} selectedValue={getValue('stressNeed', '')} onChange={(v) => onChange('stressNeed', v)} columns={2} testId="ob-stress-need" />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      {/* Valgfri kort fritekst — det personlige du selv vil fremheve */}
      <OnboardingTextField label="Hva grenser er viktigst for deg?" value={getValue('importantBoundary', '')} onChange={(v) => onChange('importantBoundary', v)} placeholder="Noe konkret du trenger at partneren din respekterer" mikroguiding="Skriv f.eks. Jeg trenger tid alene etter en tung dag" maxLength={300} rows={2} multiline testId="ob-important-boundary" />
      {/* FORSKNINGSMOTOR F-5 — Tilknytning (egne items, Bowlby/Ainsworth/Hazan-Shaver) */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '28px', marginBottom: '8px' }} />
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Noen påstander om trygghet og nærhet. Svar det som kjennes riktigst — det finnes ingen fasit.
      </p>
      <div className="space-y-3">
        {ATTACHMENT.map((item) => (
          <ScaleQuestion
            key={item.id}
            text={item.text}
            value={typeof data[item.id] === 'number' ? (data[item.id] as number) : null}
            onChange={(v) => onChange(item.id, v)}
            accentColor={OB.section.personality}
          />
        ))}
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.</p>
      <div className="mt-8 space-y-4">
        <BackButton onClick={onBack} />
         <PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth />
      </div>
    </OnboardingSlide>
  );
}