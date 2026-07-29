/* eslint-disable react-hooks/exhaustive-deps */
/**
 * ToSom Dashboard — Weekly Summary (Real Data)
 * 
 * Premium ukesoppsummering med refleksjoner, progresjon og kommende steg.
 * Hentar data frå /api/journey/progress og /api/journey/today.
 */

'use client';

import { useState, useEffect } from 'react';

interface SummaryData {
  week: string;
  progress: number;
  totalDays: number;
  reflectionsCompleted: number;
  milestonesReached: number;
  highlight: string;
  upcoming: Array<{ day: number; title: string; desc: string }>;
  conversationId?: string;
  phase?: string;
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      // Hent progresjon fra /api/journey/progress
      const progressRes = await fetch('/api/journey/progress');
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        
        // Hent daglege steg for oppsummering
        const todayRes = await fetch('/api/journey/today');
        let upcomingSteps: SummaryData['upcoming'] = [];
        if (todayRes.ok) {
          const todayData = await todayRes.json();
          upcomingSteps = [
            { day: progressData.day + 1, title: 'Kommande steg 1', desc: 'Oppgåve for i morgon' },
            { day: progressData.day + 2, title: 'Kommande steg 2', desc: 'Refleksjon for over i morgon' },
            { day: progressData.day + 3, title: 'Kommande steg 3', desc: 'Samtale-spørsmål for dag 3' },
          ];
        }

        setSummary({
          week: `Uke ${getWeekNumber(new Date())}`,
          progress: progressData.day ?? 1,
          totalDays: 30,
          reflectionsCompleted: progressData.reflectionsCompleted ?? 0,
          milestonesReached: progressData.milestonesReached ?? 0,
          highlight: getHighlightText(progressData.day ?? 1),
          upcoming: upcomingSteps.length > 0 ? upcomingSteps : [
            { day: 13, title: 'Utforsk verdier', desc: 'Dag 13 — Dyp samtale' },
            { day: 14, title: 'Del ein personleg historie', desc: 'Dag 14 — Nærheit' },
            { day: 15, title: 'Framtidsdrøymar', desc: 'Dag 15 — Felles retning' },
          ],
          conversationId: progressData.conversationId,
          phase: progressData.phase,
        });
      } else {
        setDefaultSummary();
      }
    } catch {
      setDefaultSummary();
    } finally {
      setLoading(false);
    }
  }

  function setDefaultSummary() {
    setSummary({
      week: `Uke ${getWeekNumber(new Date())}`,
      progress: 1,
      totalDays: 30,
      reflectionsCompleted: 0,
      milestonesReached: 0,
      highlight: 'Reisa di har netop starta. kvar dag bringar ei ny moglegheit — for å kjenne, forstå og nærme deg partneren din.',
      upcoming: [
        { day: 2, title: 'Utforsk vanar', desc: 'Kva gjer deg til den du er?' },
        { day: 3, title: 'Del ein personleg historie', desc: 'Ein oppleving som forma deg' },
        { day: 4, title: 'Framtidsvisjon', desc: 'Kva ser du for deg om 5 år?' },
      ],
    });
  }

  if (loading) {
    return (
      <div className="space-y-10 md:space-y-14">
        <div className="text-white/40 animate-pulse">Hentar ukesoppsummering...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="space-y-10 md:space-y-14">
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Ingen aktiv reise funnen. Match først for å starte reisa di.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-14 animate-subtlePop">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white">
          Ukesoppsummering
        </h1>
        <p className="text-[var(--ts-text-soft)] leading-[1.7] mt-2">
          En varm oppsummering av reisen deres denne uken.
        </p>
      </div>

      {/* Phase indicator */}
      {summary.phase && (
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(212,175,55,0.6)' }}>
          <span className="px-2 py-1 rounded-md" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)' }}>
            {summary.phase}
          </span>
        </div>
      )}

      {/* Ukesoppsummering-kort */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-2xl p-6 ts-shadow-card animate-subtlePop
      ">
        <p className="text-[var(--ts-text-soft)] text-sm mb-2">
          {summary.week}
        </p>
        <h2 className="text-xl font-medium text-white mb-3">
          Høydepunkt
        </h2>
        <p className="text-[var(--ts-text)] leading-[1.7]">
          {summary.highlight}
        </p>
      </div>

      {/* Statistikk-kort */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Progresjon" value={`${summary.progress}/${summary.totalDays}`} icon="🚶" />
        <StatCard label="Refleksjoner" value={summary.reflectionsCompleted.toString()} icon="💭" />
        <StatCard label="Milepæler" value={summary.milestonesReached.toString()} icon="🏆" />
      </section>

      {/* Progress bar */}
      <div className="
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        rounded-xl p-5 ts-shadow-card
      ">
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Reise-progresjon</span>
          <span style={{ color: '#D4AF37' }}>{Math.round((summary.progress / summary.totalDays) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(summary.progress / summary.totalDays) * 100}%`,
              background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
            }}
          />
        </div>
      </div>

      {/* Kommende uke */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Neste uke</h2>
        <ul className="space-y-4">
          {summary.upcoming.map((step, i) => (
            <li
              key={i}
              className="
                bg-[var(--ts-bg-soft)]
                border border-[var(--ts-border)]
                rounded-xl p-4 ts-shadow-card animate-fadeIn
              "
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-md flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}
                >
                  Dag {step.day}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{step.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ─── Helpers ─── */
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

function getHighlightText(day: number): string {
  if (day <= 3) {
    return 'Dere har nettopp starta reisa di. Dei første dagane handlar om å bygge eit grunnlag av trygghet og nysgjerrigheit.';
  } else if (day <= 7) {
    return 'Dere har hatt fleire dype samtalar og bygger ein sterk kontakt. Fortsett med å vere oppmerksomme mot kvarandre.';
  } else if (day <= 14) {
    return 'Halvvegs av den første etappen. Dere har utforska mykje av kvarandre — no er det tid for djupe refleksjonar.';
  } else if (day <= 21) {
    return 'Dere har bygd ein verkeleg binding. Refleksjonane dykkar vert djupe, og samtalen blir meir natuleg.';
  } else {
    return 'Berre få dagar att av reisa! Dere har gjennomgått mykje saman — no er det tid for å feire milepælarn.';
  }
}

/* ─── StatCard ─── */
function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="
      bg-[var(--ts-bg-soft)]
      border border-[var(--ts-border)]
      rounded-xl p-6 ts-shadow-card text-center
    ">
      <span className="text-lg mb-2 block">{icon}</span>
      <p className="text-[var(--ts-text-soft)] text-sm">{label}</p>
      <p className="text-[var(--ts-text)] text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}