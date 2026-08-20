/**
 * Tosom — Steg 5b: Relasjonsstil (Premium rebuild 2026 — Fase 4)
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
interface Props { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void; onBack: () => void; onNext: () => void; }
interface ValidationError { field: string; message: string; }
const validate = (d: Record<string, unknown>): ValidationError[] => {
  const e: ValidationError[] = [];
  if (!String(d['relationshipSeeking'] ?? '').trim()) e.push({ field: 'relationshipSeeking', message: 'Velg hva type relasjon du søker.' });
  if (!String(d['closenessNeed'] ?? '').trim()) e.push({ field: 'closenessNeed', message: 'Velg hvor mye nærhet du trenger.' });
  return e;
};
export default function Step5Relasjonsstil({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  return (
    <OnboardingSlide title="Relasjonsstil" subtitle="Hvordan søker du relasjon — og hvordan balanserer du selvstende med fellesskap?" guidingText="Relasjonsstil forteller oss hvordan du søker — og det er like viktig som verdier." slideIndex={6} totalSlides={13}
      accentColor={OB.section.personality}>
       {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}

       {/* Relasjonsstilar — vel hva type relasjon du søker */}
       <OnboardingSelectGrid
         label="Hva type relasjon søker du? *"
         mikroguiding="Velg den relasjonstypen som passer deg best. Du kan få flere samtidig."
         options={[
           { value: 'dyp vennskap', label: 'Dyp Vennskap', icon: '🤝', description: 'Meningsfulle og varige vennskapsband' },
           { value: 'dating', label: 'Dating', icon: '💛', description: 'Romantisk møting med rom for utvikling' },
           { value: 'langvarig parforhold', label: 'Langvarig Parforhold', icon: '💍', description: 'Serîg langsiktig og engasjert forhold' },
           { value: 'åpen uforpliktende', label: 'Åpen & Uforpliktende', icon: '🌊', description: 'Lette og naturlige møter uten krav' },
         ]}
         selectedValue={getValue('relationshipSeeking', '')}
          onChange={(v) => onChange('relationshipSeeking', v)}
          columns={2}
          maxSelected={4}
        />

       {/* Næringsbehov — kor mye nærheit du treng */}
       <OnboardingSelectGrid
         label="Hvor mye nærhet trenger du i en relasjon? *"
         mikroguiding="Tenk på din naturlige rytme — ingen riktig eller feil svar her."
         options={[
           { value: 'mye tid sammen hver dag', label: 'Mye Samvær', icon: '☀️', description: 'Jeg trives med mye felles tid og nærhet' },
           { value: 'balansert samvær', label: 'Balansert', icon: '⚖️', description: 'Begge deler — sammen og hver for oss' },
           { value: 'mye egen rom og autonomi', label: 'Mye Egenrom', icon: '🌿', description: 'Jeg trenger lang avstand og mye frihet' },
         ]}
         selectedValue={getValue('closenessNeed', '')}
         onChange={(v) => onChange('closenessNeed', v)}
         columns={1}
       />

       {/* Sjølvstende vs. fellesskap — fritt tekstfelt */}
       <OnboardingTextField label="Hvordan balanserer du selvstendighet med fellesskap? *" value={getValue('independenceBalance', '')} onChange={(v) => onChange('independenceBalance', v)} placeholder="Reflekter over hvordan du navigerer mellom å være selvstendig og å ønske fellesskap — beskriv konkrete situasjoner der denne balansen har vært krevende og hvordan du løste det" mikroguiding="Skriv f.eks. Jeg trenger tid alene for å lade batteriene, men elsker også å dele hverdagen" maxLength={300} minChars={10} rows={4} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Relasjonsstilen din er viktig for å finne noen som passer deg.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}