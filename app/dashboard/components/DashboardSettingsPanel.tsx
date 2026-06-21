/**
 * ToSom Dashboard 2.0 — DashboardSettingsPanel
 * Premium sidepanel for innstillinger, personvern og preferanser.
 * Slide-in fra høyre med animasjon.
 */

'use client';

import { FC, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { SettingsToggle } from './SettingsToggle';

export const DashboardSettingsPanel: FC = () => {
  const { state, closeSettings } = useSettings();
  const { isOpen } = state;

  // Lokal state for toggles
  const [showNotifications, setShowNotifications] = useState(true);
  const [messageSound, setMessageSound] = useState(true);
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [hideProfile, setHideProfile] = useState(false);
  const [hideMatchDate, setHideMatchDate] = useState(false);
  const [hideRelationshipStyle, setHideRelationshipStyle] = useState(false);
  const [language, setLanguage] = useState('no');

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeSettings}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[var(--ts-bg)] border-l-[var(--ts-border)] z-50 transform transition-transform duration-300 translate-x-0 ts-shadow-card ts-glass">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-[var(--ts-border)]">
          <h2 className="text-xl font-medium text-[var(--ts-text)]">Innstillinger</h2>
          <button
            onClick={closeSettings}
            className="text-[var(--ts-text-soft)] hover:text-[var(--ts-text)] transition-colors text-xl"
            aria-label="Lukk"
          >
            ✕
          </button>
        </div>

        {/* Seksjoner */}
        <div className="overflow-y-auto h-[calc(100vh-80px)] px-6 py-6 space-y-8">

          {/* 1) Varsler */}
          <div className="animate-fadeIn">
            <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3 uppercase tracking-wider">Varsler</h3>
            <div className="border-l border-white/10 pl-4 space-y-1">
              <SettingsToggle
                label="Vis varsler"
                value={showNotifications}
                onChange={setShowNotifications}
              />
              <SettingsToggle
                label="Lyd ved melding"
                value={messageSound}
                onChange={setMessageSound}
              />
              <SettingsToggle
                label="Vis typing-indikator"
                value={showTypingIndicator}
                onChange={setShowTypingIndicator}
              />
            </div>
          </div>

          {/* 2) Personvern */}
          <div className="animate-fadeIn">
            <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3 uppercase tracking-wider">Personvern</h3>
            <div className="border-l border-white/10 pl-4 space-y-1">
              <SettingsToggle
                label="Skjul profil for andre"
                value={hideProfile}
                onChange={setHideProfile}
              />
              <SettingsToggle
                label="Skjul match-dato"
                value={hideMatchDate}
                onChange={setHideMatchDate}
              />
              <SettingsToggle
                label="Skjul relasjonsstil"
                value={hideRelationshipStyle}
                onChange={setHideRelationshipStyle}
              />
            </div>
          </div>

          {/* 3) Språk */}
          <div className="animate-fadeIn">
            <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3 uppercase tracking-wider">Språk</h3>
            <div className="border-l border-white/10 pl-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[var(--ts-bg-soft)] border-[var(--ts-border)] rounded-xl px-4 py-3 text-[var(--ts-text)] text-sm focus:outline-none focus:border-[var(--ts-gold)]"
              >
                <option value="no">Norsk</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* 4) Konto */}
          <div className="animate-fadeIn">
            <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3 uppercase tracking-wider">Konto</h3>
            <div className="border-l border-white/10 pl-4 space-y-3">
              <button className="w-full px-4 py-3 rounded-xl bg-[var(--ts-gold-soft)] text-[var(--ts-text)] text-sm hover:bg-[var(--ts-bg-hover)] transition-all">
                Logg ut
              </button>
              <button className="w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-all">
                Slett match
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSettingsPanel;