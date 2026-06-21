/**
 * ToSom – OnboardingFlow
 * Hovud-komponent for onboarding-prosessen med 10 steg.
 */

'use client';

import { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { SliderField } from './components/SliderField';
import { TextAreaField } from './components/TextAreaField';
import { allSteps, step0Data, step1Data, step2Data, step3Data, step4Data, step5Data, step6Data, step7Data, step8Data, step9Data } from './data/questions';

interface ProfileData {
  identityName: string; age: string; gender: string; seekingGender: string;
  height: string; bodyType: string; lifestyle: string; smoking: string;
  religion: string; children: string; wantChildren: string; city: string;
  distancePref: number; agePrefMin: number; agePrefMax: number;
  personlighet: Record<string, string>; tilknytning: Record<string, string>;
  kommunikasjon: Record<string, string>; kjaerlighet: Record<string, string>;
  livsstil: Record<string, string>; fremtid: Record<string, string>;
  humor: Record<string, string>; moden: Record<string, string>;
  politicsImportance: number; religionImportance: number;
  dietPreference: string; sleepSchedule: string; pets: string;
  travelFreq: string; alcoholFreq: string; ambitionLevel: string;
  structureSpontaneity: string; introExtrovert: string; attachmentStyle: string;
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ProfileData>({
    identityName: '', age: '', gender: '', seekingGender: '', height: '',
    bodyType: '', lifestyle: '', smoking: '', religion: '', children: '',
    wantChildren: '', city: '', distancePref: 50, agePrefMin: 23, agePrefMax: 40,
    personlighet: {}, tilknytning: {}, kommunikasjon: {}, kjaerlighet: {},
    livsstil: {}, fremtid: {}, humor: {}, moden: {}, politicsImportance: 5,
    religionImportance: 5, dietPreference: '', sleepSchedule: '', pets: '',
    travelFreq: '', alcoholFreq: '', ambitionLevel: '', structureSpontaneity: '',
    introExtrovert: '', attachmentStyle: '',
  });

  const setText = (name: string, value: string) => setData(d => ({ ...d, [name]: value }));
  const setSlider = (name: string, value: number) => setData(d => ({ ...d, [name]: value }));

  const renderStep0 = () => (
    <div className="space-y-5">
      <InputField label={step0Data.fields.identityName.label} name="identityName" value={data.identityName} onChange={e => setText('identityName', e.target.value)} placeholder={step0Data.fields.identityName.placeholder} exampleText={step0Data.fields.identityName.example} required />
      <InputField label={step0Data.fields.age.label} name="age" type="number" value={data.age} onChange={e => setText('age', e.target.value)} placeholder={step0Data.fields.age.placeholder} min={23} max={99} required />
      <SelectField label={step0Data.fields.gender.label} name="gender" value={data.gender} onChange={e => setText('gender', e.target.value)} options={step0Data.fields.gender.options!} required />
      <SelectField label={step0Data.fields.seekingGender.label} name="seekingGender" value={data.seekingGender} onChange={e => setText('seekingGender', e.target.value)} options={step0Data.fields.seekingGender.options!} required />
      <InputField label={step0Data.fields.height.label} name="height" type="number" value={data.height} onChange={e => setText('height', e.target.value)} placeholder={step0Data.fields.height.placeholder} min={100} max={250} />
      <SelectField label={step0Data.fields.bodyType.label} name="bodyType" value={data.bodyType} onChange={e => setText('bodyType', e.target.value)} options={step0Data.fields.bodyType.options!} />
      <SelectField label={step0Data.fields.lifestyle.label} name="lifestyle" value={data.lifestyle} onChange={e => setText('lifestyle', e.target.value)} options={step0Data.fields.lifestyle.options!} />
      <SelectField label={step0Data.fields.smoking.label} name="smoking" value={data.smoking} onChange={e => setText('smoking', e.target.value)} options={step0Data.fields.smoking.options!} />
      <SelectField label={step0Data.fields.religion.label} name="religion" value={data.religion} onChange={e => setText('religion', e.target.value)} options={step0Data.fields.religion.options!} />
      <SelectField label={step0Data.fields.children.label} name="children" value={data.children} onChange={e => setText('children', e.target.value)} options={step0Data.fields.children.options!} />
      <SelectField label={step0Data.fields.wantChildren.label} name="wantChildren" value={data.wantChildren} onChange={e => setText('wantChildren', e.target.value)} options={step0Data.fields.wantChildren.options!} />
      <InputField label={step0Data.fields.city.label} name="city" value={data.city} onChange={e => setText('city', e.target.value)} placeholder={step0Data.fields.city.placeholder} exampleText={step0Data.fields.city.example} />
      <SliderField label={step0Data.fields.distancePref.label} name="distancePref" value={data.distancePref} onChange={v => setSlider('distancePref', v)} min={step0Data.fields.distancePref.min} max={step0Data.fields.distancePref.max} labelLeft={step0Data.fields.distancePref.labelLeft} labelRight={step0Data.fields.distancePref.labelRight} />
      <SliderField label={step0Data.fields.agePrefMin.label} name="agePrefMin" value={data.agePrefMin} onChange={v => setSlider('agePrefMin', v)} min={step0Data.fields.agePrefMin.min} max={step0Data.fields.agePrefMin.max} labelLeft={step0Data.fields.agePrefMin.labelLeft} labelRight={step0Data.fields.agePrefMin.labelRight} />
      <SliderField label={step0Data.fields.agePrefMax.label} name="agePrefMax" value={data.agePrefMax} onChange={v => setSlider('agePrefMax', v)} min={step0Data.fields.agePrefMax.min} max={step0Data.fields.agePrefMax.max} labelLeft={step0Data.fields.agePrefMax.labelLeft} labelRight={step0Data.fields.agePrefMax.labelRight} />
    </div>
  );

  const renderQuestions = (questions: { name: string; label: string; placeholder: string; example?: string }[], category: keyof ProfileData) => (
    <div className="space-y-5">
      {questions.map(q => {
        const catData = (data[category] as Record<string, string> | undefined) || {};
        return (
          <TextAreaField
            key={q.name} label={q.label} name={q.name} value={catData[q.name] || ''}
            placeholder={q.placeholder} exampleText={q.example}
            onChange={e => setData(d => ({ ...d, [category]: { ...((d[category] as Record<string, string>) || {}), [q.name]: e.target.value } }))}
          />
        );
      })}
    </div>
  );

  const renderStep9 = () => {
    const q = step9Data.questions;
    return (
      <div className="space-y-5">
        <SliderField label={q[0].label} name="politicsImportance" value={data.politicsImportance} onChange={v => setSlider('politicsImportance', v)} min={0} max={10} labelLeft="Ikke viktig" labelRight="Veldig viktig" />
        <SliderField label={q[1].label} name="religionImportance" value={data.religionImportance} onChange={v => setSlider('religionImportance', v)} min={0} max={10} labelLeft="Ikke viktig" labelRight="Veldig viktig" />
        <SelectField label={q[2].label} name="dietPreference" value={data.dietPreference} onChange={e => setText('dietPreference', e.target.value)} options={q[2].options!} />
        <SelectField label={q[3].label} name="sleepSchedule" value={data.sleepSchedule} onChange={e => setText('sleepSchedule', e.target.value)} options={q[3].options!} />
        <SelectField label={q[4].label} name="pets" value={data.pets} onChange={e => setText('pets', e.target.value)} options={q[4].options!} />
        <SelectField label={q[5].label} name="travelFreq" value={data.travelFreq} onChange={e => setText('travelFreq', e.target.value)} options={q[5].options!} />
        <SelectField label={q[6].label} name="alcoholFreq" value={data.alcoholFreq} onChange={e => setText('alcoholFreq', e.target.value)} options={q[6].options!} />
        <SelectField label={q[7].label} name="ambitionLevel" value={data.ambitionLevel} onChange={e => setText('ambitionLevel', e.target.value)} options={q[7].options!} />
        <SelectField label={q[8].label} name="structureSpontaneity" value={data.structureSpontaneity} onChange={e => setText('structureSpontaneity', e.target.value)} options={q[8].options!} />
        <SelectField label={q[9].label} name="introExtrovert" value={data.introExtrovert} onChange={e => setText('introExtrovert', e.target.value)} options={q[9].options!} />
        <SelectField label={q[10].label} name="attachmentStyle" value={data.attachmentStyle} onChange={e => setText('attachmentStyle', e.target.value)} options={q[10].options!} />
      </div>
    );
  };

  const handleNext = async () => {
    if (step === 9) {
      setSaving(true);
      try {
        const payload = {
          basic: { identityName: data.identityName, age: data.age, gender: data.gender, seekingGender: data.seekingGender, height: data.height, bodyType: data.bodyType, lifestyle: data.lifestyle, smoking: data.smoking, religion: data.religion, children: data.children, wantChildren: data.wantChildren, city: data.city, distancePref: data.distancePref, agePrefMin: data.agePrefMin, agePrefMax: data.agePrefMax },
          personlighet: data.personlighet, tilknytning: data.tilknytning, kommunikasjon: data.kommunikasjon, kjaerlighet: data.kjaerlighet, livsstil: data.livsstil, fremtid: data.fremtid, humor: data.humor, moden: data.moden,
          preferanser: { politicsImportance: data.politicsImportance, religionImportance: data.religionImportance, dietPreference: data.dietPreference, sleepSchedule: data.sleepSchedule, pets: data.pets, travelFreq: data.travelFreq, alcoholFreq: data.alcoholFreq, ambitionLevel: data.ambitionLevel, structureSpontaneity: data.structureSpontaneity, introExtrovert: data.introExtrovert, attachmentStyle: data.attachmentStyle },
        };

        /* Steg 1: Lagre profil */
        const profileRes = await fetch('/api/profile/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!profileRes.ok) throw new Error('Kunne ikke lagre profil');

        const profileData = await profileRes.json();
        const userId = profileData.userId || profileData.user?.id || '';

        if (!userId) {
          window.location.href = '/dashboard';
          return;
        }

        /* Steg 2: Kjør matching */
        try {
          const matchRes = await fetch('/api/matching', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
          if (matchRes.ok) {
            window.location.href = `/matching?userId=${userId}`;
            return;
          }
        } catch {
          /* Feil paa matching er ikkje kritisk — går til dashboard */
        }

        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Error saving profile:', err);
      } finally {
        setSaving(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  const renderContent = () => {
    switch (step) {
      case 0: return renderStep0();
      case 1: return renderQuestions(step1Data.questions, 'personlighet');
      case 2: return renderQuestions(step2Data.questions, 'tilknytning');
      case 3: return renderQuestions(step3Data.questions, 'kommunikasjon');
      case 4: return renderQuestions(step4Data.questions, 'kjaerlighet');
      case 5: return renderQuestions(step5Data.questions, 'livsstil');
      case 6: return renderQuestions(step6Data.questions, 'fremtid');
      case 7: return renderQuestions(step7Data.questions, 'humor');
      case 8: return renderQuestions(step8Data.questions, 'moden');
      case 9: return renderStep9();
      default: return null;
    }
  };

  const currentStepData = allSteps[step];
  const isLastStep = step === 9;
  const isFirstStep = step === 0;

  return (
    <OnboardingLayout
      currentStep={step} totalSteps={10} title={currentStepData.title}
      subtitle={currentStepData.subtitle} onNext={handleNext} onBack={handleBack}
      showBack={!isFirstStep} showNext
      nextLabel={isLastStep ? 'Fullfør profil' : 'Neste'}
      disabledNext={saving} exampleText={currentStepData.example}
    >
      {renderContent()}
    </OnboardingLayout>
  );
}