/**
 * ToSom UI 5.0 — Journey (30-dagers reise)
 * 
 * Dagleg refleksjon, tema, oppgåve, resonans
 * Ingen gamification. Ingen bilder før dag 15.
 */

'use client';

import { useEffect, useState } from 'react';
import { GlassPanel } from '@/components/ui5/GlassPanel';
import { JourneyProgress } from './components/JourneyProgress';
import { EmptyJourneyState } from './components/EmptyJourneyState';

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
   const [completedStepId, setCompletedStepId] = useState<string | null>(null);

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
         setError('Hmm… dette gikk ikke helt som planlagt.');
       }
     } catch {
       setError('Vi gir oss ikke – vi leter videre.');
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

   const handleEmptyCTA = () => {
     window.location.href = '/onboarding/start';
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
       setCompletedStepId('reflection');
       setTimeout(() => setCompletedStepId(null), 1500);
       setReflection('');
       setConversationResponse('');
       await Promise.all([fetchToday(), fetchProgress()]);
     } catch {
       setError('Kan du prøve igjen?');
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
       setCompletedStepId('resonance');
       setTimeout(() => setCompletedStepId(null), 1500);
       await Promise.all([fetchToday(), fetchProgress()]);
     } catch {
       setError('Vi jobber med å fikse dette.');
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

   /* No journey */
   if (!today) {
     return (
       <div className="min-h-screen" style={{ background: '#0B0E11' }}>
         <main className="mx-auto max-w-[720px] px-8 py-24">
           <EmptyJourneyState onStarted={handleEmptyCTA} />
         </main>
       </div>
     );
   }

   /* Error */
   if (error) {
     return (
       <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0E11' }}>
         <div className="text-center fade-in" style={{ animation: 'fadeInUp 0.4s ease-out both' }}>
           <div
             className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
             style={{
               background: 'rgba(255, 77, 77, 0.1)',
               border: '1px solid rgba(255, 77, 77, 0.2)',
               color: '#FF4D4D',
             }}
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
               <path d="M12 12V16M12 8H12.01M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
             </svg>
           </div>
           <p className="text-base mb-2 font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
             Hmm… dette gikk ikke helt som planlagt.
           </p>
           <p className="text-sm mb-8" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
             Kan du prøve igjen?
           </p>
           <button
             onClick={() => window.location.reload()}
             className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015] active:scale-[0.98]"
             style={{ background: '#D4AF37', color: '#0B0E11', boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)' }}
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
         <main className="mx-auto max-w-[720px] px-8 py-24 text-center fade-in" style={{ animation: 'fadeInUp 0.5s ease-out both' }}>
           <div
             className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
             style={{
               background: 'rgba(212, 175, 55, 0.1)',
               border: '1px solid rgba(212, 175, 55, 0.25)',
               boxShadow: '0 0 32px rgba(212,175,55,0.25)',
             }}
           >
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
               <path d="M5 13l4 4L19 7" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
           </div>
           <h1
             className="text-[32px] font-semibold mb-4"
             style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
           >
             Reisa di er ferdig
           </h1>
           <p
             className="text-base mb-8"
             style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.65' }}
           >
             Du har gått gjennom 30 dagar med refleksjon, resonans og oppgåver.
             <br />
             Denne reisen har blitt noe fint.
           </p>
           <div className="flex justify-center gap-4">
             <button
               className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015] active:scale-[0.98]"
               style={{ background: '#D4AF37', color: '#0B0E11', boxShadow: '0 0 25px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.2)' }}
             >
               Fortsett reisa
             </button>
             <button
               className="px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015] active:scale-[0.98]"
               style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
             >
               Avslutt
             </button>
           </div>
         </main>
       </div>
     );
   }

   const phaseLabel = PHASE_LABELS[today.phase] || today.phase;
   const phaseColor = PHASE_COLORS[today.phase] || '#D4AF37';
   const progressPercent = progress?.progress?.percent || 0;

   // Guiding-text
   const guidingText = today.locks.canAdvance
     ? 'Dere er på rett spor – ta det roleg.'
     : today.locks.isDayLocked
     ? 'Ta det roleg – reisa venter.'
     : 'Dette er reisen dere tar saman.';

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
      <main className="mx-auto max-w-[720px] px-8 py-12 space-y-8">
        {/* Guiding-text */}
        <div className="text-center fade-in" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.75)' }}
          >
            {guidingText}
          </p>
        </div>

        {/* Progress */}
        {progress && (
          <JourneyProgress
            percent={progressPercent}
            completedDays={progress.progress.completedDays}
            totalDays={progress.progress.totalDays}
            phaseLabel={phaseLabel}
            day={today.day}
          />
        )}

        {/* Theme */}
        <div className="text-center fade-in" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
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

        {/* Conversation prompt */}
        <GlassPanel goldBorder>
          <h3
            className="text-base font-semibold mb-3"
            style={{ color: '#FFFFFF' }}
          >
            Samtaleprompt
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
            className="w-full px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.015] active:scale-[0.98]"
            style={{
              background: reflection || conversationResponse ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
              color: reflection || conversationResponse ? '#0B0E11' : 'rgba(212, 175, 55, 0.5)',
              boxShadow: (reflection || conversationResponse) ? '0 0 20px rgba(212,175,55,0.2)' : 'none',
            }}
            disabled={!reflection && !conversationResponse}
          >
            Fortsett til neste steg
          </button>

          {/* Completed feedback */}
          {completedStepId === 'reflection' && (
            <div className="text-center mt-4 fade-in" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
              <p className="text-sm font-medium" style={{ color: '#D4AF37' }}>
                Bra jobba! ✨
              </p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Neste steg er klart når dere er det.
              </p>
            </div>
          )}
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

        {/* Lock indicator */}
        {today.locks.isDayLocked && today.locks.nextDayAt && (
          <div className="text-center py-6 fade-in" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
            {(() => {
              const next = new Date(today.locks.nextDayAt);
              const hours = Math.max(0, Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60)));
              return (
                <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                  Ta det roleg – neste reisepunkt er klart om {hours} time(r).
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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.3s ease-out both; }
      `}</style>
    </div>
  );
}
