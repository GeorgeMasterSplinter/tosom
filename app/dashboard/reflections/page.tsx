/**
 * ToSom Dashboard 1.0 — Reflection Timeline
 * Premium tidslinje for refleksjoner og innsikt.
 * Koblet til MemoryEngine for persistent lagring.
 */

'use client';

import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

interface ReflectionFormData {
  question: string;
  yourAnswer: string;
  partnerAnswer: string;
}

export default function ReflectionPage() {
  const { state, addReflection } = useDashboard();
  const [formData, setFormData] = useState<ReflectionFormData>({
    question: '',
    yourAnswer: '',
    partnerAnswer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.yourAnswer || !formData.partnerAnswer) return;

    addReflection({
      day: (state.progress ?? 0) + 1,
      question: formData.question,
      yourAnswer: formData.yourAnswer,
      partnerAnswer: formData.partnerAnswer,
      timestamp: new Date().toISOString(),
    });

    setFormData({ question: '', yourAnswer: '', partnerAnswer: '' });
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Refleksjoner
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En oversikt over deres tanker, svar og utvikling over tid.
        </p>
      </div>

      {/* Legg til refleksjon */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card
      ">
        <h2 className="text-xl font-medium text-white mb-3">
          Legg til refleksjon
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Spørsmål"
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          />

          <textarea
            placeholder="Ditt svar"
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            rows={3}
            value={formData.yourAnswer}
            onChange={(e) => setFormData(prev => ({ ...prev, yourAnswer: e.target.value }))}
          />

          <textarea
            placeholder="Partnerens svar"
            className="w-full bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3 text-[var(--ts-text)] focus:outline-none focus:border-[var(--ts-gold)]"
            rows={3}
            value={formData.partnerAnswer}
            onChange={(e) => setFormData(prev => ({ ...prev, partnerAnswer: e.target.value }))}
          />

          <button
            type="submit"
            className="
              px-6 py-3 rounded-xl
              bg-[var(--ts-gold)] text-[var(--ts-text)] font-medium
              hover:bg-[var(--ts-gold-hover)] transition-all
            "
          >
            Lagre refleksjon
          </button>
        </form>
      </div>

      {/* Tidslinje */}
      <section className="space-y-8">
        {state.reflections?.length ? (
          state.reflections.map((item, i) => (
            <div
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-2xl p-6 ts-shadow-card animate-fadeIn
              "
            >
              <p className="text-[var(--ts-text-soft)] text-sm mb-2">
                Dag {item.day} · {new Date(item.timestamp).toLocaleDateString('no-NO')}
              </p>

              <h2 className="text-xl font-medium text-white">
                {item.question}
              </h2>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[var(--ts-text-soft)] text-sm">Du</p>
                  <p className="text-[var(--ts-text)] bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3">
                    {item.yourAnswer}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--ts-text-soft)] text-sm">Partneren din</p>
                  <p className="text-[var(--ts-text)] bg-[var(--ts-bg-hover)] border border-[var(--ts-border)] rounded-xl p-3">
                    {item.partnerAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[var(--ts-text-soft)]">
            Ingen refleksjoner registrert ennå.
          </p>
        )}
      </section>
    </div>
  );
}