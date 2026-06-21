/**
 * ToSom UI 5.0 — Match
 * 
 * Rom, warm og fokusert match-opplevelse
 * Ein match per 24 timer — ingen swipe, ingen feed
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/ui5/Header';
import { GlassPanel } from '@/components/ui5/GlassPanel';

/* ------ Types ------ */

interface MatchData {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  location?: string;
  resonanceScore?: number;
}

/* Demo data */
const demoMatches: MatchData[] = [
  { id: '1', name: 'Emma', age: 28, location: 'Oslo', resonanceScore: 92 },
  { id: '2', name: 'Sofia', age: 26, location: 'Bergen', resonanceScore: 87 },
  { id: '3', name: 'Astrid', age: 30, location: 'Trondheim', resonanceScore: 84 },
];

/* Resonans bar */
function ResonansBar({ score }: { score: number }) {
  return (
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${score}%`,
          background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
        }}
      />
    </div>
  );
}

/* ------ Main component ------ */

export default function MatchPage() {
  const [matches] = useState<MatchData[]>(demoMatches);

  return (
    <div className="min-h-screen" style={{ background: '#0B0E11' }}>
      <Header currentPath="/match" />

      <main className="mx-auto max-w-[720px] px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="text-xs uppercase tracking-[0.25em] font-semibold mb-4 block"
            style={{ color: '#D4AF37' }}
          >
            Matcher
          </span>
          <h1
            className="text-[32px] lg:text-[40px] font-semibold mb-3"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            Din match
          </h1>
          <p
            className="text-base"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Ein match basert på resonans, verdiar og preferanse
          </p>
        </div>

        {/* No match */}
        {matches.length === 0 ? (
          <GlassPanel className="py-12 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="mx-auto mb-4"
              style={{ color: 'rgba(212, 175, 55, 0.2)' }}
            >
              <path
                d="M14 24C14 18 18 14 24 14C30 14 34 18 34 24C34 30 30 34 24 34"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <p
              className="text-base mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.45)' }}
            >
              Ingen matcher enno
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              Fullfør profilen din for å oppdage nye menneske
            </p>
            <a
              href="/onboarding"
              className="inline-block px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out"
              style={{ background: '#D4AF37', color: '#0B0E11' }}
            >
              Fullfør profilen
            </a>
          </GlassPanel>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <GlassPanel
                key={match.id}
                goldBorder
                className="cursor-pointer"
                onClick={() => console.log('Accept match:', match.id)}
              >
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-medium"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid rgba(212, 175, 55, 0.25)',
                      color: '#D4AF37',
                    }}
                  >
                    {match.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: '#FFFFFF' }}
                    >
                      {match.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {match.age} år · {match.location}
                    </p>
                    {match.resonanceScore && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-xs"
                            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                          >
                            Resonans
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: '#D4AF37' }}
                          >
                            {match.resonanceScore}%
                          </span>
                        </div>
                        <ResonansBar score={match.resonanceScore} />
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ color: '#D4AF37' }}
                  >
                    <path
                      d="M7 4L13 10L7 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}