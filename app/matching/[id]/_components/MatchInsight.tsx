/**
 * ToSom — Match Insight Component
 * 
 * Viser AI-generert innsikt om ein match:
 * - summary: "Slik kan denne matchen følast i praksis"
 * - strengths: "Styrker dere har saman"
 * - clarity: "Dette kan vera fint å vera tydeleg på"
 * - starter: "Eit godt måte å starte samtalen på"
 * 
 * Premium UI: glassmorphism, gull-aksentar, fade-in
 * Caching: henta frå localStorage om API feilar
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface InsightData {
  summary: string;
  strengths: string;
  clarity: string;
  starter: string;
  source: 'ai' | 'cache' | 'generating';
}

interface MatchInsightProps {
  matchId: string;
}

/* ====== Section-komponent ====== */

function InsightSection({ title, children, delay }: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="animate-[fadeInUp_0.4s_ease-out]"
      style={{
        animationDelay: `${delay || 0}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div
        className="p-5 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(212, 175, 55, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 0 40px rgba(80,120,255,0.08), inset 0 0 12px rgba(255,255,255,0.04)',
        }}
      >
        {/* Title */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#D4AF37" strokeWidth="1.2" opacity="0.5" />
              <path d="M12 8v4l2 2" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(212, 175, 55, 0.85)' }}>
            {title}
          </h4>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ====== Hovedkomponent ====== */

export function MatchInsight({ matchId }: MatchInsightProps) {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hent innsikt
  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/match/insight?matchId=${matchId}`);

      if (!res.ok) {
        if (res.status === 401) {
          setError('Du er ikkje innlogga. Ver vennleg og logg inn på nytt.');
          return;
        }
        if (res.status === 403) {
          setError('Du har ikkje tilgang til denne matchen.');
          return;
        }
        if (res.status === 404) {
          setError('Matchen finst ikkje.');
          return;
        }
        throw new Error('Kunne ikkje henta innsikt');
      }

      const data = await res.json() as { summary: string; strengths: string; clarity: string; starter: string; source: string };

      setInsight({
        summary: data.summary,
        strengths: data.strengths,
        clarity: data.clarity,
        starter: data.starter,
        source: data.source as 'ai' | 'cache',
      });

      // Lag i localStorage (fallback)
      localStorage.setItem(`matchInsight_${matchId}`, JSON.stringify(data));
    } catch {
      // Sjekk localStorage (fallback)
      const cached = localStorage.getItem(`matchInsight_${matchId}`);
      if (cached) {
        const data = JSON.parse(cached) as { summary: string; strengths: string; clarity: string; starter: string };
        setInsight({ ...data, source: 'cache' });
      } else {
        setError('Kunne ikkje lasta innsikt. Ver vennleg og prøv på nytt.');
      }
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Hent ved montering
  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  // === Loading-state: Skeleton shimmer ===

  if (loading) {
    return (
      <div className="space-y-4 animate-[pulse_1.5s_ease-in-out_infinite]">
        <div
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
            <div
              className="h-4 w-24 rounded"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '90%' }} />
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '80%' }} />
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
            <div
              className="h-4 w-20 rounded"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '85%' }} />
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '75%' }} />
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
            <div
              className="h-4 w-28 rounded"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '95%' }} />
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '70%' }} />
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
            <div
              className="h-4 w-22 rounded"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '88%' }} />
            <div className="h-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.04)', width: '65%' }} />
          </div>
        </div>
      </div>
    );
  }

  // === Error-state: Roleg feilmelding ===

  if (error) {
    return (
      <div
        className="p-5 rounded-2xl text-center"
        style={{
          background: 'rgba(255, 77, 77, 0.04)',
          border: '1px solid rgba(255, 77, 77, 0.12)',
        }}
      >
        <p className="text-sm mb-3" style={{ color: 'rgba(255, 77, 77, 0.6)' }}>
          {error}
        </p>
        <button
          onClick={fetchInsight}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#D4AF37',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.18)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.1)';
          }}
        >
          Prøv på nytt
        </button>
      </div>
    );
  }

  // === Tom tilstand: "Generer innsikt" ===

  if (!insight) {
    return (
      <div
        className="p-6 rounded-2xl text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          Ingen innsikt tilgjengeleg for denne matchen.
        </p>
        <button
          onClick={fetchInsight}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))',
            border: '1.5px solid rgba(212,175,55,0.3)',
            color: '#D4AF37',
            boxShadow: '0 0 30px rgba(212,175,55,0.15)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(212,175,55,0.3)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(212,175,55,0.15)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Generer innsikt
        </button>
      </div>
    );
  }

  // === Hovud-visning: 4 seksjoner ===

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.5)' }}>
          Innsikt
        </span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
      </div>

      {/* Source badge */}
      <div className="text-right mb-1">
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: insight.source === 'ai' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)',
            color: 'rgba(212,175,55,0.6)',
          }}
        >
          {insight.source === 'ai' ? 'AI-generert' : 'Cache'}
        </span>
      </div>

      {/* Section 1: Summary */}
      <InsightSection title="Slik kan denne matchen følast i praksis" delay={100}>
        {insight.summary}
      </InsightSection>

      {/* Section 2: Strengths */}
      <InsightSection title="Styrker dere har saman" delay={200}>
        {insight.strengths}
      </InsightSection>

      {/* Section 3: Clarity */}
      <InsightSection title="Dette kan vera fint å vera tydeleg på" delay={300}>
        {insight.clarity}
      </InsightSection>

      {/* Section 4: Starter */}
      <div
        className="animate-[fadeInUp_0.4s_ease-out]"
        style={{
          animationDelay: '400ms',
          opacity: 0,
          animationFillMode: 'forwards',
        }}
      >
        <div
          className="p-5 rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(212,175,55,0.06)',
            border: '1.5px solid rgba(212,175,55,0.2)',
            boxShadow: '0 0 40px rgba(212,175,55,0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Title */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(212,175,55,0.9)' }}>
              Eit godt måte å starte samtalen på
            </h4>
          </div>

          {/* Starter content */}
          <div
            className="text-sm leading-relaxed italic"
            style={{
              color: 'rgba(212,175,55,0.75)',
              paddingLeft: '8px',
              borderLeft: '2px solid rgba(212,175,55,0.2)',
            }}
          >
            {insight.starter}
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <div className="text-center pt-1">
        <button
          onClick={fetchInsight}
          className="text-xs transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.25)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(212,175,55,0.6)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)';
          }}
        >
          Oppdater innsikt
        </button>
      </div>
    </div>
  );
}