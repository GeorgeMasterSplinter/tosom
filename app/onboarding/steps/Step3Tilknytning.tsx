/**
 * Tosom — Steg 3: Tilknytning & trygghet (Premium rebuild 2026 — Fase 4)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { ATTACHMENT } from '@/lib/psychometrics/instruments';

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
  const errors: ValidationError[] = [];
  const fields: Array<{key: string; min: number; hint: string}> = [
    { key: 'safetyNeed', min: 10, hint: 'hva som gjør deg trygg' },
    { key: 'insecurityTrigger', min: 10, hint: 'hva som utløser usikkerhet' },
    { key: 'sadnessNeed', min: 10, hint: 'hva du trenger når du er lei' },
    { key: 'stressNeed', min: 10, hint: 'hva du trenger under stress' },
    { key: 'importantBoundary', min: 10, hint: 'hva grenser som er viktige for deg' },
  ];
  for (const f of fields) {
    const v = String(data[f.key] ?? '').trim();
    if (!v || v.length < f.min) errors.push({ field: f.key, message: `Skriv minst ${f.min} tegn om ${f.hint}.` });
  }
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
      <OnboardingTextField label="Hva gjør deg trygg i en relasjon? *" value={getValue('safetyNeed', '')} onChange={(v) => onChange('safetyNeed', v)} placeholder="Beskriv en konkret situasjon der du kjente deg tryggest i en relasjon — hva var det spesifikke som skapte den tryggheten?" mikroguiding="Skriv f.eks. At noen lytter uten å dømme" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva utløser usikkerhet hos deg? *" value={getValue('insecurityTrigger', '')} onChange={(v) => onChange('insecurityTrigger', v)} placeholder="Tenk på et mønster som gjentatt har fått deg til å lure på om du var tryggt tatt vare på — beskriv utløseren konkret" mikroguiding="Skriv f.eks. Når folk lover noe og holder ikke ordet" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva trenger du når du er lei? *" value={getValue('sadnessNeed', '')} onChange={(v) => onChange('sadnessNeed', v)} placeholder="Beskriv hva som hjelper deg mest med å gå gjennom en tung periode — både følelsesmessig og praktisk, og hvorfor akkurat det" mikroguiding="Skriv f.eks. En klem og at noen sier det skal gå bra" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva trenger du under stress? *" value={getValue('stressNeed', '')} onChange={(v) => onChange('stressNeed', v)} placeholder="Beskriv hvordan stress reagerer i kroppen din og hvilken type støtte som hjelper deg mest med å regulere og gjenopprette balanse" mikroguiding="Skriv f.eks. At noen tar over ansvaret midlertidig" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva grenser er viktigst for deg? *" value={getValue('importantBoundary', '')} onChange={(v) => onChange('importantBoundary', v)} placeholder="Reflekter over hva du absolutt ikke kan tolerere i en relasjon — beskriv grensen og hvorfor den er essensiell for din velvære" mikroguiding="Skriv f.eks. Jeg trenger tid alene etter en tung dag" maxLength={300} minChars={10} rows={3} multiline />
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
          />
        ))}
      </div>
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.</p>
      <div className="mt-8 space-y-4">
        <BackButton onClick={onBack} />
         <PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth />
      </div>
    </OnboardingSlide>
  );
}