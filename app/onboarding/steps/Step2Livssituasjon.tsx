/**
 * Tosom — Steg 2b: Livssituasjon (Premium rebuild 2026 — Fase 4)
 * 
 * Oppdatert med:
 * - OnboardingSlide for hel-steg layout
 * - OnboardingTextField + OnboardingSelectGrid med mikroguiding per felt
 * - PremiumCTAButton + BackButton
 * - Mikroguiding per felt
 * - 48px spacing (desktop)
 * - Bokmål (Nynorsk→Bokmål-konvertering)
 */

'use client';

import { useState } from 'react';
import { OnboardingSlide } from '@/app/onboarding/components/OnboardingSlide';
import { OB } from '@/app/onboarding/theme';
import { OnboardingSelectGrid } from '@/app/onboarding/components/OnboardingSelectGrid';
import { Valgvikt } from '@/app/onboarding/components/Valgvikt';
import { PremiumCTAButton } from '@/app/onboarding/components/PremiumCTAButton';
import { BackButton } from '@/components/onboarding/BackButton';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
  onNext: () => void;
}

/* ====== Validering ====== */

interface ValidationError {
  field: string;
  message: string;
}

const validate = (data: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!String(data['workType'] ?? '').trim()) errors.push({ field: 'workType', message: 'Velg hva du jobber med.' });
  if (!String(data['housingType'] ?? '').trim()) errors.push({ field: 'housingType', message: 'Velg hva du bor i.' });
  if (!String(data['householdSize'] ?? '').trim()) errors.push({ field: 'householdSize', message: 'Velg hvor mange som bor i hjemmet.' });
  if (!String(data['economicStability'] ?? '').trim()) errors.push({ field: 'economicStability', message: 'Velg økonomisk stabilitet.' });
  
  // LIVSSTIL-2026 (D-5): responsibilities og dailyRoutine er nå valg-grid
  // (ingen blokkerende fritekst lenger). Hverdag-2026-feltene er valgfrie.
  
  return errors;
};

/* ====== Hovedkomponent ====== */

export default function Step2Livssituasjon({ data, onChange, onBack, onNext }: Props) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const canProceed = validate(data).length === 0;

  const handleNext = () => {
    const validationErrors = validate(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onNext();
  };

  const getValue = (field: string, fallback = '') => {
    const v = data[field];
    return v !== undefined && v !== null ? String(v) : fallback;
  };

  return (
    <OnboardingSlide
      title="Livssituasjon"
      subtitle="Hva jobber du med, hva bor du i, og hvordan ser hverdagen din ut?"
      guidingText="Livssituasjonen din gir oss en viktig oversikt over hverdagen din."
      slideIndex={2}
      totalSlides={13}
      accentColor={OB.section.personality}
    >
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="mb-8 rounded-xl p-4 border" style={{
          background: 'rgba(255, 77, 77, 0.08)',
          borderColor: 'rgba(255, 77, 77, 0.2)',
        }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#FF4D4D' }}>
            Vennligst fyll ut alle påkrevde felt:
          </p>
          <ul className="text-sm space-y-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {errors.map((err) => (
              <li key={err.field}>• {err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ────────────────────────────────────── */}
      {/* ARBEID */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Hva jobber du med? *"
        mikroguiding="Velg det som passer best for deg nå"
        options={[
          { value: 'anstatt-fulltid', label: 'Ansett på fulltid', icon: '💼' },
          { value: 'anstatt-deltid', label: 'Ansett på deltid', icon: '🕐' },
          { value: 'egen-næring', label: 'Egen næringsdrivende', icon: '🏢' },
          { value: 'studier', label: 'Studier', icon: '📚' },
          { value: 'frivillig', label: 'Frivillig arbeid', icon: '🤝' },
          { value: 'husmor-husmann', label: 'Husmor / Husmann', icon: '🏠' },
          { value: 'pensjonist', label: 'Pensjonist', icon: '🎖️' },
          { value: 'permisjon', label: 'Permisjon', icon: '🌿' },
          { value: 'nav', label: 'Ungdomskontakt / NAV', icon: '📋' },
          { value: 'annet', label: 'Annet', icon: '✨' },
        ]}
        selectedValue={getValue('workType', '')}
        onChange={(v) => onChange('workType', v)}
        maxSelected={3}
        testId="ob-work-type"
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* BOSETTING */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Hva bor du i? *"
        options={[
          { value: 'leilighet', label: 'Leilighet', icon: '🏢' },
          { value: 'hus', label: 'Hus (eiendom)', icon: '🏡' },
          { value: 'delt-bo', label: 'Delt bo', icon: '🤝' },
          { value: 'kollektiv', label: 'Kollektiv', icon: '👥' },
          { value: 'studentbolig', label: 'Studentbolig', icon: '🎓' },
          { value: 'foreldres-bo', label: 'Foreldres bo', icon: '🏠' },
          { value: 'annet', label: 'Annet', icon: '✨' },
        ]}
        selectedValue={getValue('housingType', '')}
        onChange={(v) => onChange('housingType', v)}
        maxSelected={2}
        testId="ob-housing"
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <OnboardingSelectGrid
        label="Hvor mange bor det i hjemmet? *"
        mikroguiding="Inkluder deg selv i tellingen"
        options={[
          { value: '1', label: 'Jeg alene', icon: '🧍' },
          { value: '2', label: '2 personer', icon: '👫' },
          { value: '3-4', label: '3–4 personer', icon: '👨‍👩‍👧‍👦' },
          { value: '5+', label: '5+ personer', icon: '🏘️' },
        ]}
        selectedValue={getValue('householdSize', '')}
        onChange={(v) => onChange('householdSize', v)}
        testId="ob-household"
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* ØKONOMI */}
      {/* ────────────────────────────────────── */}
      <OnboardingSelectGrid
        label="Økonomisk stabilitet? *"
        mikroguiding="Ingen detaljer trengs — bare hva som passer best"
        options={[
          { value: 'stabil', label: 'Stabil økonomi', icon: '💰' },
          { value: 'dekker', label: 'Nøye penninger dekker utgifter', icon: '📊' },
          { value: 'varierer', label: 'Varierer fra måned til måned', icon: '📈' },
          { value: 'sparning', label: 'Prioriterer sparing aktivt', icon: '🏦' },
          { value: 'stabilitet', label: 'Fokus på stabilitet, ikke overskudd', icon: '⚖️' },
        ]}
        selectedValue={getValue('economicStability', '')}
        onChange={(v) => onChange('economicStability', v)}
        maxSelected={2}
        testId="ob-economy"
      />

      {/* Separator */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* ────────────────────────────────────── */}
      {/* HVERDAG (LIVSSTIL-2026, D-2/D-4) — alt valgfritt */}
      {/* ────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvordan ser jobben din ut?"
          mikroguiding="Arbeidsrytmen din former tiden dere har sammen."
          options={[
            { value: 'kontorbundet', label: 'Kontorbundet', icon: '🏢' },
            { value: 'hybrid', label: 'Hybrid', icon: '🔀' },
            { value: 'hjemmearbeid', label: 'Hjemmearbeid', icon: '🏠' },
            { value: 'skift', label: 'Skiftarbeid', icon: '🕐' },
          ]}
          selectedValue={getValue('arbeidsrytme', '')}
          onChange={(v) => onChange('arbeidsrytme', v)}
          columns={2}
          testId="ob-l2026-arbeidsrytme"
        />
        <Valgvikt
          value={getValue('arbeidsrytmeViktig', '')}
          onChange={(v) => onChange('arbeidsrytmeViktig', v)}
          testId="ob-l2026-arbeidsrytme-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvor trives du?"
          mikroguiding="Hvor du bor, former hverdagen dere kan dele."
          options={[
            { value: 'sentrum', label: 'Sentrum', icon: '🏙️' },
            { value: 'forstad', label: 'Forstad', icon: '🏘️' },
            { value: 'land', label: 'Land', icon: '🌿' },
            { value: 'ubestemt', label: 'Ikke bestemt ennå', icon: '❔' },
          ]}
          selectedValue={getValue('bosted', '')}
          onChange={(v) => onChange('bosted', v)}
          columns={2}
          testId="ob-l2026-bosted"
        />
        <Valgvikt
          value={getValue('bostedViktig', '')}
          onChange={(v) => onChange('bostedViktig', v)}
          testId="ob-l2026-bosted-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvordan reiser du?"
          mikroguiding="Velg det som beskriver deg best."
          options={[
            { value: 'fjell-bobil', label: 'Fjell og bobil', icon: '🚐' },
            { value: 'utlandet', label: 'Utlandet', icon: '✈️' },
            { value: 'naturen-naermest', label: 'Naturen nærmest', icon: '🥾' },
            { value: 'lite-reising', label: 'Lite reising', icon: '🛋️' },
          ]}
          selectedValue={getValue('reiser', '')}
          onChange={(v) => onChange('reiser', v)}
          columns={2}
          testId="ob-l2026-reiser"
        />
        <Valgvikt
          value={getValue('reiserViktig', '')}
          onChange={(v) => onChange('reiserViktig', v)}
          testId="ob-l2026-reiser-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      {/* dyr + vektmodell (D-4) */}
      <div>
        <OnboardingSelectGrid
          label="Hva med dyr i hverdagen?"
          mikroguiding="Velg det som gjelder for deg."
          options={[
            { value: 'hund', label: 'Hund', icon: '🐕' },
            { value: 'katt', label: 'Katt', icon: '🐈' },
            { value: 'annet-dyr', label: 'Annet kjæledyr', icon: '🐹' },
            { value: 'ingen', label: 'Ingen dyr', icon: '🪶' },
          ]}
          selectedValue={getValue('dyr', '')}
          onChange={(v) => onChange('dyr', v)}
          columns={2}
          testId="ob-l2026-dyr"
        />
        <Valgvikt
          value={getValue('dyrViktig', '')}
          onChange={(v) => onChange('dyrViktig', v)}
          testId="ob-l2026-dyr-viktig"
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <OnboardingSelectGrid
          label="Hvordan er det med skjerm?"
          mikroguiding="Mobb, tv, spill — hvor mye rom tar det i hverdagen din?"
          options={[
            { value: 'mye', label: 'Mye', icon: '📱' },
            { value: 'moderat', label: 'Moderat', icon: '⚖️' },
            { value: 'vil-skru-ned', label: 'Vil skru ned', icon: '📉' },
            { value: 'ubestemt', label: 'Ikke bestemt ennå', icon: '❔' },
          ]}
          selectedValue={getValue('skjerm', '')}
          onChange={(v) => onChange('skjerm', v)}
          columns={2}
          testId="ob-l2026-skjerm"
        />
        <Valgvikt
          value={getValue('skjermViktig', '')}
          onChange={(v) => onChange('skjermViktig', v)}
          testId="ob-l2026-skjerm-viktig"
        />
      </div>

      {/* ────────────────────────────────────── */}
      {/* ANSVAR & HVERDAG (LIVSSTIL-2026, D-5: konvertert til valg) */}
      {/* ────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <OnboardingSelectGrid
        label="Hva ansvar har du i livet ditt?"
        mikroguiding="Velg det som gjelder for deg."
        options={[
          { value: 'sma-barn', label: 'Små barn', icon: '🍼' },
          { value: 'vaksne-barn', label: 'Voksne barn', icon: '🎓' },
          { value: 'foreldre', label: 'Foreldre', icon: '👵' },
          { value: 'andre-naere', label: 'Andre nære', icon: '💛' },
          { value: 'ingen-faste', label: 'Ingen faste ansvar', icon: '🪶' },
        ]}
        selectedValue={getValue('responsibilities', '')}
        onChange={(v) => onChange('responsibilities', v)}
        maxSelected={3}
        testId="ob-responsibilities"
      />

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '20px', marginBottom: '20px' }} />

      <OnboardingSelectGrid
        label="Hvordan starter en typisk dag for deg?"
        mikroguiding="Hverdagsrytmen din — ingen rette svar."
        options={[
          { value: 'i-ro', label: 'I ro og mak', icon: '🌅', description: 'Tid til kaffe før dagen tar til' },
          { value: 'rett-i-det', label: 'Rett i det', icon: '⚡', description: 'Ute av døra uten varsel' },
          { value: 'pa-farten', label: 'På farten', icon: '🚶', description: 'Moro av å ha mange baller i lufta' },
        ]}
        selectedValue={getValue('dailyRoutine', '')}
        onChange={(v) => onChange('dailyRoutine', v)}
        columns={1}
        testId="ob-daily-routine"
      />

      {/* Trust text */}
      <p className="text-center text-xs mt-8" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        Svarene dine hjelper oss å finne noen som passer din hverdagsrytme.
      </p>

      {/* Knapper — Back + CTA */}
      <div className="mt-8 space-y-4">
        <BackButton onClick={onBack} />
        <PremiumCTAButton
          onClick={handleNext}
          label={!canProceed ? 'Fyll ut alle påkrevde felt' : 'Fortsett til neste steg'}
          disabled={!canProceed}
          fullWidth
        />
      </div>
    </OnboardingSlide>
  );
}