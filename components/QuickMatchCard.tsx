/**
 * ToSom — QuickMatchCard (dashboard-kort med ScoreRing)
 * 
 * Brukes på /dashboard og /matching for å vise RASK match-forhåndsvisning
 * med ScoreRing-resonans, grunnleggende info og kort action.
 */

'use client';

import Image from 'next/image';
import { toResonanceLevel, resonanceLabel } from '@/lib/matching/resonanceLevel';

/* ------ Props ------ */

interface OtherUser {
  name?: string | null;
  age?: number | null;
  photoUrl?: string | null;
}

interface Props {
  score: number;
  otherUser?: OtherUser | null;
  type?: string | null;
  explanation?: Record<string, unknown> | null;
  highlight?: boolean;
  onSeeMatch?: () => void;
  onAccept?: () => void;
}

/* ------ ScoreRing ------ */

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? '#D4AF37' : score >= 70 ? '#E8C766' : 'rgba(255,255,255,0.7)';
  // B1.5: brukeren ser ORD, aldri tall (I-12). Buen er visuell intensitet, ikke et tall.
  const label = resonanceLabel(toResonanceLevel(score));
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
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
      <span className="absolute font-semibold text-center leading-tight" style={{ color, fontSize: '12px', width: '70px' }}>
        {label}
      </span>
    </div>
  );
}

/* ------ Hovedkomponent ------ */

export function QuickMatchCard({ score, otherUser, type, highlight }: Props) {
  const name = otherUser?.name || 'Ukjent';
  const age = otherUser?.age;
  const photoUrl = otherUser?.photoUrl;
  const borderColor = highlight ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)';
  const boxShadow = highlight
    ? '0 0 30px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)'
    : '0 8px 40px rgba(0,0,0,0.45), inset 0 0 20px rgba(255,255,255,0.04)';

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_0_20px_rgba(255,255,255,0.04)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(80,120,255,0.15)]"
      style={{ borderColor, boxShadow }}
    >
      {/* Glass refleks */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />

      <div className="relative p-6 space-y-4">
        {/* Header: Profil + score */}
        <div className="flex items-center gap-4">
          <ScoreRing score={score} />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
            {age && (
              <p className="text-sm text-white/60">{age} år</p>
            )}
            {type && (
              <span
                className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(212,175,55,0.15)',
                  color: '#D4AF37',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              >
                {type}
              </span>
            )}
          </div>

          {photoUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0">
              <Image src={photoUrl} alt={name} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Legacy export for backwards compatibility
export const MatchCard = QuickMatchCard;