/**
 * ToSom Dashboard 1.0 — Settings Page
 * Premium side med innstillinger, personvern, konto og eksport.
 */

'use client';

import { useState } from 'react';

interface ToggleSetting {
  title: string;
  description: string;
  value: boolean;
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<ToggleSetting[]>([
    { title: 'Vis profil for andre', description: 'Andre brukere kan se profilen din', value: false },
    { title: 'Vis aktivitet-status', description: 'Vis når du er online', value: true },
    { title: 'Motta varslinger', description: 'Få push-varsiler om nye meldinger', value: true },
    { title: 'Del anonymisert data', description: 'Hjælp forskningen ved å dele anonymisert brukersdata', value: false },
  ]);

  const [language, setLanguage] = useState('no');
  const [theme, setTheme] = useState('dark');

  const togglePreference = (index: number) => {
    setPreferences(prev => prev.map((pref, i) =>
      i === index ? { ...pref, value: !pref.value } : pref
    ));
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Innstillinger
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          Kontroller dine preferanser, personvern og kontoinnstillinger.
        </p>
      </div>

      {/* Preferanser */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Preferanser</h2>
        <div className="space-y-4">
          {preferences.map((pref, i) => (
            <div
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-5 ts-shadow-card animate-fadeIn
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--ts-text)] font-medium">{pref.title}</p>
                  <p className="text-[var(--ts-text-soft)] text-sm mt-1">{pref.description}</p>
                </div>
                <button
                  onClick={() => togglePreference(i)}
                  className={`
                    w-12 h-6 rounded-full cursor-pointer transition-all duration-300
                    ${pref.value ? 'bg-[var(--ts-gold)]' : 'bg-[var(--ts-bg-hover)]'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full bg-white shadow transition-transform duration-300
                    ${pref.value ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Språk og tema */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Språk og tema</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="
            bg-[var(--ts-bg-soft)]
            border border-[var(--ts-border)]
            rounded-xl p-6 ts-shadow-card animate-fadeIn
          ">
            <p className="text-[var(--ts-text)] font-medium mb-3">Språk</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[var(--ts-bg)] border-[var(--ts-border)] rounded-lg px-4 py-3 text-[var(--ts-text)] text-sm focus:outline-none focus:border-[var(--ts-gold)]"
            >
              <option value="no">Norsk</option>
              <option value="en">English</option>
              <option value="sv">Svenska</option>
            </select>
          </div>

          <div className="
            bg-[var(--ts-bg-soft)]
            border border-[var(--ts-border)]
            rounded-xl p-6 ts-shadow-card animate-fadeIn
          ">
            <p className="text-[var(--ts-text)] font-medium mb-3">Tema</p>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[var(--ts-bg)] border-[var(--ts-border)] rounded-lg px-4 py-3 text-[var(--ts-text)] text-sm focus:outline-none focus:border-[var(--ts-gold)]"
            >
              <option value="dark">Mørk</option>
              <option value="light">Lys</option>
            </select>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Faresson</h2>
        <div className="
          bg-red-500/5
          border border-red-500/20
          rounded-xl p-6
        ">
          <h3 className="text-red-400 font-medium mb-2">Slett konto</h3>
          <p className="text-red-400/70 text-sm mb-4 leading-[1.6]">
            Dette kan ikke angres. All din data vil bli permanent slettet.
          </p>
          <button className="
            px-4 py-2 rounded-lg
            bg-red-500/20 border border-red-500/30
            text-red-400 text-sm font-medium
            hover:bg-red-500/30 transition-all
          ">
            Slett konto
          </button>
        </div>
      </section>

      {/* Eksport data */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Eksport data</h2>
        <div className="
          bg-[var(--ts-bg-soft)]
          border border-[var(--ts-border)]
          rounded-xl p-6 ts-shadow-card
        ">
          <p className="text-[var(--ts-text)] leading-[1.6] mb-4">
            Last ned en kopi av alle dine data, inkludert profiler, samtaler og reisehistorikk.
          </p>
          <button className="
            px-4 py-2 rounded-lg
            bg-[var(--ts-gold-soft)] border border-[var(--ts-gold)]
            text-[var(--ts-gold)] text-sm font-medium
            hover:bg-[var(--ts-gold)] hover:text-[var(--ts-text)] transition-all
          ">
            Eksport mine data
          </button>
        </div>
      </section>
    </div>
  );
}