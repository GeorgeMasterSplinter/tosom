/**
 * ToSom UI 5.0 — Match-detaljside
 * 
 * Viser full informasjon om éin match:
 * - Score (stor, premium)
 * - Matchtype
 * - Kvifor dere matcher
 * - Kva dere bør snakke om
 * - Potensielle utfordringar
 * - Profil-sammendrag for begge
 * - CTA: "Start samtale"
 * - CTA: "Gi oss et spørsmål basert på matchen"
 */

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/panels/GlassPanel';
import { ProfileSummary } from '../components/ProfileSummary';
import { getMatchTypeLabel } from '../MatchType';
import { MatchInsight } from './_components/MatchInsight';

interface MatchDetail {
  id: string;
  score: number;
  type: string;
  status: string;
  explanation: {
    why?: string[];
    talkAbout?: string[];
    challenges?: string[];
  };
  resonanceLevel: string;
  createdAt: string;
  userA: {
    id: string;
    email: string;
    name: string | null;
    age: number | null;
    lifestyle: Record<string, unknown>;
    values: {
      futureVision: Record<string, unknown>;
      emotionalNeeds: Record<string, unknown>;
    };
    communication: Record<string, unknown>;
    intimacy: Record<string, unknown>;
    keywords: string[];
  };
  userB: {
    id: string;
    email: string;
    name: string | null;
    age: number | null;
    lifestyle: Record<string, unknown>;
    values: {
      futureVision: Record<string, unknown>;
      emotionalNeeds: Record<string, unknown>;
    };
    communication: Record<string, unknown>;
    intimacy: Record<string, unknown>;
    keywords: string[];
  };
}

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  const id = resolved.id;
  const router = useRouter();

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Hent userId frå localStorage (sett av login-systemet)
  useEffect(() => {
    const stored = localStorage.getItem('tosom_userId');
    if (stored) setCurrentUserId(stored);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/matching/detail?id=${id}`);
        if (!res.ok) throw new Error('Kunne ikkje hente match');
        const data = await res.json();
        setMatch(data);
      } catch (err) {
        console.error('Feil ved henting av match:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Bø er "deg"?
  const meId = currentUserId;
  const otherUser = match
    ? match.userA.id === meId
      ? match.userB
      : match.userA
    : null;

  // Finn sterkeaste område for spørsmål-kategori
  const strongArea = match ? determineStrongArea(match) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)' }}>
        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 50% at 50% 40%, rgba(212,175,55,0.06), transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.25)',
              animation: 'pulseGlow 2.5s infinite ease-in-out',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm" style={{ animation: 'fadeIn 1s ease-out' }}>Lastar match-detalar...</p>
        </div>
        <style>{`
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 12px rgba(212,175,55,0.2); }
            50% { box-shadow: 0 0 30px rgba(212,175,55,0.45); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)' }}>
        <div className="text-center space-y-6">
          <div
            className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Fant ikke denne matchen.</p>
          <Link
            href="/matching"
            className="inline-block text-sm font-medium"
            style={{ color: '#D4AF37', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            ← Tilbake til matcher
          </Link>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(match.score);
  const typeLabel = getMatchTypeLabel(match.score);

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)' }}>
      {/* Ambient bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,175,55,0.05), transparent 70%),
            radial-gradient(ellipse 80% 60% at 30% 80%, rgba(80,120,255,0.04), transparent 65%),
            linear-gradient(180deg, #0E1218 0%, #1A1F26 100%)
          `,
        }}
      />

      <main className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {/* Tilbake-knapp */}
        <Link
          href="/matching"
          className="inline-flex items-center gap-2 text-sm mb-10 group"
          style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Tilbake til matcher</span>
        </Link>

        {/* SCORE — Stor, premium */}
        <div className="text-center mb-16">
          {/* Spotlight bak score */}
          <div
            className="inline-block relative"
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), transparent 60%)',
              padding: '40px 60px',
              borderRadius: '24px',
            }}
          >
            <div
              className="text-7xl font-bold mb-2"
              style={{
                color: scoreColor,
                textShadow: `0 0 40px ${scoreColor}55`,
                animation: 'scoreIn 0.8s ease-out',
              }}
            >
              {match.score}
            </div>
            <div
              className="text-lg font-medium"
              style={{ color: 'rgba(255,255,255,0.6)', animation: 'fadeIn 0.8s ease-out 0.2s both' }}
            >
              {typeLabel}
            </div>
          </div>
          <style>{`
            @keyframes scoreIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* HVORFOR DERE MATCHER */}
        <GlassPanel
          goldBorder={true}
        >
          <ul className="space-y-4">
            {(match.explanation.why || [
              'Dere har felles verdiar om menneskelege relasjonar.',
              'Dere har liknande syn på viktige tema i livet.',
            ]).map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                  style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.4)' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{w}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* HVA DERE BØR SNAKKE OM */}
        <GlassPanel
          goldBorder={true}
        >
          <ul className="space-y-4">
            {(match.explanation.talkAbout || [
              'Kva gir dere mest energi i kvardagen?',
              'Kvordan viser dere kjærlheit best?',
              'Kva er ein drøm dere jobbar mot?',
            ]).map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <span
                  className="flex-shrink-0 text-[var(--ts-gold)] mt-0.5"
                  style={{ color: '#D4AF37' }}
                >
                  ✦
                </span>
                <span style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{t}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* UTFORDRINGER — roleg formulert */}
        <GlassPanel
          goldBorder={true}
        >
          <ul className="space-y-4">
            {(match.explanation.challenges || [
              'Dere kan ha ulike måtar å nærme seg ting på — tydeligheit hjelper.',
            ]).map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
              >
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                  style={{
                    background: 'rgba(212, 175, 55, 0.6)',
                    boxShadow: '0 0 6px rgba(212,175,55,0.3)',
                  }}
                />
                <span style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontStyle: 'italic' }}>{c}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* PROFIL-SAMMENDRAG */}
        <GlassPanel
          goldBorder={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileSummary
              user={match.userA}
              isYou={match.userA.id === meId}
            />
            <ProfileSummary
              user={match.userB}
              isYou={match.userB.id === meId}
            />
          </div>
        </GlassPanel>

        {/* AI INNSIKT */}
        <MatchInsight matchId={match.id} />

        {/* CTA-KNAPPER */}
        <div className="space-y-4 mt-12">
          {/* Start samtale */}
          <button
            onClick={async () => {
              if (!match || creating) return;
              setCreating(true);
              try {
                // Finn den andre brukaren sin ID
                const otherId = match.userA.id === meId ? match.userB.id : match.userA.id;
                const res = await fetch('/api/chat/conversations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ otherUserId: otherId }),
                });
                if (!res.ok) throw new Error('Kunne ikke oppta samtale');
                const convo = await res.json();
                router.push(`/chat/${convo.id}`);
              } catch (err) {
                console.error('Feil ved oppretting av samtale:', err);
                setCreating(false);
              }
            }}
            className="
              block w-full text-center py-5 rounded-xl text-base font-semibold
              transition-all duration-300 relative overflow-hidden
            "
            disabled={creating}
            style={{
              background: creating
                ? 'rgba(212,175,55,0.3)'
                : 'linear-gradient(135deg, #D4AF37 0%, #E8C766 100%)',
              color: creating ? 'rgba(255,255,255,0.5)' : '#0B0E11',
              boxShadow: creating
                ? 'none'
                : '0 0 40px rgba(212,175,55,0.4), 0 4px 16px rgba(0,0,0,0.2)',
              border: '1px solid rgba(212,175,55,0.5)',
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.7 : 1,
            }}
          >
            <span className="relative z-10">
              {creating ? 'Opentar samtale...' : '💬 Start samtale'}
            </span>
          </button>

          {/* Gi oss et spørsmål basert på matchen */}
          <button
            onClick={() => openQuestionModal(match, strongArea ?? undefined)}
            className="
              w-full py-5 rounded-xl
              bg-[rgba(255,255,255,0.04)]
              border border-[rgba(255,255,255,0.1)]
              text-base font-medium
              transition-all duration-300
              hover:bg-[rgba(255,255,255,0.07)]
              hover:border-[rgba(212,175,55,0.25)]
            "
            style={{ color: 'rgba(255,255,255,0.7)', animation: 'fadeIn 0.5s ease-out 0.3s both' }}
          >
            ✦ Gi oss et spørsmål basert på matchen
          </button>
        </div>

        {/* Dato */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Matcha {new Date(match.createdAt).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </main>
    </div>
  );
}

/* ===== HELPARFUNKsjonar ===== */

function getScoreColor(score: number): string {
  if (score >= 85) return '#D4AF37';
  if (score >= 70) return '#E8C766';
  if (score >= 55) return '#C49A3C';
  return 'rgba(255,255,255,0.7)';
}

function determineStrongArea(match: MatchDetail): string {
  const scores = (match.explanation as any)._scores || {};
  const n = (v: unknown) => (typeof v === 'number' ? v : 0);
  const pairs: [string, number][] = [
    ['verdier', n(scores.fremtid) || n(scores.livsstil) || 0],
    ['kommunikasjon', n(scores.kommunikasjon) || 0],
    ['trygghet', n(scores.tilknytning) || n(scores.kjaerlighet) || 0],
    ['fremtid', n(scores.fremtid) || 0],
    ['leik', n(scores.humor) || 0],
  ];
  pairs.sort((a, b) => b[1] - a[1]);
  return pairs[0][0];
}

function openQuestionModal(match: MatchDetail, category?: string) {
  // Send ein hending til foreldra eller open ein modal
  window.dispatchEvent(new CustomEvent('openQuestionModal', {
    detail: { match, category },
  }));
}