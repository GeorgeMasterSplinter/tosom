/* eslint-disable react-hooks/exhaustive-deps */
/**
 * ToSom — MoodsPanel (Premium Nordic 2026)
 * Slide-down-panel for å velge/byte mood.
 * Same stil som BliKjentPanel / OppgaverPanel.
 * Ved klikk bytts mood umiddelbart (live-preview) — panel holder opne
 * slik at brukeren kan prøve de ulike mood-ane.
 */

"use client";

import { useState, useEffect } from 'react';
import { useChat } from '@/app/chat/context/ChatContext';
import { FadeIn } from '@/components/animations/FadeIn';
import { moodOrder, moodThemes, MoodId } from '@/app/chat/lib/mood';

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS
   ═══════════════════════════════════════ */

const G = {
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
   MOOD PANEL — hovudkomponent
   ═══════════════════════════════════════ */

interface MoodsPanelProps {
  onClose: () => void;
}

export function MoodsPanel({ onClose }: MoodsPanelProps) {
  const { mood, setMood, moodTheme } = useChat();
  const [panelOpen, setPanelOpen] = useState(false);

  // Animer panel-open
  useEffect(() => {
    const timer = setTimeout(() => setPanelOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(onClose, 300);
  };

  // Aktiv mood sin tema for header-aksent i panelet
  const accent = moodTheme.accent;
  const accentMuted = moodTheme.accentMuted;
  const accentSoft = moodTheme.accentSoft;
  const accentGlow = moodTheme.accentGlow;

  return (
    <FadeIn variant="scaleIn" scrollTrigger>
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: panelOpen ? '480px' : '0px',
          opacity: panelOpen ? 1 : 0,
          background: `linear-gradient(180deg, ${G.glassBgDark} 0%, rgba(7,13,20,0.95) 100%)`,
          borderTop: `1px solid ${accentMuted}`,
          borderBottom: `1px solid ${accentMuted}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 16px ${accentSoft}`,
          transition: 'max-height 0.3s ease, opacity 0.3s ease, border-color 0.5s ease, box-shadow 0.5s ease',
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
            <div className="h-4 w-px" style={{ background: G.glassBorder }} />
            <h3
              className="text-sm font-semibold tracking-wide transition-colors duration-500"
              style={{ color: G.textPrimary }}
            >
              <span style={{ color: accent }}>🎨</span>
              {' '}Velg stemning — {moodTheme.emoji} {moodTheme.name}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90"
            style={{ color: G.textMuted, background: G.glassBg }}
            aria-label="Lukk"
          >
            ✕
          </button>
        </div>

        {/* ═══ BODY — Mood-kort ═══ (scrollbar — same mønster som BliKjent/Oppgaver) */}
        <div className="overflow-y-auto max-h-[400px] p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {moodOrder.map((key: MoodId, i) => {
              const theme = moodThemes[key];
              const isActive = mood === key;
              return (
                <button
                  key={key}
                  onClick={() => setMood(key)}
                  className="group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.accentSoft}, ${theme.accentMuted})`
                      : `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`,
                    border: `1.5px solid ${isActive ? theme.accent : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isActive
                      ? `0 0 20px ${theme.accentGlow}, 0 4px 16px rgba(0,0,0,0.25)`
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Aktiv-indikator — liten kule i hjørnet */}
                  {isActive && (
                    <span
                      className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        background: theme.accent,
                        boxShadow: `0 0 8px ${theme.accentGlow}`,
                      }}
                    >
                      <span className="text-[8px] text-white">✓</span>
                    </span>
                  )}

                  {/* Emoji — same størrelse som BliKjent/Oppgaver-kategoriene */}
                  <div
                    className="text-3xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      filter: `drop-shadow(0 0 8px ${theme.accentMuted})`,
                    }}
                  >
                    {theme.emoji}
                  </div>

                  {/* Namn */}
                  <div className="text-center">
                    <p
                      className="text-xs font-semibold tracking-wide transition-colors duration-300"
                      style={{ color: isActive ? theme.accent : G.textPrimary }}
                    >
                      {theme.name}
                    </p>
                  </div>

                  {/* Fargestripe — visualiserer mood-paletten */}
                  <div
                    className="w-full h-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${theme.accentLight}, ${theme.accent}, ${theme.accentMuted})`,
                      opacity: isActive ? 1 : 0.6,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* C-5: delings-hint — stemninga er DELT for begge partar */}
          <p
            className="text-[11px] text-center mt-4 tracking-wide"
            style={{ color: G.textMuted }}
          >
            🎨 Din stemning — bare deg, din farge
          </p>
        </div>

        <style jsx>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        `}</style>
      </div>
    </FadeIn>
  );
}

export default MoodsPanel;