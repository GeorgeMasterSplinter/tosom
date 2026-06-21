/**
 * ToSom UI 5.0 — Journey (30-dagers reise)
 * 
 * Dagleg refleksjon, tema, oppgåve, resonans
 * Ingen gamification. Ingen bilder før dag 15.
 */

'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';

/* ------ Types ------ */

interface DayContent {
  theme: string;
  reflectionQuestion: string;
  conversationPrompt: string;
  task: string | null;
  resonanceGoal: string;
  systemMessage: string | null;
}

interface JourneyTodayResponse {
  day: number;
  phase: string;
  completedDays: number;
  dayContent: DayContent;
  locks: {
    isDayLocked: boolean;
    nextDayAt: string | null;
    canAdvance: boolean;
  };
  lastResonance: any;
  conversationId: string | null;
}

interface JourneyProgressResponse {
  journey: {
    day: number;
    phase: string;
    completedDays: number;
    startedAt: string | null;
    endedAt: string | null;
    pausedAt: string | null;
  };
  progress: {
    completedDays: number;
    totalDays: number;
    percent: number;
    isComplete: boolean;
  };
  milestones: Array<{
    id: string;
    day: number;
    title: string;
    summary: string;
  }>;
  resonanceSessions: Array<{
    id: string;
    day: number;
    emotionalTone: string;
    depthLevel: number;
    summary: string | null;
  }>;
  contentOverview: Array<{
    day: number;
    theme: string;
    completed: boolean;
  }>;
}

/* ------ Phase config ------ */

const PHASE_LABELS: Record<string, string> = {
  EARLY: 'Introduksjon',
  BUILDING_TRUST: 'Tryggleik',
  DEEPER: 'Djupare samtalar',
  CHECKIN: 'Felles reise',
};

const PHASE_COLORS: Record<string, string> = {
  EARLY: '#D4AF37',
  BUILDING_TRUST: '#C9A032',
  DEEPER: '#B8912E',
  CHECKIN: '#A8832A',
};

/* ------ Main component ------ */

export default function JourneyPage() {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<JourneyTodayResponse | null>(null);
  const [progress, setProgress] = useState<JourneyProgressResponse | null>(null);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Reflection state */
  const [reflection, setReflection] = useState('');
  const [conversationResponse, setConversationResponse] = useState('');

  /* Resonance state */
  const [emotionalTone, setEmotionalTone] = useState('');
  const [depthLevel, setDepthLevel] = useState(5);
  const [responseQuality, setResponseQuality] = useState('');
  const [mutualSharing, setMutualSharing] = useState(false);
  const [vulnerability, setVulnerability] = useState(false);
  const [resonanceSummary, setResonanceSummary] = useState('');

  const fetchToday = async () => {
    try {
      const res = await fetch('/api/journey/today');
      if (res.status === 404) {
        const data = await res.json();
        if (data.ended) setEnded(true);
        return;
      }
      if (res.ok) {
        const data: JourneyTodayResponse = await res.json();
        setToday(data);
      } else {
        const data = await res.json();
        setError(data.error || 'Feil ved henting av dagens innhald');
      }
    } catch {
      setError('Kunne ikkje koble til serveren');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/journey/progress');
      if (res.ok) {
        const data: JourneyProgressResponse = await res.json();
        setProgress(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchToday(), fetchProgress()]);
    };
    load();
  }, []);

  const handleReflect = async () => {
    try {
      await fetch('/api/journey/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, conversationResponse }),
      });
      setReflection('');
      setConversationResponse('');
      await Promise.all([fetchToday(), fetchProgress()]);
    } catch {
      // ignore
    }
  };

  const handleResonance = async () => {
    try {
      await fetch('/api/journey/resonance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotionalTone,
          depthLevel,
          responseQuality,
          mutualSharing,
          vulnerability,
          summary: resonanceSummary,
        }),
      });
      await Promise.all([fetchToday(), fetchProgress()]);
    } catch {
      // ignore
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Lastar reisa di...
          </p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
        <div className="text-center">
          <p className="text-lg mb-6" style={{ color: '#FF4D4D' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
            style={{ background: '#D4AF37', color: '#0B0E11' }}
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  /* Ended */
  if (ended) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0E11' }}>
        <Header currentPath="/journey" />
        <main className="mx-auto max-w-[720px] px-8 py-24 text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            className="mx-auto mb-6"
            style={{ color: '#D4AF37' }}
          >
            <path d="M12 32C12 20 22 12 32 12C42 12 52 20 52 32C52 44 42 52 32 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 24V32L38 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1
            className="text-[32px] font-semibold mb-4"
            style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
          >
            Reisa di er fullført
          </h1>
          <p
            className="text-lg mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.65' }}
          >
            Du har gått gjennom 30 dagar med refleksjon, resonans og oppgåver.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
              style={{ background: '#D4AF37', color: '#0B0E11' }}
            >
              Fortsett
            </button>
            <button
              className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
              style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              Avslutt
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* No journey */
  if (!today) {
    return (
      <div className="min-h-screen" style={{ background: '#0B0E11' }}>
        <Header currentPath="/journey" />
        <main className="mx-auto max-w-[720px] px-8 py-24 text-center">
          <p className="text-lg mb-6" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
            Du har ingen aktiv reise enno. Start ein match for å starte reisa.
          </p>
          <a
            href="/match"
            className="inline-block px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
            style={{ background: '#D4AF37', color: '#0B0E11' }}
          >
            Gå til match
          </a>
        </main>
      </div>
    );
  }

  const phaseLabel = PHASE_LABELS[today.phase] || today.phase;
  const phaseColor = PHASE_COLORS[today.phase] || '#D4AF37';
  const progressPercent = progress?.progress?.percent || 0;

  const tones = [
    { value: 'positive', label: 'Positiv — kjenner glede' },
    { value: 'neutral', label: 'Nøytral — verken ein eller anna' },
    { value: 'mixed', label: 'Blanda — både glede og uro' },
    { value: 'deep', label: 'Djup — intensiv og meningsfull' },
  ];

  const qualities = [
    { value: 'engaged', label: 'Engasjert' },
    { value: 'passive', label: 'Passiv' },
    { value: 'neutral', label: 'Nøytral' },
    { value: 'resistant', label: 'Resistenta' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0B0E11' }}>
      <Header currentPath="/journey" />

      <main className="mx-auto max-w-[720px] px-8 py-12 space-y-8">
        {/* Phase banner */}
        <div
          className="rounded-2xl px-6 py-4 text-center"
          style={{
            background: `${phaseColor}15`,
            border: `1px solid ${phaseColor}30`,
          }}
        >
          <span className="text-sm font-medium" style={{ color: phaseColor }}>
            {phaseLabel} · Dag {today.day} av 30
          </span>
        </div>

        {/* Theme */}
        <div className="text-center">
          <h1
            className="text-[32px] lg:text-[40px] font-semibold mb-3"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {today.dayContent.theme}
          </h1>
          {today.dayContent.systemMessage && (
            <p
              className="text-base italic"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              {today.dayContent.systemMessage}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {progress && (
          <GlassPanel>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Dag {progress.progress.completedDays} av {progress.progress.totalDays}
              </span>
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>
                {progressPercent}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                }}
              />
            </div>
          </GlassPanel>
        )}

        {/* Conversation prompt */}
        <GlassPanel goldBorder>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Samaleprompt
          </h3>
          <p
            className="text-lg leading-relaxed"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.65',
            }}
          >
            {today.dayContent.conversationPrompt}
          </p>
        </GlassPanel>

        {/* Reflection */}
        <GlassPanel>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Refleksjon
          </h3>
          <p
            className="text-base mb-4 italic"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {today.dayContent.reflectionQuestion}
          </p>
          <textarea
            className="w-full rounded-xl px-4 py-3 text-sm mb-4 resize-y"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
            }}
            placeholder="Kva tenkjer du om dette? Del med din match..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
          />
          <textarea
            className="w-full rounded-xl px-4 py-3 text-sm mb-4 resize-y"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
            }}
            placeholder="Svar på samtalepromptet til din match..."
            value={conversationResponse}
            onChange={(e) => setConversationResponse(e.target.value)}
            rows={4}
          />
          <button
            onClick={handleReflect}
            className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
            style={{
              background: reflection || conversationResponse ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
              color: reflection || conversationResponse ? '#0B0E11' : 'rgba(212, 175, 55, 0.5)',
            }}
            disabled={!reflection && !conversationResponse}
          >
            Lagrefleksjon
          </button>
        </GlassPanel>

        {/* Task */}
        {today.dayContent.task && (
          <GlassPanel>
            <h3
              className="text-base font-semibold mb-3"
              style={{ color: '#FFFFFF' }}
            >
              Dagens oppgåve
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.65',
              }}
            >
              {today.dayContent.task}
            </p>
          </GlassPanel>
        )}

        {/* Resonance */}
        <GlassPanel>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Resonans
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {today.dayContent.resonanceGoal}
          </p>

          <div className="space-y-6">
            {/* Emotional tone */}
            <div>
              <label
                className="text-sm mb-3 block"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Kva føler du i dag?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setEmotionalTone(t.value)}
                    className="px-4 py-3 text-left text-sm rounded-xl transition-all duration-200 ease-out"
                    style={{
                      background: emotionalTone === t.value ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: emotionalTone === t.value ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: emotionalTone === t.value ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth slider */}
            <div>
              <label
                className="text-sm mb-3 block"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Djupde: {depthLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={depthLevel}
                onChange={(e) => setDepthLevel(Number(e.target.value))}
                className="w-full accent-[#D4AF37]"
              />
              <div
                className="flex justify-between text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <span>Overflate</span>
                <span>Djup</span>
              </div>
            </div>

            {/* Response quality */}
            <div>
              <label
                className="text-sm mb-3 block"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Korleis var svaret frå din match?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {qualities.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setResponseQuality(q.value)}
                    className="px-4 py-3 text-left text-sm rounded-xl transition-all duration-200 ease-out"
                    style={{
                      background: responseQuality === q.value ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: responseQuality === q.value ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: responseQuality === q.value ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mutualSharing}
                  onChange={(e) => setMutualSharing(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Gjensidig deling
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vulnerability}
                  onChange={(e) => setVulnerability(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Sårbarheit
                </span>
              </label>
            </div>

            {/* Summary */}
            <textarea
              className="w-full rounded-xl px-4 py-3 text-sm resize-y"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
              }}
              placeholder="Kort oppsummering av dagen..."
              value={resonanceSummary}
              onChange={(e) => setResonanceSummary(e.target.value)}
              rows={3}
            />

            <button
              onClick={handleResonance}
              className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
              style={{ background: '#D4AF37', color: '#0B0E11' }}
            >
              Lagra resonans
            </button>
          </div>
        </GlassPanel>

        {/* Lock indicator */}
        {today.locks.isDayLocked && today.locks.nextDayAt && (
          <div className="text-center py-4">
            {(() => {
              const next = new Date(today.locks.nextDayAt);
              const hours = Math.max(0, Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60)));
              return (
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                  Du kan gå vidare til neste dag om {hours} time(r).
                </p>
              );
            })()}
          </div>
        )}

        {/* Content overview */}
        {progress && (
          <GlassPanel>
            <h3
              className="text-base font-semibold mb-4"
              style={{ color: '#FFFFFF' }}
            >
              Reiseoversikt
            </h3>
            <div className="space-y-3">
              {(() => {
                const phaseGroups: Record<string, number> = {};
                progress.contentOverview.forEach((item) => {
                  if (item.day <= 5) {
                    phaseGroups['EARLY'] = (phaseGroups['EARLY'] || 0) + 1;
                  } else if (item.day <= 14) {
                    phaseGroups['BUILDING_TRUST'] = (phaseGroups['BUILDING_TRUST'] || 0) + 1;
                  } else if (item.day <= 25) {
                    phaseGroups['DEEPER'] = (phaseGroups['DEEPER'] || 0) + 1;
                  } else {
                    phaseGroups['CHECKIN'] = (phaseGroups['CHECKIN'] || 0) + 1;
                  }
                });
                return Object.entries(phaseGroups).map(([phase, count]) => (
                  <div key={phase} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PHASE_COLORS[phase] || '#D4AF37' }}
                    />
                    <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {PHASE_LABELS[phase] || phase}
                    </span>
                    <span className="text-xs ml-auto" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                      {phase === 'EARLY' ? '1–5' : phase === 'BUILDING_TRUST' ? '6–14' : phase === 'DEEPER' ? '15–25' : '26–30'}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                      ({count} dagar)
                    </span>
                  </div>
                ));
              })()}
              <div
                className="pt-3 border-t"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  />
                  <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    No (dag {today.day})
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>
        )}
      </main>
    </div>
  );
}