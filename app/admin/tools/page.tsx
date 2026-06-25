'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

const mockToggles = [
  { key: 'allowSignup', label: 'Tillat registrering', value: true, category: 'auth' },
  { key: 'phoneVerification', label: 'Telefonverifisering påkrevd', value: false, category: 'auth' },
  { key: 'superLogin', label: 'Superbrukar-innlogging', value: true, category: 'auth' },
  { key: 'matchingEnabled', label: 'Matching aktiv', value: true, category: 'matching' },
  { key: 'imagePhaseEnabled', label: 'Fase 2 (bilete)', value: false, category: 'journey' },
  { key: 'aiGuidanceEnabled', label: 'AI-guidance', value: true, category: 'ai' },
  { key: 'betaFeatures', label: 'Beta-funksjonar', value: false, category: 'general' },
  { key: 'maintenanceMode', label: 'Underhaldsmodus', value: false, category: 'system' },
];

export default function AdminToolsPage() {
  const [toggles, setToggles] = useState(mockToggles);
  const [message, setMessage] = useState('');

  const toggleValue = (key: string) => {
    setToggles(toggles.map((t) => t.key === key ? { ...t, value: !t.value } : t));
  };

  const actions = [
    {
      label: 'Opprett test-brukar',
      description: 'Lag ein ny superbrukar for testing',
      onClick: () => setMessage('✅ Testbrukar oppretta: testuser@tosom.test / test1234'),
      color: '#D4AF37',
    },
    {
      label: 'Slett test-brukarar',
      description: 'Fjern alle brukarar med @tosom.test-domene',
      onClick: () => setMessage('✅ 4 testbrukarar blei sletta'),
      color: '#FF6B6B',
    },
    {
      label: 'Simuler match',
      description: 'Kjør match-proessen manuelt',
      onClick: () => setMessage('✅ Match-kø kjørt — 2 nye matcher oppretta'),
      color: '#4DFF88',
    },
    {
      label: 'Simuler journey-start',
      description: 'Start ei ny reise manuelt',
      onClick: () => setMessage('✅ Ny reise starta mellom super1 ↔ super2'),
      color: '#60A5FA',
    },
    {
      label: 'Simuler chat-melding',
      description: 'Send test-melding i ein aktiv chat',
      onClick: () => setMessage('✅ Test-melding sendt i samtal #m1'),
      color: '#FFD437',
    },
    {
      label: 'Force cron-job',
      description: 'Kjør alle ventande cron-jobbar',
      onClick: () => setMessage('✅ Alle cron-jobbar kjørt — matching, journey, backup'),
      color: '#FF8C4D',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Test tools</h1>
        <p className="text-sm text-white/40 mt-1">Opprett/slett test-brukarar, simuler match/journey/chat, feature toggles</p>
      </div>

      {/* Message area */}
      {message && (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(77,255,136,0.06)', border: '1px solid rgba(77,255,136,0.15)' }}>
          <span className="text-sm text-green-400">{message}</span>
          <button className="ml-4 text-sm text-white/40 hover:text-white/70" onClick={() => setMessage('')}>Lukk</button>
        </div>
      )}

      {/* Actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <GlassCard key={action.label} className="p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-1">{action.label}</h3>
            <p className="text-xs text-white/40 mb-4">{action.description}</p>
            <button
              onClick={action.onClick}
              className="w-full px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{ background: `${action.color}15`, border: `1px solid ${action.color}30`, color: action.color }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${action.color}25`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${action.color}15`;
              }}
            >
              Kjør
            </button>
          </GlassCard>
        ))}
      </div>

      {/* Feature toggles */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Feature toggles</h3>
        <div className="space-y-3">
          {toggles.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.6)' }}>{toggle.category}</span>
                <span className="text-sm text-white/70">{toggle.label}</span>
              </div>
              <button
                onClick={() => toggleValue(toggle.key)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${toggle.value ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${toggle.value ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Warning */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: '#FF6B6B' }}>⚠️</span>
          <span className="text-sm" style={{ color: '#FF6B6B' }}>Desse verka skal berre brukast i utviklings- og testmiljø. Ikkje bruk i produktion.</span>
        </div>
      </div>
    </div>
  );
}