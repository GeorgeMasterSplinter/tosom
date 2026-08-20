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
  if (!String(d['neverCrossBoundary'] ?? '').trim()) e.push({ field: 'neverCrossBoundary', message: 'Velg hva du aldri vil krysse.' });
  if (!String(d['understandPartnersBoundaries'] ?? '').trim()) e.push({ field: 'understandPartnersBoundaries', message: 'Velg hvordan du forstår partnerens grenser.' });
  const lim = String(d['limitations'] ?? '').trim(); if (!lim || lim.length < 10) e.push({ field: 'limitations', message: 'Skriv minst 10 tegn om dine avgrensninger.' });
  const pmu = String(d['partnerMustUnderstand'] ?? '').trim(); if (!pmu || pmu.length < 10) e.push({ field: 'partnerMustUnderstand', message: 'Skriv minst 10 tegn om hva partneren må forstå.' });
  return e;
};
export default function Step8Grenser({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;
  const handleNext = () => { const ve = validate(data); if (ve.length > 0) { setErrors(ve); return; } setErrors([]); onNext(); };
  const getValue = (f: string, fb = '') => { const v = data[f]; return v !== undefined && v !== null ? String(v) : fb; };
  return (
    <OnboardingSlide title="Grenser & behov" subtitle="Hvordan ser du på grenser i en relasjon — og hva trenger du at partneren din forstår?" guidingText="Grenser beskytter deg selv — og den du elsker." slideIndex={9} totalSlides={13}
      accentColor={OB.section.boundaries}>
      {errors.length > 0 && (<div className="mb-8 rounded-xl p-4 border" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.2)' }}><p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>Vennligst fyll ut alle påkrevde felt:</p><ul className="text-sm space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{errors.map((x) => (<li key={x.field}>• {x.message}</li>))}</ul></div>)}
      <OnboardingSelectGrid label="Hva grense vil du aldri krysse? *" mikroguiding="Velg det som er viktigst for deg" options={[{ value: 'respekt', label: 'Respekt for meg som person', icon: '🛡️' }, { value: 'tid-aleine', label: 'Tid alene hver dag', icon: '🧘' }, { value: 'venner', label: 'Kontakt med venner/familie', icon: '👥' }, { value: 'selvstende', label: 'Eget rom og selvstendighet', icon: '🏔️' }, { value: 'sandhet', label: 'Ærlighet og sannferdighet', icon: '💎' }]} selectedValue={getValue('neverCrossBoundary', '')} onChange={(v) => onChange('neverCrossBoundary', v)} />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingSelectGrid label="Hvordan forstår du partnerens grenser? *" mikroguiding="Velg det som passer best" options={[{ value: 'lyttar', label: 'Jeg lytter aktivt når de sier noe', icon: '👂' }, { value: 'observerer', label: 'Jeg observerer hva de trenger', icon: '👀' }, { value: 'sporar', label: 'Jeg spør rett ut om de trenger rom', icon: '❓' }, { value: 'lar', label: 'Jeg gir rom uten at de ber om det', icon: '🕊️' }]} selectedValue={getValue('understandPartnersBoundaries', '')} onChange={(v) => onChange('understandPartnersBoundaries', v)} />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva er dine viktigste avgrensninger? *" value={getValue('limitations', '')} onChange={(v) => onChange('limitations', v)} placeholder="Beskriv det konkrete atferdsmønsteret eller opplevelsen som utgjør en hard grense for deg — og hva som må til for at du kjenner deg tryggt respektert" mikroguiding="Skriv f.eks. Jeg trenger aldri å bli møtt med høye stemmer" maxLength={300} minChars={10} rows={3} multiline />
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />
      <OnboardingTextField label="Hva må partneren din forstå om deg? *" value={getValue('partnerMustUnderstand', '')} onChange={(v) => onChange('partnerMustUnderstand', v)} placeholder="Reflekter over det du mener er viktigst å dele for at den andre kan møte deg på en trygg og forstående måte — beskriv det konkret" mikroguiding="Skriv f.eks. At jeg trenger tid til å bearbeide følelser alene" maxLength={300} minChars={10} rows={3} multiline />
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.3)' }}>Grenser beskytter deg selv — og den du elsker. Del bare det du kjenner deg trygg med.</p>
      <div className="mt-8 space-y-4"><BackButton onClick={onBack} /><PremiumCTAButton onClick={handleNext} label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'} disabled={!canProceed} fullWidth /></div>
    </OnboardingSlide>
  );
}