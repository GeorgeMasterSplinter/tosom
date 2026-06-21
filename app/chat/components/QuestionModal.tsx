/**
 * ToSom – QuestionModal
 * Popup for å velge og generere spørsmål direkte i chatten.
 */

'use client';

import { useState } from 'react';
import { questionCategories, getRandomQuestion } from '@/app/questions/data/questions';
import { memoryEngine } from '@/app/dashboard/core/MemoryEngine';

export default function QuestionModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);

  const categories = [
    { key: 'personlighet', label: 'Personlighet & identitet' },
    { key: 'forhold', label: 'Forhold & tilknytning' },
    { key: 'fremtid', label: 'Fremtid & livsvisjon' },
    { key: 'humor', label: 'Lek & humor' },
    { key: 'barndom', label: 'Barndom & røtter' },
    { key: 'verdier', label: 'Verdier & livsstil' },
    { key: 'følelser', label: 'Følelser & emosjonell dybde' },
    { key: 'moden', label: 'Moden nysgjerrighet (23+)' },
  ];

  const generate = () => {
    if (!category) return;
    const q = getRandomQuestion(category);
    if (q) setQuestion(q);
  };

  const handleSend = (text: string) => {
    // Lagre spørsmålet i historikk via MemoryEngine (anti-duplikat innebygd)
    memoryEngine.addQuestionToHistory(text);
    onSend(text);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-[var(--ts-bg)] border border-[var(--ts-border)] rounded-2xl p-6 w-full max-w-lg space-y-6 animate-subtlePop"
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        <h2 className="text-2xl font-semibold text-white">Spørsmål til samtalen</h2>

        {/* Kategorier */}
        <div className="grid grid-cols-1 gap-3">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCategory(c.key);
                setQuestion(null);
              }}
              className="
                px-4 py-3 rounded-xl
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                hover:bg-[var(--ts-bg-hover)]
                hover:border-[var(--ts-gold)]/30
                text-white text-left transition-all duration-200
              "
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Generer */}
        {category && !question && (
          <button
            onClick={generate}
            className="
              w-full py-3 rounded-xl
              bg-[var(--ts-gold)]
              text-black font-semibold
              hover:bg-[var(--ts-gold-soft)]
              hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]
              transition-all duration-200
            "
          >
            Gi oss et spørsmål
          </button>
        )}

        {/* Resultat */}
        {question && (
          <div
            className="
              bg-[var(--ts-bg-soft)]
              border border-[var(--ts-border)]
              rounded-xl p-4 text-white
              relative overflow-hidden
            "
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--ts-gold)]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="relative z-10 leading-relaxed">{question}</p>
          </div>
        )}

        {/* Send til chat */}
        {question && (
          <button
            onClick={() => handleSend(question)}
            className="
              w-full py-3 rounded-xl
              bg-[var(--ts-gold)]
              text-black font-semibold
              hover:bg-[var(--ts-gold-soft)]
              hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]
              transition-all duration-200
            "
          >
            Send til chat
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full text-center text-[var(--ts-text-soft)] hover:text-white transition-colors"
        >
          Lukk
        </button>
      </div>
    </div>
  );
}