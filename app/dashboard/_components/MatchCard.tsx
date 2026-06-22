/**
 * ToSom — Dashboard MatchCard
 * 
 * Viser éin aktiv match med resonans og sterke område.
 */

import Link from 'next/link';

interface MatchCardProps {
  match: {
    id: string;
    otherUserId: string;
    otherUserName: string | null;
    otherUserPhotoUrl: string | null;
    score: number;
    resonanceLevel: string;
    explanation: {
      _scores?: Record<string, number>;
      strengths?: string[];
      summary?: string;
    } | null;
    createdAt: string;
    matchType: string;
  };
}

const resonanceLabels: Record<string, string> = {
  GENTLE: 'Rolig resonans',
  MODERATE: 'Moderat resonans',
  STRONG: 'Sterk resonans',
  DEEP: 'Djup resonans',
};

export function MatchCard({ match }: MatchCardProps) {
  const name = match.otherUserName || 'Ukjent';
  const initial = name.charAt(0).toUpperCase();
  const strengths = match.explanation?.strengths ?? [];
  const resonanceLabel = resonanceLabels[match.resonanceLevel] || match.resonanceLevel;

  // Format score som prosent
  const scorePercent = Math.min(Math.round((match.score / 100) * 100), 99);

  return (
    <Link href={`/matching/${match.id}`} className="block animate-[slideIn_0.3s_ease-out]">
      <div
        className="p-5 rounded-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.06)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Header: Avatar + Navn + Score */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: '#D4AF37',
            }}
          >
            {initial}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-base truncate" style={{ color: '#FFFFFF' }}>
              {name}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              {resonanceLabel}
            </p>
          </div>

          {/* Score */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
            style={{
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#D4AF37',
            }}
          >
            {scorePercent}%
          </div>
        </div>

        {/* Strong areas */}
        {strengths.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {strengths.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  color: 'rgba(212, 175, 55, 0.8)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          <div
            className="text-center py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              color: '#D4AF37',
            }}
          >
            Se match
          </div>
        </div>
      </div>
    </Link>
  );
}