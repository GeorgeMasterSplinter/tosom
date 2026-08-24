/**
 * Tosom — Steg 1: Grunnprofil (Premium rebuild 2026 — Rework)
 *
 * Dempet nordisk design med subtil fargeidentitet pr. seksjon.
 * - OnboardingSection for rolig overskrifter
 * - Nøytrale divider (ikke gull)
 * - Farge-tilordning: blå (identitet), teal (bosted), grønn (livsstil)
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OnboardingSection } from '@/app/onboarding/components/OnboardingSection';
import { OnboardingTextField } from '@/app/onboarding/components/OnboardingTextField';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { lookupPostalCode } from '@/lib/geo/lookup';
import { getDistancePrefRange } from '@/config/distance-prefs';
import { MIN_AGE } from '@/config/legal';
import { OB } from '@/app/onboarding/theme';

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
  else if (isNaN(age) || age < MIN_AGE) errors.push({ field: 'age', message: `Du må være minst ${MIN_AGE} år.` });
  else if (age > 99) errors.push({ field: 'age', message: 'Justér alderen litt – dette ser ikke helt riktig ut.' });

  if (!String(data['gender'] ?? '').trim()) errors.push({ field: 'gender', message: 'Velg ett kjønn.' });
  if (!String(data['seekingGender'] ?? '').trim()) errors.push({ field: 'seekingGender', message: 'Velg hvem du søker.' });
  if (!String(data['city'] ?? '').trim()) errors.push({ field: 'city', message: 'Hvor bor du?' });

  const pc = String(data['postalCode'] ?? '').trim();
  if (!pc) errors.push({ field: 'postalCode', message: 'Postnummer er påkrevd.' });
  else if (!/^\d{4}$/.test(pc)) errors.push({ field: 'postalCode', message: 'Postnummer må ha fire siffer.' });

  // Avstanden må ligge i det tetthetsbaserte området for postnummeret.
  // Serveren håndhever dette (lib/validation/onboarding-setup.ts). Uten samme
  // sjekk her slapp klienten brukeren videre, og steg 13 feilet med 400.
  const maxDist = Number(data['distancePref']);
  const distRange = getDistancePrefRange(pc);
  if (isNaN(maxDist) || !maxDist) {
    errors.push({ field: 'distancePref', message: 'Velg en avstand.' });
  } else if (maxDist < distRange.min || maxDist > distRange.max) {
    errors.push({
      field: 'distancePref',
      message: `Maks avstand må være mellom ${distRange.min} og ${distRange.max} km.`,
    });
  }

  // Feltnavnene må være de samme som payloaden sender (agePrefMin/agePrefMax).
  // Tidligere skrev feltene til minAge/maxAge, som ingen leste — brukerens
  // aldersvalg forsvant stille, og defaultene ble sendt i stedet.
  const minAge = parseInt(String(data['agePrefMin'] ?? ''));
  if (isNaN(minAge) || minAge < MIN_AGE) {
    errors.push({ field: 'agePrefMin', message: `Minste alder må være ${MIN_AGE}.` });
  }

  const maxAgeVal = parseInt(String(data['agePrefMax'] ?? ''));
  if (isNaN(maxAgeVal) || maxAgeVal < minAge) {
    errors.push({ field: 'agePrefMax', message: 'Maks alder må være over minste alder.' });
  }

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

  const distanceRange = useMemo(
    () => getDistancePrefRange(String(data['postalCode'] ?? '').trim()),
    [data['postalCode']],
  );

  // Klamp til nærmeste grense, ikke til minimum. Valgte brukeren 700 km og
  // bytter til et postnummer der taket er 500, er 500 det hun mente —
  // ikke 30. Kun tomt/ugyldig valg faller tilbake til minimum.
  const safeDistance = (() => {
    const v = Number(data['distancePref']);
    if (isNaN(v) || !v) return distanceRange.min;
    if (v < distanceRange.min) return distanceRange.min;
    if (v > distanceRange.max) return distanceRange.max;
    return v;
  })();

  // Skriv den klampede verdien tilbake til dataen.
  // Uten dette viste slideren én verdi mens data.distancePref holdt en annen
  // (f.eks. 700 km valgt med tomt postnummer, deretter Oslo der maks er 500).
  // Serveren avviste da med 400 på siste steg.
  useEffect(() => {
    if (Number(data['distancePref']) !== safeDistance) {
      onChange('distancePref', safeDistance);
    }
  }, [safeDistance]); // eslint-disable-line react-hooks/exhaustive-deps

  const safeMinAge = (() => {
    const v = parseInt(String(data['agePrefMin']));
    return !isNaN(v) && v >= MIN_AGE ? v : MIN_AGE;
  })();

  const safeMaxAge = (() => {
    const v = parseInt(String(data['agePrefMax']));
    return !isNaN(v) && v >= safeMinAge ? v : 40;
  })();

  const errorFields = new Set(errors.map(e => e.field));

  const postalCodeValue = String(data['postalCode'] ?? '').trim();
  const postalPlace = useMemo(() => {
    if (!/^\d{4}$/.test(postalCodeValue)) return null;
    return lookupPostalCode(postalCodeValue);
  }, [postalCodeValue]);

  return (
    <OnboardingSlide
      title="Grunnprofil"
      subtitle="La oss starte rolig. Vi vil gjerne bli litt kjent med deg — på en måte som føles trygg og ekte."
      guidingText="Dette er starten på reisen din. Vi holder det enkelt."
      slideIndex={0}
      totalSlides={13}
      accentColor={OB.section.identity}
    >
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.06)',
          borderColor: 'rgba(255, 77, 77, 0.15)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut de markerte feltene:
          </p>
          <ul className="text-sm space-y-1" style={{ color: OB.textSecondary }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SEKSJON A — Identitet og søk */}
      <OnboardingSection
        title="Identitet og søk"
        accentColor={OB.section.identity}
        description="Dette hjelper oss å forstå hvem du er og hvem du ønsker å møte."
      >
        <div className="space-y-5">
          <OnboardingTextField
            label="Hva vil du at vi skal kalle deg? *"
            value={val('identityName', '')(data)}
            onChange={(v) => onChange('identityName', v)}
            placeholder="Navn eller kallenavn"
            mikroguiding="Skriv f.eks. Sofia, Jonas eller Lia"
            maxLength={50}
            minChars={2}
          />

          <OnboardingTextField
            label="Alder *"
            value={val('age', '')(data)}
            onChange={(v) => onChange('age', v)}
            placeholder="25"
            mikroguiding="Må være minst 21"
            maxLength={3}
            minChars={2}
          />

          <OnboardingSelectGrid
            label="Ditt kjønn *"
            mikroguiding="Velg det som passer best for deg"
            options={[
              { value: 'Mann', label: 'Mann', icon: '♂' },
              { value: 'Kvinne', label: 'Kvinne', icon: '♀' },
              { value: 'Ikke-binær', label: 'Ikke-binær', icon: '⚧' },
              { value: 'Genderfluid', label: 'Genderfluid', icon: '🌊' },
            ]}
            selectedValue={val('gender', '')(data)}
            onChange={(v) => onChange('gender', v)}
            accentColor={OB.section.identity}
          />

          <OnboardingSelectGrid
            label="Hvem søker du? *"
            mikroguiding="Velg hvem du ønsker å møte"
            options={[
              { value: 'Mann', label: 'Mann', icon: '♂' },
              { value: 'Kvinne', label: 'Kvinne', icon: '♀' },
              { value: 'Alle-kjon', label: 'Alle kjønn', icon: '♂♀' },
              { value: 'Kjemisk-tiltrekning', label: 'Kjemisk tiltrekning', icon: '💜' },
            ]}
            selectedValue={val('seekingGender', '')(data)}
            onChange={(v) => onChange('seekingGender', v)}
            accentColor={OB.section.identity}
          />
        </div>
      </OnboardingSection>

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: `1px solid ${OB.divider}` }} />

      {/* SEKSJON B — Bosted og avstand */}
      <OnboardingSection
        title="Bosted og avstand"
        accentColor={OB.section.location}
        description="Vi bruker dette til å finne noen som passer deg."
      >
        <div className="space-y-5">
          <OnboardingTextField
            label="Bosted *"
            value={val('city', '')(data)}
            onChange={(v) => onChange('city', v)}
            placeholder="Hvor bor du?"
            mikroguiding="F.eks. Asker, Bergen eller Stavanger"
            maxLength={100}
            minChars={2}
          />

          <div>
            <OnboardingTextField
              label="Postnummer *"
              value={val('postalCode', '')(data)}
              onChange={(v) => onChange('postalCode', v.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="F.eks. 0150"
              mikroguiding="Fire siffer — vi bruker dette for avstand, ikke nøyaktig posisjon"
              maxLength={4}
              minChars={4}
            />
            {postalPlace && (
              <p className="text-[12px] mt-1 ml-1" style={{ color: OB.section.location }}>
                ✓ {postalPlace.sted}
              </p>
            )}
          </div>

          {/* distancePref slider */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium" style={{ color: OB.textSecondary }}>
              Maks avstand *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={distanceRange.min}
                max={distanceRange.max}
                value={safeDistance}
                onChange={(e) => onChange('distancePref', Number(e.target.value))}
                className="flex-1 h-2 rounded-lg cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', accentColor: OB.section.location }}
              />
              <span className="text-[14px] font-medium min-w-[60px] text-right" style={{ color: OB.textSecondary }}>
                {safeDistance} km
              </span>
            </div>
            <p className="text-[12px] mt-1 ml-1" style={{ color: OB.textSubtle }}>
              Velg mellom {distanceRange.min} og {distanceRange.max} km
            </p>
          </div>

          {/* minAge + maxAge */}
          <div className="grid grid-cols-2 gap-4" style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              <OnboardingTextField
                label="Min alder *"
                value={val('agePrefMin', '')(data)}
                onChange={(v) => onChange('agePrefMin', v)}
                placeholder={String(safeMinAge)}
                maxLength={3}
                minChars={2}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <OnboardingTextField
                label="Maks alder *"
                value={val('agePrefMax', '')(data)}
                onChange={(v) => onChange('agePrefMax', v)}
                placeholder={String(safeMaxAge)}
                maxLength={3}
                minChars={2}
              />
            </div>
          </div>
        </div>
      </OnboardingSection>

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: `1px solid ${OB.divider}` }} />

      {/* SEKSJON C — Livsstil */}
      <OnboardingSection
        title="Livsstil"
        accentColor={OB.section.lifestyle}
        description="Litt om deg og hvordan du lever livet. (Valgfritt)"
      >
        <div className="space-y-6">
          <OnboardingTextField
            label="Høyde (cm)"
            value={val('height', '')(data)}
            onChange={(v) => onChange('height', v)}
            placeholder="178"
            maxLength={3}
            minChars={0}
          />

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
            accentColor={OB.section.lifestyle}
          />

          {/* Divider — nøytral */}
          <div style={{ borderTop: `1px solid ${OB.divider}`, margin: '16px 0' }} />

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
            accentColor={OB.section.lifestyle}
          />

          <div style={{ borderTop: `1px solid ${OB.divider}`, margin: '16px 0' }} />

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
            accentColor={OB.section.lifestyle}
          />

          <div style={{ borderTop: `1px solid ${OB.divider}`, margin: '16px 0' }} />

          <OnboardingSelectGrid
            label="Religion / livssyn"
            mikroguiding="Velg det som passer best"
            options={[
              { value: 'Kristen', label: 'Kristen', icon: '✝️' },
              { value: 'Katolsk', label: 'Katolsk', icon: '⛪' },
              { value: 'Agnostiker', label: 'Agnostiker', icon: '?' },
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
            accentColor={OB.section.lifestyle}
          />

          <div style={{ borderTop: `1px solid ${OB.divider}`, margin: '16px 0' }} />

          <OnboardingSelectGrid
            label="Barn?"
            options={[
              { value: 'Har-små-barn', label: 'Har små barn', icon: '🍼' },
              { value: 'Har-barn', label: 'Har barn', icon: '🎒' },
              { value: 'Har-vaksen-barn', label: 'Har voksne barn', icon: '👤' },
              { value: 'Har-ikke-barn', label: 'Har ikke barn', icon: '🌱' },
            ]}
            selectedValue={val('children', '')(data)}
            onChange={(v) => onChange('children', v)}
            accentColor={OB.section.lifestyle}
          />

          <div style={{ borderTop: `1px solid ${OB.divider}`, margin: '16px 0' }} />

          <OnboardingSelectGrid
            label="Ønsker du barn?"
            options={[
              { value: 'Ja', label: 'Ja', icon: '💚' },
              { value: 'Usikker', label: 'Usikker', icon: '🤷' },
              { value: 'Nei', label: 'Nei', icon: '❌' },
            ]}
            selectedValue={val('wantChildren', '')(data)}
            onChange={(v) => onChange('wantChildren', v)}
            accentColor={OB.section.lifestyle}
          />
        </div>
      </OnboardingSection>

      {/* Premium CTA */}
      <div className="mt-8 space-y-4">
        <PremiumCTAButton
          onClick={handleNext}
          label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'}
          disabled={!canProceed}
          fullWidth
        />

        <p className="text-center text-[12px]" style={{ color: OB.textSubtle }}>
          Svarene dine brukes kun til å bygge profilen din og finne en god match.
        </p>
      </div>
    </OnboardingSlide>
  );
}