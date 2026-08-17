'use client';

/**
 * Tosom — Admin Verktøy 🔧
 * 
 * Trygge admin-verktøy for drift og testing.
 * Alle handlinger blir logga.
 * Design: Tosom Blue + Nordic Gold + Glassmorphism.
 * Bokmål. Premium. Ro. Moden.
 */

import { useState } from 'react';

/* ─── ToolButton — verktøy-knapp 🔧 */

function ToolButton({
  icon,
  title,
  description,
  color = 'gold',
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  color?: 'gold' | 'blue' | 'green' | 'red';
  onClick: () => void;
}) {
  const colors = {
    gold: { bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.2)', hover: 'rgba(212,175,55,0.15)', text: '#D4AF37' },
    blue: { bg: 'rgba(80,120,255,0.08)', border: 'rgba(80,120,255,0.2)', hover: 'rgba(80,120,255,0.15)', text: '#5078FF' },
    green: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', hover: 'rgba(74,222,128,0.15)', text: '#4ADE80' },
    red: { bg: 'rgba(255,77,77,0.08)', border: 'rgba(255,77,77,0.2)', hover: 'rgba(255,77,77,0.15)', text: '#FF4D4D' },
  };

  const c = colors[color];

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.hover;
        e.currentTarget.style.boxShadow = `0 0 16px ${c.bg}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium flex-1" style={{ color: c.text }}>
          {title}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {description}
      </p>
    </button>
  );
}

/* ─── LogEntry — ei loggmelding 📝 */

function LogEntry({ action, result, time }: { action: string; result: string; time: string }) {
  const resultColor = result === 'OK' ? '#4ADE80' : result === 'Feil' ? '#FF4D4D' : '#FBBF24';

  return (
    <div
      className="flex items-center gap-3 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: resultColor }}
      />
      <span className="text-xs flex-1 truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {action}
      </span>
      <span className="text-xs font-medium flex-shrink-0" style={{ color: resultColor }}>
        {result}
      </span>
      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {time}
      </span>
    </div>
  );
}

/* ─── Mock Data ✨ */

const mockLogs = [
  { action: 'Kjør cron — journey-oppdatering', result: 'OK', time: '5 min siden' },
  { action: 'Opprett testbruker — "Test Bruker"', result: 'OK', time: '1 time siden' },
  { action: 'Reset match — #4231 (Ingrid ↔ Henrik)', result: 'OK', time: '3 timer siden' },
  { action: 'Generer testdata — 10 matcher', result: 'Feil', time: 'I går' },
  { action: 'Kjør cron — match-generering', result: 'OK', time: 'I går' },
];

/* ─── Hovedkomponent — Verktøy Page 🔧 */

export default function AdminToolsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleToolAction = (tool: string) => {
    setShowConfirm(null);
    const newLog = { action: `Verktøy: ${tool}`, result: 'OK' as const, time: 'No' };
    setLogs((prev) => [newLog, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          🔧 Verktøy
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Admin-verktøy — alle handlinger blir logga
        </p>
      </div>

      {/* Advarsel-banner */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
      >
        <span className="text-sm">⚠️</span>
        <p className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Alle handlinger blir logga med hvem, hva og når. Bruk forsiktig.
        </p>
      </div>

      {/* Verktøy-grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolButton
          icon="✨"
          title="Opprett testbruker"
          description="Lag ny bruker med random data for testing"
          color="blue"
          onClick={() => setShowConfirm('Opprett testbruker')}
        />
        <ToolButton
          icon="🔄"
          title="Reset match"
          description="Nullstill ei eksisterende match — bare aktive matcher"
          color="gold"
          onClick={() => setShowConfirm('Reset match')}
        />
        <ToolButton
          icon="🚀"
          title="Reset journey"
          description="Start reise på nytt (dag 1/30) — bare pågående reiser"
          color="green"
          onClick={() => setShowConfirm('Reset journey')}
        />
        <ToolButton
          icon="⏱"
          title="Kjør cron manuelt"
          description="Trigg journey-oppdatering og match-generering"
          color="blue"
          onClick={() => handleToolAction('Kjør cron manuelt')}
        />
        <ToolButton
          icon="📊"
          title="Generer testdata"
          description="Lag random matcher, reiser og chattar — ingen endring av ekte data"
          color="gold"
          onClick={() => setShowConfirm('Generer testdata')}
        />
        <ToolButton
          icon="🔍"
          title="Debug-panel"
          description="Vis interne systemvariator — kun dev/staging"
          color="red"
          onClick={() => setShowConfirm('Debug-panel')}
        />
      </div>

      {/* Bekreft-dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowConfirm(null)}
        >
          <div
            className="rounded-2xl p-6 mx-4 max-w-sm w-full"
            style={{ background: 'rgba(10,26,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Bekreft handling
            </h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Er du sikker på at du vil kjøre <strong>{showConfirm}</strong>?
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                Avbryt
              </button>
              <button
                onClick={() => handleToolAction(showConfirm)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: 'rgba(212,175,55,0.2)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                Bekreft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handlingslogg */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            HANDLINGSLOGG — SISTE 10
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>
            {logs.length} hendelser
          </span>
        </div>
        <div>
          {logs.map((log, i) => (
            <LogEntry key={i} {...log} />
          ))}
        </div>
      </div>
    </div>
  );
}