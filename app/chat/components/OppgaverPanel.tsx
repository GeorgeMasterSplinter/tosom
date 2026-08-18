/* eslint-disable react-hooks/exhaustive-deps */
/**
 * ToSom — OppgaverPanel (Premium Nordic Gold 2026)
 * Hardkodede oppgaver — 6 kategorier × 15 = 90 oppgaver.
 * Samme for alle brukere. Tekst-basert, sendes som chat-melding.
 */

"use client";

import { useState, useEffect } from 'react';
import { useChat } from '@/app/chat/context/ChatContext';
import { FadeIn } from '@/components/animations/FadeIn';
import { taskCategories, type TaskCategory } from '@/app/chat/data/tasks';

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
   OPPGAVER PANEL — hovudkomponent
   ═══════════════════════════════════════ */

interface OppgaverPanelProps {
  onClose: () => void;
}

export function OppgaverPanel({ onClose }: OppgaverPanelProps) {
  const { sendMessage } = useChat();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Animer panel-open
  useEffect(() => {
    const timer = setTimeout(() => setPanelOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSendTask = async () => {
    if (!selectedTask || sending) return;
    setSending(true);
    try {
      await sendMessage(selectedTask, 'text');
      setTimeout(() => onClose(), 200);
    } catch (err) {
      console.error('Feil ved sending av oppgave:', err);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelectedTask(null);
  };

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <FadeIn variant="scaleIn" scrollTrigger>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: panelOpen ? '480px' : '0px',
          opacity: panelOpen ? 1 : 0,
          background: `linear-gradient(180deg, ${G.glassBgDark} 0%, rgba(7,13,20,0.95) 100%)`,
          borderTop: `1px solid ${G.glassBorderGold}`,
          borderBottom: `1px solid ${G.glassBorderGold}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 16px ${G.goldSoft}`,
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
              ) : 'Gjør sammen'}
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
          {/* ═══ KATEGORIER — 6 i grid (2×3 mobile, 3×2 desktop) ═══ */}
          {!selectedCategory && (
            <FadeIn variant="fadeInUp" staggerChildren={0.05}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {taskCategories.map((cat) => (
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
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: G.textSecondary }}>{cat.tasks.length} oppgaver</p>
                    </div>
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* ═══ OPPGAVER ═══ */}
          {selectedCategory && (
            <div className="space-y-2.5">
              {selectedCategory.tasks.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTask(t)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${selectedTask === t ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
                  style={{
                    background: selectedTask === t
                      ? `linear-gradient(135deg, ${G.goldSoft}, rgba(212,175,55,0.12))`
                      : `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`,
                    border: `1px solid ${selectedTask === t ? G.goldMuted : G.glassBorder}`,
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: selectedTask === t ? G.textPrimary : 'rgba(255,255,255,0.75)' }}
                  >
                    {t}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* ═══ OPPGAVE VALGT ═══ */}
          {selectedTask && (
            <FadeIn variant="fadeInUp" delay={0.1}>
              <div
                className="mt-5 p-5 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${G.goldSoft}, rgba(212,175,55,0.12))`,
                  border: `1px solid ${G.goldMuted}`,
                  boxShadow: `0 4px 20px rgba(212,175,55,0.1)`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: G.gold, boxShadow: `0 0 8px ${G.goldMuted}` }} />
                  <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: G.goldLight }}>Send til partner?</p>
                </div>
                <p className="text-base leading-relaxed mb-4 font-medium italic" style={{ color: G.textPrimary }}>"{selectedTask}"</p>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleSendTask}
                    disabled={sending}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, color: '#0B1520' }}
                  >
                    {sending ? 'Sender...' : '🎲 Send oppgave'}
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-3 rounded-xl text-xs font-medium transition-all hover:brightness-125 active:scale-[0.98]"
                    style={{ background: G.glassBg, border: `1px solid ${G.glassBorder}`, color: G.textSecondary }}
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        <style jsx>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); border-radius: 3px; }
        `}</style>
      </div>
    </FadeIn>
  );
}

export default OppgaverPanel;
