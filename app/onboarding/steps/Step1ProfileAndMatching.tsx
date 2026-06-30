/**
 * ToSom — Steg 1: Grunnprofil & Matching-preferanser
 * Basis-informasjon + alle matching-valg.
 */

'use client';

import { InputField } from '../components/InputField';
import { SelectField } from '../components/SelectField';
import { SliderField } from '../components/SliderField';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function Step1ProfileAndMatching({ data, onChange }: Props) {
  const val = (field: string, fallback?: string | number) => {
    const v = data[field];
    if (v !== undefined && v !== null) return v;
    return fallback ?? '';
  };

  return (
    <div className="space-y-6">
      {/* ─── Grunnprofil ─── */}
      <div className="space-y-5">
        <InputField
          label="Fornavn"
          name="identityName"
          value={val('identityName', '') as string}
          onChange={(e) => onChange('identityName', e.target.value)}
          placeholder="Eksempel: Ane"
          required
        />

        <InputField
          label="Alder"
          name="age"
          type="number"
          value={val('age', '') as string}
          onChange={(e) => onChange('age', e.target.value)}
          placeholder="Hvor gammel er du?"
          min={18}
          max={99}
          required
        />

        <SelectField
          label="Ditt kjønn"
          name="gender"
          value={val('gender', '') as string}
          onChange={(v) => onChange('gender', v)}
          options={['Mann', 'Kvinne', 'Ikke-binær', 'Annet', 'Vil ikke si']}
          required
        />

        <SelectField
          label="Hva søker du"
          name="seekingGender"
          value={val('seekingGender', '') as string}
          onChange={(v) => onChange('seekingGender', v)}
          options={['Mann', 'Kvinne', 'Ikke-binær', 'Åpen for flere', 'Vil ikke si']}
          required
        />

        <InputField
          label="Høyde (cm)"
          name="height"
          type="number"
          value={val('height', '') as string}
          onChange={(e) => onChange('height', e.target.value)}
          placeholder="Eksempel: 178"
          min={100}
          max={250}
        />

        <SelectField
          label="Kroppstype"
          name="bodyType"
          value={val('bodyType', '') as string}
          onChange={(v) => onChange('bodyType', v)}
          options={['Slank', 'Gjennomsnittlig', 'Atletisk', 'Kraftig', 'Myk', 'Vil ikke si']}
        />

        <SelectField
          label="Livsstil"
          name="lifestyle"
          value={val('lifestyle', '') as string}
          onChange={(v) => onChange('lifestyle', v)}
          options={['Aktiv', 'Rolig', 'Balansert', 'Eventyrlysten', 'Treningsfokusert', 'Hjemmekjær', 'Sosial', 'Vil ikke si']}
        />

        <SelectField
          label="Røyking / snus"
          name="smoking"
          value={val('smoking', '') as string}
          onChange={(v) => onChange('smoking', v)}
          options={['Nei', 'Av og til', 'Ja', 'Vil ikke si']}
        />

        <SelectField
          label="Religion / livssyn"
          name="religion"
          value={val('religion', '') as string}
          onChange={(v) => onChange('religion', v)}
          options={['Kristen', 'Humanetiker', 'Muslim', 'Buddhist', 'Hindu', 'Ikke religiøs', 'Annet', 'Vil ikke si']}
        />

        <SelectField
          label="Barn"
          name="children"
          value={val('children', '') as string}
          onChange={(v) => onChange('children', v)}
          options={['Ja', 'Nei', 'Ja, voksne barn', 'Nei, men åpen for kontakt', 'Vil ikke si']}
        />

        <SelectField
          label="Ønsker du barn?"
          name="wantChildren"
          value={val('wantChildren', '') as string}
          onChange={(v) => onChange('wantChildren', v)}
          options={['Ja', 'Nei', 'Kanskje', 'Usikker', 'Vil ikke si']}
        />

        <InputField
          label="Bosted"
          name="city"
          value={val('city', '') as string}
          onChange={(e) => onChange('city', e.target.value)}
          placeholder="Eksempel: Oslo"
        />
      </div>

      {/* ─── Radius-preferanser ─── */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-medium text-white">Avstand & alder</h3>

        <SliderField
          label="Maks avstand"
          name="distancePref"
          value={(val('distancePref', 50) as number)}
          onChange={(v) => onChange('distancePref', v)}
          min={1}
          max={200}
          labelLeft="1 km"
          labelRight="200 km"
        />

        <SliderField
          label="Min alder du søker"
          name="agePrefMin"
          value={(val('agePrefMin', 23) as number)}
          onChange={(v) => onChange('agePrefMin', v)}
          min={23}
          max={90}
          labelLeft="23"
          labelRight="90"
        />

        <SliderField
          label="Maks alder du søker"
          name="agePrefMax"
          value={(val('agePrefMax', 40) as number)}
          onChange={(v) => onChange('agePrefMax', v)}
          min={23}
          max={95}
          labelLeft="23"
          labelRight="95"
        />
      </div>

      {/* ─── Matching-preferanser ─── */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-medium text-white">Matching-preferanser</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Hva er viktig for deg hos en potensiell match?
        </p>

        <SliderField
          label="Politikk-viktighet"
          name="politicsImportance"
          value={(val('politicsImportance', 5) as number)}
          onChange={(v) => onChange('politicsImportance', v)}
          min={0}
          max={10}
          labelLeft="Ikke viktig"
          labelRight="Veldig viktig"
        />

        <SliderField
          label="Religion-viktighet"
          name="religionImportance"
          value={(val('religionImportance', 5) as number)}
          onChange={(v) => onChange('religionImportance', v)}
          min={0}
          max={10}
          labelLeft="Ikke viktig"
          labelRight="Veldig viktig"
        />

        <SelectField
          label="Kostholdpreferanse"
          name="dietPreference"
          value={val('dietPreference', '') as string}
          onChange={(v) => onChange('dietPreference', v)}
          options={['Ingen', 'Vegetar', 'Veganer', 'Fleksitarianer', 'Annet']}
        />

        <SelectField
          label="Søvnrytme"
          name="sleepSchedule"
          value={val('sleepSchedule', '') as string}
          onChange={(v) => onChange('sleepSchedule', v)}
          options={['Tidlig opp', 'Nattmenneske', 'Balansert']}
        />

        <SelectField
          label="Husdyr"
          name="pets"
          value={val('pets', '') as string}
          onChange={(v) => onChange('pets', v)}
          options={['Ingen', 'Hund', 'Katt', 'Andre', 'Vil ikke si']}
        />

        <SelectField
          label="Reising"
          name="travelFreq"
          value={val('travelFreq', '') as string}
          onChange={(v) => onChange('travelFreq', v)}
          options={['Lite', 'Middels', 'Mye']}
        />

        <SelectField
          label="Alkohol / festing"
          name="alcoholFreq"
          value={val('alcoholFreq', '') as string}
          onChange={(v) => onChange('alcoholFreq', v)}
          options={['Aldri', 'Av og til', 'Ukentlig', 'Daglig']}
        />

        <SelectField
          label="Ambisjonsnivå"
          name="ambitionLevel"
          value={val('ambitionLevel', '') as string}
          onChange={(v) => onChange('ambitionLevel', v)}
          options={['Lav', 'Middels', 'Høy']}
        />

        <SelectField
          label="Struktur vs spontanitet"
          name="structureSpontaneity"
          value={val('structureSpontaneity', '') as string}
          onChange={(v) => onChange('structureSpontaneity', v)}
          options={['Jeg er mer struktur', 'Jeg er mer spontan', 'Balansert']}
        />

        <SelectField
          label="Introvert / Ekstrovert"
          name="introExtrovert"
          value={val('introExtrovert', '') as string}
          onChange={(v) => onChange('introExtrovert', v)}
          options={['Introvert', 'Ekstrovert', 'Balansert']}
        />

        <SelectField
          label="Tilknytningsstil"
          name="attachmentStyle"
          value={val('attachmentStyle', '') as string}
          onChange={(v) => onChange('attachmentStyle', v)}
          options={['Trygg', 'Utrygg', 'Ambivalent', 'Unnvikende', 'Usikker']}
        />
      </div>
    </div>
  );
}
