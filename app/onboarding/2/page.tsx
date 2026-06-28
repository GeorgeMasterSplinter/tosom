/**
 * ToSom Onboarding Step 2 — Preferanser
 */

'use client';

import { useState } from 'react';
import { useOnboarding, validateStep } from '@/hooks/useOnboarding';
import { ToSomOnboardingLayout } from '@/components/ui/system';
import { ToSomSelect } from '@/components/ui/system';
import { ToSomInput } from '@/components/ui/system';
import { ToSomForm } from '@/components/ui/system';

const lookingForOptions = [
  { label: 'Kvinne', value: 'kvinne' },
  { label: 'Mann', value: 'mann' },
  { label: 'Begge', value: 'begge' },
];

const relationshipTypes = [
  { label: 'Seriøs', value: 'seriøs' },
  { label: 'Uforpliktende', value: 'uforpliktende' },
  { label: 'Åpen', value: 'åpen' },
];

const educationLevels = [
  { label: 'Grunnskole', value: 'grunnskole' },
  { label: 'VGS', value: 'vg' },
  { label: 'Bakalauriat', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
];

const careerFoci = [
  { label: 'Lav karrierefokus', value: 'lav' },
  { label: 'Medium karrierefokus', value: 'medium' },
  { label: 'Høy karrierefokus', value: 'høy' },
];

const ambitionLevels = [
  { label: 'Lav ambisjon', value: 'lav' },
  { label: 'Medium ambisjon', value: 'medium' },
  { label: 'Høy ambisjon', value: 'høy' },
];

const eliteSinglesTypes = [
  { label: 'Akademisk', value: 'akademisk' },
  { label: 'Karrierefokusert', value: 'karriere' },
  { label: 'Ambisiøs', value: 'ambisiøs' },
  { label: 'Tradisjonell', value: 'tradisjonell' },
];

const lifestyles = [
  { label: 'Aktiv', value: 'aktiv' },
  { label: 'Rolig', value: 'rolig' },
  { label: 'Sosial', value: 'social' },
  { label: 'Introvert', value: 'introvert' },
];

export default function OnboardingStep2() {
  const { data, updateField, prevStep, nextStep } = useOnboarding();
  const [formError, setFormError] = useState('');

  const handleSubmit = (formData: Record<string, any>) => {
    updateField('lookingFor', formData.lookingFor || '');
    updateField('relationshipType', formData.relationshipType || '');
    updateField('educationLevel', formData.educationLevel || '');
    updateField('careerFocus', formData.careerFocus || '');
    updateField('ambitionLevel', formData.ambitionLevel || '');
    updateField('eliteSinglesType', formData.eliteSinglesType || '');
    updateField('lifestyle', formData.lifestyle || '');
    updateField('interests', formData.interests || '');

    const errors = validateStep(2, {
      lookingFor: formData.lookingFor,
      relationshipType: formData.relationshipType,
      educationLevel: formData.educationLevel,
      ambitionLevel: formData.ambitionLevel,
      eliteSinglesType: formData.eliteSinglesType,
    });

    if (errors.length > 0) {
      setFormError(errors[0].message);
      return;
    }
    setFormError('');
    nextStep();
  };

  return (
    <ToSomOnboardingLayout
      steps={[
        { label: 'Personalia' },
        { label: 'Preferanser' },
        { label: 'Relasjon' },
        { label: 'Personlighet' },
        { label: 'Oppsummering' },
      ]}
      activeStep={1}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.92)' }}>
          hva søker du?
        </h2>

        {formError && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.25)' }}>
            <p className="text-sm" style={{ color: '#FF4D4D' }}>{formError}</p>
          </div>
        )}

        <ToSomSelect label="Ser du etter" options={lookingForOptions} value={data.lookingFor} onChange={(v) => updateField('lookingFor', v)} />
        <ToSomSelect label="Relasjonstype" options={relationshipTypes} value={data.relationshipType} onChange={(v) => updateField('relationshipType', v)} />
        <ToSomSelect label="Utdanningsnivå" options={educationLevels} value={data.educationLevel} onChange={(v) => updateField('educationLevel', v)} />
        <ToSomSelect label="Karrierefokus" options={careerFoci} value={data.careerFocus} onChange={(v) => updateField('careerFocus', v)} />
        <ToSomSelect label="Ambisjonsnivå" options={ambitionLevels} value={data.ambitionLevel} onChange={(v) => updateField('ambitionLevel', v)} />
        <ToSomSelect label="EliteSingles-type" options={eliteSinglesTypes} value={data.eliteSinglesType} onChange={(v) => updateField('eliteSinglesType', v)} />
        <ToSomSelect label="Livsstil" options={lifestyles} value={data.lifestyle} onChange={(v) => updateField('lifestyle', v)} />
        <ToSomInput label="Interesser" placeholder="Hva interesserer du deg for?" value={data.interests} onChange={(e: any) => updateField('interests', e.target.value)} />

        <div className="flex gap-3">
          <button className="flex-1 py-4 px-6 rounded-2xl font-semibold" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.7)' }} onClick={prevStep}>
            ← Tilbake
          </button>
          <ToSomForm onSubmit={handleSubmit} submitLabel="Neste →" />
        </div>
      </div>
    </ToSomOnboardingLayout>
  );
}