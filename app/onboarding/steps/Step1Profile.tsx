/**
 * ToSom — Steg 1: Grunnprofil (Premium rebuild 2026 — Fase 2)
 * 
 * Oppdatert med:
 * - Mikroguiding per felt (hva er forventet svar?)
 * - Progresjons-indikasjon under hvert tekstfelt
 * - OnboardingTextField + OnboardingSelectGrid komponentar
 * - PremiumCTAButton med 56px høgde
 * - 48–64px spacing (desktop), 32–48px (mobil)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onNext: () => void;
}

/* ====== Validering ====== */

interface ValidationError {
  field: string;
  message: string;
}

const validate = (data: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const name = String(data['identityName'] ?? '').trim();
  if (!name) errors.push({ field: 'identityName', message: 'Fyll inn navnet ditt.' });
  else if (name.length < 2) errors.push({ field: 'identityName', message: 'Navnet må være minst 2 tegn.' });
  
  const age = parseInt(String(data['age'] ?? ''));
  if (!data['age'] || !String(data['age']).trim()) errors.push({ field: 'age', message: 'Alder er påkrevd.' });
  else if (isNaN(age) || age < 23) errors.push({ field: 'age', message: 'Du må være minst 23 år.' });
  else if (age > 99) errors.push({ field: 'age', message: 'Justér alderen litt – dette ser ikke helt riktig ut.' });
  
   if (!String(data['gender'] ?? '').trim()) errors.push({ field: 'gender', message: 'Velg ett kjønn.' });
   if (!String(data['seekingGender'] ?? '').trim()) errors.push({ field: 'seekingGender', message: 'Velg hvem du søker.' });
  if (!String(data['city'] ?? '').trim()) errors.push({ field: 'city', message: 'Hvor bor du?' });
  
  const maxDist = Number(data['distancePref']);
  if (isNaN(maxDist) || !maxDist) errors.push({ field: 'distancePref', message: 'Velg en avstand.' });
  
  const minAge = parseInt(String(data['minAge'] ?? ''));
  if (isNaN(minAge) || minAge < 23) errors.push({ field: 'minAge', message: 'Minste alder må være 23.' });
  
  const maxAgeVal = parseInt(String(data['maxAge'] ?? ''));
  if (isNaN(maxAgeVal) || maxAgeVal < minAge) errors.push({ field: 'maxAge', message: 'Maks alder må være over minste alder.' });

  return errors;
};

/* ====== Hovedkomponent ====== */

export default function Step1Profile({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;

  const handleNext = () => {
    if (!canProceed) {
      setErrors(validate(data));
      return;
    }
    setErrors([]);
    onNext();
  };

  const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  // Faste verdiar for SSR-sikker rendering
  const safeDistance = (() => {
    const v = Number(data['distancePref']);
    return !isNaN(v) && v > 0 ? v : 50;
  })();

  const safeMinAge = (() => {
    const v = parseInt(String(data['minAge']));
    return !isNaN(v) && v >= 23 ? v : 23;
  })();

  const safeMaxAge = (() => {
    const v = parseInt(String(data['maxAge']));
    return !isNaN(v) && v >= safeMinAge ? v : 40;
  })();

  // Feil-map for visuell markering
  const errorFields = new Set(errors.map(e => e.field));

  return (
    <OnboardingSlide
      title="Grunnprofil"
      subtitle="La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte."
      guidingText="Dette er starten på reisen din. Vi holder det enkelt."
      slideIndex={0}
      totalSlides={13}
    >
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.08)',
          borderColor: 'rgba(255, 77, 77, 0.2)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut de markerte feltene:
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ────────────────────────────────────── */}
      {/* SEKSJON A — Identitet og søk */}
      {/* ────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
          />
          <h2 className="text-[20px] font-bold tracking-wide" style={{ color: '#D4AF37' }}>
            IDENTITET OG SØK
          </h2>
        </div>
           <p className="text-sm mb-6 font-semibold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte.
          </p>

        <div className="space-y-6">
          {/* identityName med mikroguiding */}
          <OnboardingTextField
            label="Hva vil du at vi skal kalle deg? *"
            value={val('identityName', '')(data)}
            onChange={(v) => onChange('identityName', v)}
            placeholder="Navn eller kallenavn"
            mikroguiding="Skriv f.eks. Kalla meg Sofia, Jonas eller Lia"
            maxLength={50}
            minChars={2}
          />

          {/* age med mikroguiding */}
          <OnboardingTextField
            label="Alder *"
            value={val('age', '')(data)}
            onChange={(v) => onChange('age', v)}
            placeholder="25"
             mikroguiding="Skriv alderen din (må være minst 23)"
            maxLength={3}
            minChars={2}
          />

           {/* gender med OnboardingSelectGrid — 4 val */}
           <OnboardingSelectGrid
             label="Ditt kjønn *"
             mikroguiding="Velg det som passer best for deg"
             options={[
               { value: 'Mann', label: 'Mann', icon: '👨' },
               { value: 'Kvinne', label: 'Kvinne', icon: '👩' },
               { value: 'Ikke-binær', label: 'Ikke-binær', icon: '🏳️‍🌈' },
               { value: 'Genderfluid', label: 'Genderfluid', icon: '🌊' },
             ]}
             selectedValue={val('gender', '')(data)}
             onChange={(v) => onChange('gender', v)}
           />

           {/* seekingGender med OnboardingSelectGrid */}
           <OnboardingSelectGrid
             label="Hvem søker du? *"
             mikroguiding="Velg hvem du ønsker å møte"
             options={[
               { value: 'Mann', label: 'Mann', icon: '👨' },
               { value: 'Kvinne', label: 'Kvinne', icon: '👩' },
               { value: 'Alle-kjon', label: 'Alle kjønn', icon: '💫' },
               { value: 'Kjemisk-tiltrekning', label: 'Kjemisk tiltrekning', icon: '💜' },
             ]}
             selectedValue={val('seekingGender', '')(data)}
             onChange={(v) => onChange('seekingGender', v)}
           />
        </div>
      </div>

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} />

      {/* ────────────────────────────────────── */}
      {/* SEKSJON B — Bosted og avstand */}
      {/* ────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
          />
          <h2 className="text-[20px] font-bold tracking-wide" style={{ color: '#D4AF37' }}>
            BOSTED OG AVSTAND
          </h2>
        </div>
        <p className="text-sm mb-6 font-semibold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Vi bruker dette til å finne noen som faktisk passer deg.
        </p>

        <div className="space-y-6">
          {/* city med mikroguiding */}
          <OnboardingTextField
            label="Bosted *"
            value={val('city', '')(data)}
            onChange={(v) => onChange('city', v)}
            placeholder="Hvor bor du?"
            mikroguiding="Skriv f.eks. Asker, Bergen eller Stavanger"
            maxLength={100}
            minChars={2}
          />

          {/* distancePref slider */}
          <div className="space-y-3">
            <label className="block text-[14px] font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Maks avstand *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={300}
                value={safeDistance}
                onChange={(e) => onChange('distancePref', Number(e.target.value))}
                className="flex-1 h-3 rounded-lg cursor-pointer"
                style={{ background: 'rgba(255, 255, 255, 0.12)', accentColor: '#D4AF37' }}
              />
              <span className="text-[16px] font-medium min-w-[80px] text-right" style={{ color: '#D4AF37' }}>
                {safeDistance} km
              </span>
            </div>
          </div>

          {/* minAge + maxAge */}
          <div className="grid grid-cols-2 gap-4" style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
            <OnboardingTextField
              label="Min alder *"
              value={val('minAge', '')(data)}
              onChange={(v) => onChange('minAge', v)}
              placeholder={String(safeMinAge)}
              maxLength={3}
              minChars={2}
            />
            </div>
            <div style={{ minWidth: 0 }}>
            <OnboardingTextField
              label="Maks alder *"
              value={val('maxAge', '')(data)}
              onChange={(v) => onChange('maxAge', v)}
              placeholder={String(safeMaxAge)}
              maxLength={3}
              minChars={2}
            />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} />

      {/* ────────────────────────────────────── */}
      {/* SEKSJON C — LIVSTIL */}
      {/* ────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
          />
          <h2 className="text-[20px] font-bold tracking-wide" style={{ color: '#D4AF37' }}>
            LIVSTIL
          </h2>
        </div>

        <p className="text-sm mb-6 font-semibold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Litt om deg og hvordan du lever livet. (Valgfritt)
        </p>

        <div className="space-y-10">
          {/* height */}
          <OnboardingTextField
            label="Høyde (cm)"
            value={val('height', '')(data)}
            onChange={(v) => onChange('height', v)}
            placeholder="178"
            maxLength={3}
            minChars={0}
          />

          {/* bodyType med SelectGrid */}
          <div>
            <OnboardingSelectGrid
               label="Kroppstype"
               mikroguiding="Velg det som passer best for deg"
               options={[
                 { value: 'Slank', label: 'Slank', icon: '🏃' },
                { value: 'Gjennomsnittlig', label: 'Gjennomsnittlig', icon: '🧍' },
                { value: 'Atletisk', label: 'Atletisk', icon: '💪' },
                { value: 'Kraftig', label: 'Kraftig', icon: '🦍' },
                { value: 'Myk', label: 'Myk', icon: '🌸' },
               ]}
               selectedValue={val('bodyType', '')(data)}
               onChange={(v) => onChange('bodyType', v)}
            />
          </div>

          {/* Separator — kategori-skilje mellom Kroppstype og Livsstil */}
          <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />

           {/* lifestyle med SelectGrid */}
            <OnboardingSelectGrid
              label="Din hverdag"
              mikroguiding="Velg det som passer best for deg"
             options={[
              { value: 'Aktiv', label: 'Aktiv', icon: '🏔️' },
              { value: 'Rolig', label: 'Rolig', icon: '🌿' },
              { value: 'Balansert', label: 'Balansert', icon: '⚖️' },
              { value: 'Eventyrlysten', label: 'Eventyrlysten', icon: '🧭' },
              { value: 'Hjemmekjær', label: 'Hjemmekjær', icon: '🏠' },
            ]}
            selectedValue={val('lifestyle', '')(data)}
            onChange={(v) => onChange('lifestyle', v)}
          />

          {/* Separator — tydeleg kategori-skilje */}
          <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />

           {/* smoking med SelectGrid */}
           <OnboardingSelectGrid
             label="Røyking / snus"
             mikroguiding="Velg det som passer best"
              options={[
               { value: 'Roker-snuser-ikke', label: 'Røyker/Snuser ikke', icon: '🚭' },
               { value: 'Roker-av-og-til', label: 'Røyker av og til', icon: '💨' },
               { value: 'Snuser', label: 'Snuser', icon: '🧢' },
               { value: 'Roker', label: 'Røyker', icon: '🚬' },
             ]}
            selectedValue={val('smoking', '')(data)}
            onChange={(v) => onChange('smoking', v)}
          />

          {/* Divider */}
          <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />

           {/* religion med SelectGrid */}
           <OnboardingSelectGrid
             label="Religion / livssyn"
             mikroguiding="Velg det som passer best"
              options={[
               { value: 'Kristen', label: 'Kristen', icon: '✝️' },
               { value: 'Katolsk', label: 'Katolsk', icon: '⛪' },
               { value: 'Agnostiker', label: 'Agnostiker', icon: '🤔' },
               { value: 'Ateist', label: 'Ateist', icon: '🔬' },
               { value: 'Muslim', label: 'Muslim', icon: '☪️' },
               { value: 'Jehovas-vitne', label: 'Jehovas vitne', icon: '🔯' },
               { value: 'Hindu', label: 'Hindu', icon: '🕉️' },
               { value: 'Judedom', label: 'Jødedom', icon: '✡️' },
               { value: 'Buddhist', label: 'Buddhist', icon: '☯️' },
               { value: 'Spirituell', label: 'Spirituell', icon: '🌙' },
               { value: 'Annet', label: 'Annet', icon: '✨' },
             ]}
            selectedValue={val('religion', '')(data)}
            onChange={(v) => onChange('religion', v)}
          />

          {/* Divider */}
          <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />

          {/* children med SelectGrid */}
          <OnboardingSelectGrid
            label="Barn?"
            options={[
              { value: 'Har-barn', label: 'Har barn', icon: '👶' },
              { value: 'Har-vaksen-barn', label: 'Har voksne barn', icon: '🧑' },
              { value: 'Har-ikke-barn', label: 'Har ikke barn', icon: '🌱' },
            ]}
            selectedValue={val('children', '')(data)}
            onChange={(v) => onChange('children', v)}
          />

          {/* Divider */}
          <div style={{ borderTop: '2px solid rgba(212, 175, 55, 0.2)', marginTop: '20px', marginBottom: '20px' }} />

          {/* wantChildren med SelectGrid */}
          <OnboardingSelectGrid
            label="Ønsker du barn?"
            options={[
              { value: 'Ja', label: 'Ja', icon: '💚' },
              { value: 'Usikker', label: 'Usikker', icon: '🤷' },
              { value: 'Nei', label: 'Nei', icon: '❌' },
            ]}
            selectedValue={val('wantChildren', '')(data)}
            onChange={(v) => onChange('wantChildren', v)}
          />
        </div>
      </div>

      {/* Premium CTA */}
      <div className="mt-8 space-y-4">
        <PremiumCTAButton
          onClick={handleNext}
          label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'}
          disabled={!canProceed}
          fullWidth
        />
        
        {/* Trust text */}
        <p className="text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
           Svarene dine brukes kun til å bygge profilen din og finne en god match.
        </p>
      </div>
    </OnboardingSlide>
  );
}