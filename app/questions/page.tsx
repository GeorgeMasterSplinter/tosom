/**
 * ToSom – Spørsmålmodul (Bli Kjent)
 * Side med 8 kategorier og tilfeldig spørmsgenerator.
 * Designet for voksne (23+) og støtter en dyp, men rolig utforskning.
 */

'use client';

import { useState } from 'react';
import CategoryButton from './components/CategoryButton';
import { questionCategories, getRandomQuestion, getCategoriesWithCounts } from './data/questions';

export default function QuestionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const categories = getCategoriesWithCounts();

  const handleCategory = (key: string) => {
    setSelectedCategory(key);
    setQuestion(null);
  };

  const handleGenerate = () => {
    if (!selectedCategory) return;
    const q = getRandomQuestion(selectedCategory);
    if (q) {
      setQuestion(q);
      setHistory(prev => [q, ...prev].slice(0, 10));
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setQuestion(null);
  };

  const categoryLabels: Record<string, string> = {
    personlighet: "Personlighet & identitet",
    forhold: "Forhold & tilknytning",
    fremtid: "Fremtid & livsvisjon",
    humor: "Lek & humor",
    barndom: "Barndom & røtter",
    verdier: "Verdier & livsstil",
    følelser: "Følelser & emosjonell dybde",
    moden: "Moden nysgjerrighet (23+)",
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Spørsmål dere kan stille hverandre
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          Velg en kategori og få et tilfeldig spørsmål. La nysgjerrigheten styre — ikke plikten.
        </p>
      </div>

      {/* Kategorier */}
      <section>
        <h2 className="text-lg font-medium text-white/80 mb-4">Velg en kategori</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <CategoryButton
              key={cat.key}
              label={cat.label}
              count={cat.count}
              onClick={() => handleCategory(cat.key)}
            />
          ))}
        </div>
      </section>

      {/* Generer-knapp */}
      {selectedCategory && (
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            className="
              w-full py-4 rounded-xl
              bg-[var(--ts-gold)]
              text-black font-semibold text-lg
              hover:bg-[var(--ts-gold-soft)]
              hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]
              transition-all duration-200
            "
          >
            Gi oss et spørsmål
          </button>

          <button
            onClick={handleReset}
            className="
              w-full py-3 rounded-xl
              bg-transparent
              border border-[var(--ts-border)]
              text-[var(--ts-text-soft)]
              hover:text-white
              hover:border-[var(--ts-gold)]/50
              transition-all duration-200
            "
          >
            Velg en annen kategori
          </button>
        </div>
      )}

      {/* Resultat */}
      {question && (
        <div className="space-y-6">
          <div
            className="
              bg-[var(--ts-bg-soft)]
              border border-[var(--ts-border)]
              rounded-2xl p-8 ts-shadow-card
              text-white text-lg leading-relaxed
              relative overflow-hidden
            "
          >
            {/* Dekorative bakgrunnseffekt */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--ts-gold)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <p className="text-[var(--ts-gold)] text-sm font-medium mb-3">
                {selectedCategory ? (categoryLabels[selectedCategory] || selectedCategory) : ''}
              </p>
              <p className="leading-relaxed">{question}</p>
            </div>
          </div>

          {/* Del-knapp */}
          <button
            onClick={() => {
              if (navigator.clipboard && question) {
                navigator.clipboard.writeText(question);
              }
            }}
            className="
              px-6 py-3 rounded-xl
              bg-[var(--ts-bg-hover)]
              border border-[var(--ts-border)]
              text-[var(--ts-text-soft)]
              hover:text-white
              hover:border-[var(--ts-gold)]/50
              transition-all duration-200
            "
          >
            Kopier spørsmål
          </button>
        </div>
      )}

      {/* Tidligere spørsmål */}
      {history.length > 1 && (
        <section>
          <h2 className="text-lg font-medium text-white/80 mb-4">Nylige spørsmål</h2>
          <div className="space-y-3">
            {history.slice(1, 4).map((q, i) => (
              <div
                key={i}
                className="
                  bg-[var(--ts-bg-soft)]
                  border border-[var(--ts-border)]
                  rounded-xl p-5
                  text-[var(--ts-text-soft)]
                "
              >
                {q}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}