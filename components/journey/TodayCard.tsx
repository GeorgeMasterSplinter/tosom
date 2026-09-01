/**
 * Tosom — TodayCard (Premium Nordic Gold 2026) 🟡⭐
 * Viser dagens JourneyDayContent-tema med refleksjon, samtalesprompt og resonansmål.
 * 
 * Design:
 * - Premium glass-panel med backdrop-blur
 * - Fase-fargar: grønn (dag 1-10), gull (dag 11-20), lila (dag 21-30)
 * - Hver seksjon har eget ikon og typografi
 * - Fade-in animasjon ved lasting
 * 
 * Data kommer fra `GET /api/journey/today`:
 * { theme, reflectionQuestion, conversationPrompt, resonanceGoal, phase, source }
 */

"use client";

import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
};

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */

export interface TodayContentData {
  theme?: string | null;
  phase: string;
  reflectionQuestion?: string | null;
  conversationPrompt?: string | null;
  resonanceGoal?: string | null;
  source: "database" | "fallback";
  task?: {
    title?: string;
    description?: string;
    prompt?: string;
  } | null;
}

export interface TodayCardProps {
  journeyDay?: number;
  onCompleteReflection?: () => void;
}

/* ═══════════════════════════════════════
   PHASE CONFIG
   ═══════════════════════════════════════ */

function getPhaseStyle(phase: string) {
  switch (phase) {
    case 'EARLY':
      return { color: '#34D399', icon: '🌱', label: 'Bli kjent' };
    case 'BUILDING_TRUST':
      return { color: '#D4AF37', icon: '🎵', label: 'Bygg tillit' };
    case 'DEEPER':
      return { color: '#9B59B6', icon: '💫', label: 'Djupde' };
    default:
      return { color: 'rgba(255,255,255,0.4)', icon: '⚪', label: phase || 'Ukjent fase' };
  }
}

/* ═══════════════════════════════════════
   LOADING STATE
   ═══════════════════════════════════════ */

function LoadingState() {
  return (
    <div
      className="w-full rounded-2xl p-6 animate-pulse"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorder}`,
      }}
    >
      {/* Fake header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-8 h-8 rounded-lg"
          style={{ background: 'rgba(212,175,55,0.15)' }}
        />
        <div 
          className="h-4 w-32 rounded"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Fake sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4">
          <div 
            className="h-3 w-24 rounded mb-2"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          />
          <div 
            className="h-16 rounded"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════ */

function EmptyState({ journeyDay }: { journeyDay?: number }) {
  return (
    <div
      className="w-full rounded-2xl p-8 text-center"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorder}`,
      }}
    >
      <div 
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <span className="text-2xl">📅</span>
      </div>
      <p 
        className="text-lg font-medium mb-2"
        style={{ color: G.textPrimary }}
      >
        Ingen dagens innhold tilgjengeleg
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   SINGLE SECTION — Premium glass row
   ═══════════════════════════════════════ */

function ContentSection({ 
  icon, 
  title, 
  content, 
  accentColor = G.gold,
}: { 
  icon: string; 
  title: string; 
  content?: string | null;
  accentColor?: string;
}) {
  if (!content) return null;

  return (
    <div 
      className="rounded-xl p-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${accentColor}20`,
      }}
    >
      {/* Title row */}
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="text-sm"
          style={{ filter: `drop-shadow(0 0 6px ${accentColor}40)` }}
        >
          {icon}
        </span>
        <h4 
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: accentColor }}
        >
          {title}
        </h4>
      </div>

      {/* Content */}
      <p 
        className="text-sm leading-relaxed"
        style={{ color: G.textPrimary }}
      >
        {content}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — TODAYCARD
   ═══════════════════════════════════════ */

export function TodayCard({ journeyDay, onCompleteReflection }: TodayCardProps) {
  const [content, setContent] = useState<TodayContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayContent();
  }, [journeyDay]);

  const fetchTodayContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/journey/today');
      if (!res.ok) return;
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error('Feil ved lasting av dagens innhold:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Empty state
  if (!content || !content.theme && !content.reflectionQuestion) {
    return <EmptyState journeyDay={journeyDay} />;
  }

  const phaseStyle = getPhaseStyle(content.phase);
  
  // Use theme from content or task.title (fallback)
  const theme = content.theme || content.task?.title;
  const reflection = content.reflectionQuestion || content.task?.prompt;
  const conversation = content.conversationPrompt || content.task?.description;
  const resonance = content.resonanceGoal || '';

  return (
    <div
      className="w-full rounded-2xl overflow-hidden transition-all duration-500 fade-in"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorderGold}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.15), 0 0 16px ${phaseStyle.color}15`,
      }}
    >
      {/* ═══ HEADER — Fase-indikator + tema === */}
      <div 
        className="p-5"
        style={{
          background: `linear-gradient(135deg, ${phaseStyle.color}08, transparent)`,
          borderBottom: `1px solid ${G.glassBorder}`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Phase icon */}
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: `${phaseStyle.color}15`,
                border: `1px solid ${phaseStyle.color}30`,
                boxShadow: `0 0 16px ${phaseStyle.color}20`,
              }}
            >
              {phaseStyle.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Phase label */}
              <div className="flex items-center gap-2 mb-1.5">
                <span 
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${phaseStyle.color}15`,
                    color: phaseStyle.color,
                    border: `1px solid ${phaseStyle.color}30`,
                  }}
                >
                  {phaseStyle.label}
                </span>

                {/* Source badge */}
                <span 
                  className="text-[9px] font-medium"
                  style={{ color: G.textMuted }}
                >
                  {content.source === 'database' ? '📊 Database' : '📝 Standard'}
                </span>
              </div>

              {/* Theme / Title */}
              <h3 
                className="text-xl font-bold leading-tight"
                style={{ color: G.textPrimary }}
              >
                {theme || 'Ingen tittel'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY — Seksjonar === */}
      <div className="p-5 space-y-3">
        {/* Refleksjonsspørsmål */}
        {reflection && (
          <ContentSection 
            icon="💭"
            title="Refleksjonsspørsmål"
            content={reflection}
            accentColor="#60A5FA"
          />
        )}

        {/* Samtaleprompt */}
        {conversation && !reflection && (
          <ContentSection 
            icon="💬"
            title="Samtaleprompt"
            content={conversation}
            accentColor={G.gold}
          />
        )}

        {/* Resonansmål */}
        {resonance && (
          <ContentSection 
            icon="🎯"
            title="Resonansmål"
            content={resonance}
            accentColor="#34D399"
          />
        )}
      </div>

      {/* ═══ FOOTER — Oppdater-knapp === */}
      <div 
        className="px-5 py-3 border-t"
        style={{ borderColor: G.glassBorder }}
      >
        <button
          onClick={fetchTodayContent}
          className="text-xs font-medium transition-all hover:brightness-125 flex items-center gap-1.5 mx-auto"
          style={{ color: G.textSecondary }}
        >
          <span>🔄</span> Oppdater dagens innhold
        </button>
      </div>

      {/* CSS Animasjonar */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default TodayCard;