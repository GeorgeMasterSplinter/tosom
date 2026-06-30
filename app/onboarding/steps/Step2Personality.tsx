/**
 * ToSom — Steg 2: Personlighet & identitet (veiledet)
 */

'use client';

import { TextAreaField } from '../components/TextAreaField';

interface Props {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
  onBack: () => void;
}

const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : fallback;
};

export default function Step2Personality({ data, onChange, onBack }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-yellow-300">
          Personlighet & identitet
        </h1>
        <p className="text-gray-300 leading-relaxed text-base">
          Vi hjelper deg å beskrive hvem du er — på en rolig og veiledet måte.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-10">

        <TextAreaField
          label="Hvordan vil du beskrive deg selv når du er på ditt beste?"
          name="bestSelf"
          value={val('bestSelf', '')(data)}
          onChange={(e) => onChange('bestSelf', e.target.value)}
          placeholder="Fortell litt om hvem du er når ting flyter naturlig..."
        />

        <TextAreaField
          label="Hva gir deg energi i hverdagen?"
          name="energy"
          value={val('energy', '')(data)}
          onChange={(e) => onChange('energy', e.target.value)}
          placeholder="Hva får deg til å føle deg levende og til stede?"
        />

        <TextAreaField
          label="Hva tapper deg for energi?"
          name="drains"
          value={val('drains', '')(data)}
          onChange={(e) => onChange('drains', e.target.value)}
          placeholder="Hva gjør deg sliten eller drar deg ned?"
        />

        <TextAreaField
          label="Hvordan reagerer du når ting blir vanskelig?"
          name="pressure"
          value={val('pressure', '')(data)}
          onChange={(e) => onChange('pressure', e.target.value)}
          placeholder="Hva skjer med deg når presset øker eller du blir stresset?"
        />

        <TextAreaField
          label="Hva er en uvane eller egenskap du ler av hos deg selv?"
          name="habits"
          value={val('habits', '')(data)}
          onChange={(e) => onChange('habits', e.target.value)}
          placeholder="En liten ting du synes er morsom eller typisk deg..."
        />

      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-10">
        <button
          className="px-6 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition"
          onClick={onBack}
        >
          Tilbake
        </button>

        <button
          className="px-6 py-3 rounded-lg bg-yellow-300 text-black font-semibold hover:bg-yellow-400 transition shadow-lg"
          onClick={() => onChange('next', true)}
        >
          Fortsett til neste steg
        </button>
      </div>

    </div>
  );
}