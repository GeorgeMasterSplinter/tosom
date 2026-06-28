/**
 * ToSom Onboarding Step 3 — Relasjonspreferanser
 */

'use client';

import { useState } from 'react';
import { useOnboarding, validateStep } from '@/hooks/useOnboarding';
import { ToSomOnboardingLayout } from '@/components/ui/system';
import { ToSomSelect } from '@/components/ui/system';
import { ToSomTextArea } from '@/components/ui/system';
import { ToSomForm } from '@/components/ui/system';

const communicationStyles = [
  { label: 'Direkte og tydelig', value: 'direkte' },
  { label: 'Rolig og tankefull', value: 'rolig' },
  { label: 'Humorfylt', value: 'humor' },
  { label: 'Dyp og reflekterende', value: 'dyp' },
];

const loveLanguages = [
  { label: 'Kvalitetstid', value: 'kvalitetstid' },
  { label: 'Fysiske berøringer', value: 'beroring' },
  { label: 'Gode gjerninger', value: 'gjerninger' },
  { label: 'Gaver', value: 'gaver' },
  { label: 'Verdsatte ord', value: 'ord' },
];

const conflictStyles = [
  { label: 'Snakker det ut med en gang', value: 'umiddelbart' },
  { label: 'Trenger tid til ettertanke', value: 'ettertanke' },
  { label: 'Søker kompromiss', value: 'kompromiss' },
  { label: 'Unngår konflikt', value: 'unngaa' },
];

export default function OnboardingStep3() {
  const { data, updateField, prevStep, nextStep } = useOnboarding();
  const [formError, setFormError] = useState('');

  const handleSubmit = (formData: Record<string, any>) => {
    updateField('communicationStyle', formData.communicationStyle || '');
    updateField('loveLanguage', formData.loveLanguage || '');
    updateField('conflictStyle', formData.conflictStyle || '');
    updateField('boundaries', formData.boundaries || '');

    const errors = validateStep(3, {
      communicationStyle: formData.communicationStyle,
      loveLanguage: formData.loveLanguage,
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
      activeStep={2}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.92)' }}>
          hvordan ønsker du å elske?
        </h2>

        {formError && (
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,77,77,0.10)', border: '1px solid rgba(255,77,77,0.25)' }}>
            <p className="text-sm" style={{ color: '#FF4D4D' }}>{formError}</p>
          </div>
        )}

        <ToSomSelect label="Kommunikasjonsstil" options={communicationStyles} value={data.communicationStyle} onChange={(v) => updateField('communicationStyle', v)} />
        <ToSomSelect label="Kjærlighetsspråk" options={loveLanguages} value={data.loveLanguage} onChange={(v) => updateField('loveLanguage', v)} />
        <ToSomSelect label="Konfliktstil" options={conflictStyles} value={data.conflictStyle} onChange={(v) => updateField('conflictStyle', v)} />
        <ToSomTextArea label="Grenser (valgfritt)" placeholder="Hvilke grenser er viktige for deg?" value={data.boundaries} onChange={(e: any) => updateField('boundaries', e.target.value)} />

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