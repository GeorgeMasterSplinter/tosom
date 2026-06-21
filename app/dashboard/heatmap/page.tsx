/**
 * ToSom Dashboard 1.0 — Relationship Heatmap
 * Premium visuell heatmap-side som viser emosjonell utvikling over tid.
 * Koblet til MemoryEngine for persistent lagring.
 */

'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

interface HeatmapEntry {
  day: number;
  tone: string;
  intensity: number;
}

export default function HeatmapPage() {
  const { state, updateHeatmap } = useDashboard();
  const [formData, setFormData] = useState<{
    day: number;
    tone: string;
    intensity: number;
  }>({ day: 1, tone: '', intensity: 3 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tone) return;

    const updated = [...(state.heatmap ?? [])] as HeatmapEntry[];

    const index = updated.findIndex((d) => d.day === formData.day);

    if (index >= 0) {
      updated[index] = { day: formData.day, tone: formData.tone, intensity: formData.intensity };
    } else {
      updated.push({ day: formData.day, tone: formData.tone, intensity: formData.intensity });
    }

    updateHeatmap(updated);
  };

  const getCellBg = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-[#1f2937]';
      case 2: return 'bg-[#374151]';
      case 3: return 'bg-[#4b5563]';
      case 4: return 'bg-[var(--ts-gold-soft)]';
      case 5: return 'bg-[var(--ts-gold)]';
      default: return 'bg-[#1f2937]';
    }
  };

  const getToneLabel = (tone: string) => {
    switch (tone) {
      case 'rolig': return 'Rolig';
      case 'nøytral': return 'Nøytral';
      case 'varm': return 'Varm';
      case 'dyp': return 'Dyp';
      default: return tone;
    }
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Relasjonsvarmekart
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En visuell oversikt over emosjonell tone og utvikling gjennom uken.
        </p>
      </div>

      {/* Oppdater heatmap */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card
      ">
        <h2 className="text-xl font-medium text-white mb-3">
          Oppdater varmekart
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            max="7"
            placeholder="Dag (1–7)"
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            value={formData.day}
            onChange={(e) => setFormData(prev => ({ ...prev, day: Number(e.target.value) }))}
          />

          <select
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            value={formData.tone}
            onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
          >
            <option value="">Velg tone</option>
            <option value="rolig">Rolig</option>
            <option value="nøytral">Nøytral</option>
            <option value="varm">Varm</option>
            <option value="dyp">Dyp</option>
          </select>

          <input
            type="number"
            min="1"
            max="5"
            placeholder="Intensitet (1–5)"
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            value={formData.intensity}
            onChange={(e) => setFormData(prev => ({ ...prev, intensity: Number(e.target.value) }))}
          />

          <button
            type="submit"
            className="
              px-6 py-3 rounded-xl
              bg-[var(--ts-gold)] text-[var(--ts-text)] font-medium
              hover:bg-[var(--ts-gold-hover)] transition-all
            "
          >
            Lagre dag
          </button>
        </form>
      </div>

      {/* Forklaring */}
      <section className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card
      ">
        <h2 className="text-xl font-medium text-white mb-3">Fargeforklaring</h2>
        <ul className="space-y-2 text-[var(--ts-text-soft)]">
          <li>• Mørk grå – Rolig / nøytral</li>
          <li>• Lys grå – Stabil kommunikasjon</li>
          <li>• Gull – Varm / dyp forbindelse</li>
        </ul>
      </section>

      {/* Heatmap-grid */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Ukesoversikt</h2>
        <div className="grid grid-cols-7 gap-3">
          {state.heatmap?.length ? (
            state.heatmap.map((item, i) => (
              <div
                key={i}
                className={`
                  h-16 rounded-xl border border-[var(--ts-border)]
                  cursor-pointer transition-all duration-200
                  ${getCellBg(item.intensity)}
                `}
                title={`Dag ${item.day}: ${getToneLabel(item.tone)} (${item.intensity}/5)`}
              />
            ))
          ) : (
            <p className="text-[var(--ts-text-soft)] col-span-7">
              Ingen heatmap-data registrert ennå.
            </p>
          )}
        </div>
      </section>

      {/* Detalj-info */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-xl p-6 ts-shadow-card text-[var(--ts-text-soft)]
      ">
        Hold over en dag for å se detaljer.
      </div>
    </div>
  );
}