/**
 * Tosom 4.0 — Personalization Layer
 *
 * Theme, motion level, density, and card style customization.
 * Persists to localStorage as `tosom-personalization`.
 *
 * Usage:
 *   import { PersonalizationPanel, usePersonalization } from '@/components/ui/personalization'
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── Theme Types ── */
export type Theme = 'dark' | 'gold' | 'rose' | 'ocean';

/* ── Motion Levels ── */
export type MotionLevel = 'none' | 'subtle' | 'normal' | 'expressive';

/* ── Density Levels ── */
export type Density = 'compact' | 'comfortable';

/* ── Card Styles ── */
export type CardStyle = 'glass' | 'elevated' | 'flat';

/* ── Personalization State ── */
export interface PersonalizationState {
  theme: Theme;
  motion: MotionLevel;
  density: Density;
  cardStyle: CardStyle;
}

/* ── Default State ── */
const defaults: PersonalizationState = {
  theme: 'dark',
  motion: 'normal',
  density: 'comfortable',
  cardStyle: 'glass',
};

/* ── Storage Key ── */
const STORAGE_KEY = 'tosom-personalization';

/* ── Context ── */
const PersonalizationContext = createContext<{
  state: PersonalizationState;
  set: (partial: Partial<PersonalizationState>) => void;
  reset: () => void;
}>({
  state: defaults,
  set: () => {},
  reset: () => {},
});

/* ── Hook ── */
export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  return ctx;
}

/* ── Load from localStorage ── */
function loadState(): PersonalizationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch { /* ignore */ }
  return defaults;
}

/* ── Save to localStorage ── */
function saveState(state: PersonalizationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/* ── Theme Palette ── */
const themePalettes: Record<Theme, { accent: string; accentHover: string; gradient: string; glow: string }> = {
  dark: { accent: '#D4AF37', accentHover: '#E8C766', gradient: 'from-[#D4AF37]/20 to-transparent', glow: 'rgba(212,175,55,0.2)' },
  gold: { accent: '#D4AF37', accentHover: '#E8C766', gradient: 'from-[#D4AF37]/30 to-[#F4D9A0]/10', glow: 'rgba(212,175,55,0.3)' },
  rose: { accent: '#F472B6', accentHover: '#F9A8D4', gradient: 'from-[#F472B6]/20 to-transparent', glow: 'rgba(244,114,182,0.2)' },
  ocean: { accent: '#60A5FA', accentHover: '#93C5FD', gradient: 'from-[#60A5FA]/20 to-transparent', glow: 'rgba(96,165,250,0.2)' },
};

/* ── Density Spacing ── */
const densitySpacing: Record<Density, { section: string; card: string; text: string }> = {
  compact: { section: 'py-6', card: 'p-3', text: 'text-xs' },
  comfortable: { section: 'py-10', card: 'p-6', text: 'text-sm' },
};

/* ── Card Style Classes ── */
const cardStyleClasses: Record<CardStyle, string> = {
  glass: 'bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
  elevated: 'bg-white/[0.06] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
  flat: 'bg-transparent border border-white/5',
};

/* ── Motion Classes ── */
const motionClasses: Record<MotionLevel, string> = {
  none: 'transition-none',
  subtle: 'transition-all duration-200 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  expressive: 'transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)',
};

/* ── PersonalizationPanel Component ── */
export const PersonalizationPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state, set, reset } = usePersonalization();
  const palette = themePalettes[state.theme];

  const themes: Theme[] = ['dark', 'gold', 'rose', 'ocean'];
  const motions: MotionLevel[] = ['none', 'subtle', 'normal', 'expressive'];
  const densities: Density[] = ['compact', 'comfortable'];
  const cardStyles: CardStyle[] = ['glass', 'elevated', 'flat'];

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <h2 className={`text-white font-semibold text-xl mb-6 ${densitySpacing[state.density].section}`}>
        Tilpass opplevelsen
      </h2>

      {/* Theme */}
      <div className="mb-8">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Tema</label>
        <div className="grid grid-cols-4 gap-3">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => set({ theme: t })}
              className={`h-12 rounded-xl border-2 transition-all ${
                state.theme === t ? 'border-[#D4AF37]' : 'border-white/10'
              }`}
              style={{ background: t === 'dark' ? '#0B0E11' : t === 'gold' ? 'linear-gradient(135deg, #D4AF37, #E8C766)' : t === 'rose' ? 'linear-gradient(135deg, #F472B6, #F9A8D4)' : 'linear-gradient(135deg, #60A5FA, #93C5FD)' }}
            />
          ))}
        </div>
      </div>

      {/* Motion */}
      <div className="mb-8">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Bevegelse</label>
        <div className="grid grid-cols-4 gap-2">
          {motions.map((m) => (
            <button
              key={m}
              onClick={() => set({ motion: m })}
              className={`py-2.5 rounded-lg text-xs font-medium transition-all ${
                state.motion === m
                  ? `bg-[#D4AF37] text-[#0B0E11]`
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {m === 'none' ? 'Ingen' : m === 'subtle' ? 'Subtil' : m === 'normal' ? 'Normal' : 'Uttrykksfull'}
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div className="mb-8">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Tetthet</label>
        <div className="grid grid-cols-2 gap-2">
          {densities.map((d) => (
            <button
              key={d}
              onClick={() => set({ density: d })}
              className={`py-2.5 rounded-lg text-xs font-medium transition-all ${
                state.density === d
                  ? `bg-[#D4AF37] text-[#0B0E11]`
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {d === 'compact' ? 'Kompakt' : 'Romslig'}
            </button>
          ))}
        </div>
      </div>

      {/* Card Style */}
      <div className="mb-8">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Kortstil</label>
        <div className="grid grid-cols-3 gap-2">
          {cardStyles.map((c) => (
            <button
              key={c}
              onClick={() => set({ cardStyle: c })}
              className={`py-2.5 rounded-lg text-xs font-medium transition-all ${
                state.cardStyle === c
                  ? `bg-[#D4AF37] text-[#0B0E11]`
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {c === 'glass' ? 'Glass' : c === 'elevated' ? 'Hevet' : 'Flat'}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-8">
        <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Forh\u00E5ndsvisning</label>
        <div className={`${cardStyleClasses[state.cardStyle]} rounded-2xl p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center" />
            <div>
              <div className="text-white font-medium text-sm">Eksempelkort</div>
              <div className="text-white/40 text-xs">Slik ser komponenter ut</div>
            </div>
          </div>
          <div className={`h-1.5 rounded-full bg-gradient-to-r ${palette.gradient}`} />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="text-white/30 text-xs hover:text-white/60 transition-colors w-full text-center py-2"
      >
        Tilbakestill til standard
      </button>
    </div>
  );
};

/* ── Provider Component ── */
export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersonalizationState>(loadState);

  const set = useCallback((partial: Partial<PersonalizationState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      saveState(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(defaults);
    saveState(defaults);
  }, []);

  return (
    <PersonalizationContext.Provider value={{ state, set, reset }}>
      {children}
    </PersonalizationContext.Provider>
  );
};

/* ── Apply Theme to Document ── */
export function useApplyTheme() {
  const { state } = usePersonalization();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ts-accent', themePalettes[state.theme].accent);
    root.style.setProperty('--ts-accent-hover', themePalettes[state.theme].accentHover);
    root.style.setProperty('--ts-glow', themePalettes[state.theme].glow);
  }, [state.theme]);
}

export default PersonalizationPanel;