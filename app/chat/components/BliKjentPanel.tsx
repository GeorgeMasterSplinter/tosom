/* eslint-disable react-hooks/exhaustive-deps */
/**
 * ToSom — BliKjentPanel (Premium Nordic Gold 2026)
 * Hardkodede kategorier og spørsmål — samme for alle brukere.
 * 12 kategorier × 20 spørsmål = 240 spørsmål.
 */

"use client";

import { useState } from 'react';
import { useChat } from '@/app/chat/context/ChatContext';
import { FadeIn } from '@/components/animations/FadeIn';
import { questionCategories, type QuestionCategory } from '@/app/questions/data/questions';

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.3)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  glassBgDark: "rgba(11,21,32,0.85)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
};

/* ═══════════════════════════════════════
   BLI KJENT PANEL — hovudkomponent
   ═══════════════════════════════════════ */

interface BliKjentPanelProps {
  onClose: () => void;
}

export function BliKjentPanel({ onClose }: BliKjentPanelProps) {
  const { sendMessage, moodTheme, messages } = useChat();
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // C-6: hvilke spørsmål som ALLEREDE er spurt i denne samtalen
  // (metadata.source === 'bli_kjent' — set i send-flyten, C-2)
  const usedQuestions = new Set(
    messages
      .filter((m) => m.metadata?.source === 'bli_kjent')
      .map((m) => m.content.trim())
  );
  const usedInCategory = (category: QuestionCategory) =>
    category.questions.filter((q) => usedQuestions.has(q.trim())).length;

  // Animer panel-open
  useState(() => {
    const timer = setTimeout(() => setPanelOpen(true), 50);
    return () => clearTimeout(timer);
  });

  const handleSendQuestion = async () => {
    if (!selectedQuestion || sending) return;
    setSending(true);
    try {
      await sendMessage(selectedQuestion, 'text', { source: 'bli_kjent' });
      setTimeout(() => onClose(), 200);
    } catch (err) {
      console.error('Feil ved sending av spørsmål:', err);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelectedQuestion(null);
  };

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <FadeIn variant="scaleIn" scrollTrigger>
      <div
        className="overflow-hidden transition-all duration-300 ease-out flex flex-col"
        style={{
          // Send-linjen ligger under den rullbare listen — panelet
          // utvides når et spørsmål er valgt slik at linjen alltid er synlig.
          maxHeight: panelOpen ? (selectedQuestion ? '640px' : '480px') : '0px',
          opacity: panelOpen ? 1 : 0,
          background: `linear-gradient(180deg, ${moodTheme.accentSoft} 0%, rgba(7,13,20,0.97) 100%)`,
          borderTop: `1px solid ${moodTheme.accentMuted}`,
          borderBottom: `1px solid ${moodTheme.accentMuted}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 16px ${moodTheme.accentSoft}`,
          transition: 'background 1.2s ease, border-color 1.2s ease, box-shadow 1.2s ease',
        }}
      >
        {/* ═══ HEADER ═══ */}
        <div
          className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10"
          style={{
            borderBottom: `1px solid ${G.glassBorder}`,
            background: 'rgba(11,21,32,0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={handleBack}
                className="text-sm font-medium transition-all duration-200 hover:brightness-125 active:scale-95"
                style={{ color: G.gold }}
              >
                ← Tilbake
              </button>
            )}
            <div className="h-4 w-px" style={{ background: G.glassBorder }} />
            <h3
              className="text-sm font-semibold tracking-wide"
              style={{ color: G.textPrimary }}
            >
              {selectedCategory ? (
                <span>
                  <span style={{ color: selectedCategory.color }}>{selectedCategory.icon}</span>
                  {' '}— {selectedCategory.name}
                </span>
              ) : 'Bli kjent med partneren'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90"
            style={{ color: G.textMuted, background: G.glassBg }}
          >
            ✕
          </button>
        </div>

        {/* ═══ BODY — Scrollbart ═══ */}
        <div className="overflow-y-auto max-h-[400px] p-5">
          {/* ═══ KATEGORIER ═══ */}
          {!selectedCategory && (
            <FadeIn variant="fadeInUp" staggerChildren={0.05}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {questionCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${cat.color}08, ${cat.color}15)`,
                      border: `1px solid ${cat.color}25`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      className="text-3xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        filter: `drop-shadow(0 0 8px ${cat.color}40)`,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold tracking-wide" style={{ color: G.textPrimary }}>{cat.name}</p>
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: G.textSecondary }}>
                        {cat.questions.length} spørsmål{usedInCategory(cat) > 0 ? ` · ✓ ${usedInCategory(cat)} brukt` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* ═══ SPØRSMÅL ═══ */}
          {selectedCategory && (
            <div className="space-y-2.5">
              {selectedCategory.questions.map((q, i) => {
                const isUsed = usedQuestions.has(q.trim());
                return (
                <button
                  key={i}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${selectedQuestion === q ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
                  style={{
                    background: selectedQuestion === q
                      ? `linear-gradient(135deg, ${moodTheme.accentSoft}, ${moodTheme.accentMuted})`
                      : `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`,
                    border: `1px solid ${selectedQuestion === q ? moodTheme.accentMuted : G.glassBorder}`,
                    opacity: isUsed && selectedQuestion !== q ? 0.6 : 1,
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: selectedQuestion === q ? moodTheme.accentLight : 'rgba(255,255,255,0.75)' }}
                  >
                    {q}
                    {isUsed && (
                      <span
                        className="ml-2 text-[9px] font-bold tracking-wider uppercase align-middle"
                        style={{ color: G.textMuted }}
                      >
                        ✓ brukt
                      </span>
                    )}
                  </p>
                </button>
                );
              })}
            </div>
          )}

        </div>

        {/* ═══ SPØRSMÅL VALGT — fast send-linje i bunn av panelet ═══
            Vises så fort et spørsmål er valgt, uten at man må skrolle
            ned i listen. Samme for alle kategorier. */}
        {selectedQuestion && (
          <div
            className="shrink-0 p-4"
            style={{
              background: 'rgba(11,21,32,0.85)',
              backdropFilter: 'blur(16px)',
              borderTop: `1px solid ${moodTheme.accentMuted}`,
            }}
          >
            <div
              className="p-4 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${moodTheme.accentSoft}, ${moodTheme.accentMuted})`,
                border: `1px solid ${moodTheme.accentMuted}`,
                boxShadow: `0 4px 20px ${moodTheme.accentSoft}`,
                transition: 'background 1.2s ease, border-color 1.2s ease, box-shadow 1.2s ease',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: moodTheme.accent, boxShadow: `0 0 8px ${moodTheme.accentMuted}` }} />
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: moodTheme.accentLight }}>Send til partner?</p>
              </div>
              <p className="text-base leading-relaxed mb-4 font-medium italic" style={{ color: G.textPrimary }}>"{selectedQuestion}"</p>
              <div className="flex gap-2.5">
                <button
                  onClick={handleSendQuestion}
                  disabled={sending}
                  className="flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${moodTheme.accent}, ${moodTheme.accentLight})`, color: '#0B1520', transition: 'background 1.2s ease' }}
                >
                  {sending ? 'Sender...' : '✨ Send spørsmål'}
                </button>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-3 rounded-xl text-xs font-medium transition-all hover:brightness-125 active:scale-[0.98]"
                  style={{ background: G.glassBg, border: `1px solid ${G.glassBorder}`, color: G.textSecondary }}
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 3px; }
        `}</style>
      </div>
    </FadeIn>
  );
}

export default BliKjentPanel;