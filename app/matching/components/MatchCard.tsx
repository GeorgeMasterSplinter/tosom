/**
 * ToSom -- MatchCard
 * Viser éin match med score, type og forklaring.
 */

'use client';

import { useState } from 'react';

/* ------ Type-definisjonar ------ */

interface MatchExplanation {
  why: string[];
  talkAbout: string[];
  challenges: string[];
}

interface MatchTypeResult {
  type: string;
  label: string;
  color: string;
  description: string;
}

interface OtherUserProfile {
  id: string;
  email: string;
  identityName?: string | null;
  age?: number | null;
  photoUrl?: string | null;
  bio?: string | null;
}

interface MatchData {
  id: string;
  score: number;
  type: string;
  explanation: MatchExplanation;
  matchType: MatchTypeResult;
  otherUser: OtherUserProfile;
}

interface Props {
  match: MatchData;
  onSelect: (matchId: string) => void;
}

/* ------ Hjelp for score ring ------ */

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="90" height="90" className="-rotate-90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle
          cx="45" cy="45" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-lg font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

/* ------ Hovedkomponent ------ */

export function MatchCard({ match, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { score, matchType, explanation, otherUser } = match;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_0_20px_rgba(255,255,255,0.04)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(80,120,255,0.15)]"
    >
      {/* Glass refleks */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />

      <div className="relative p-6 space-y-4">
        {/* Header: Profil + score */}
        <div className="flex items-center gap-4">
          <ScoreRing score={score} color={matchType.color} />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {otherUser.identityName || 'Ukjent'}
            </h3>
            <p className="text-sm text-white/60">
              {otherUser.age ? `${otherUser.age} år` : 'Alder ikke oppgitt'}
            </p>
            <span
              className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${matchType.color}22`,
                color: matchType.color,
                border: `1px solid ${matchType.color}44`,
              }}
            >
              {matchType.label}
            </span>
          </div>
        </div>

        {/* Beskrivelse */}
        <p className="text-sm text-white/70 leading-relaxed">{matchType.description}</p>

        {/* Kjønn-boble (valgfritt) */}
        {otherUser.photoUrl && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
            <img src={otherUser.photoUrl} alt={otherUser.identityName || ''} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Expanderbart innhold */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
            <div>
              <h4 className="text-sm font-medium text-white/90">Hvor dere matcher</h4>
              <ul className="mt-1 space-y-1">
                {explanation.why.map((t, i) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white/90">Samtaletemaer</h4>
              <ul className="mt-1 space-y-1">
                {explanation.talkAbout.map((t, i) => (
                  <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5BA3CF] flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {explanation.challenges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/90">Mulige utfordringer</h4>
                <ul className="mt-1 space-y-1">
                  {explanation.challenges.map((t, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E8A84C] flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Knapp */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/8 text-white/80 border border-white/10 hover:bg-white/12 hover:border-white/15 transition-all"
          >
            {expanded ? 'Skjul' : 'Se mer'}
          </button>
          <button
            onClick={() => onSelect(match.id)}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#D4AF37] text-[#0B0E11] hover:bg-[#E8C766] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
          >
            Aksepter
          </button>
        </div>
      </div>
    </div>
  );
}