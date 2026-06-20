/* ═══════════════════════════════════════════
   ToSom Premium — Match Page (UI 4.2)
   Calm-gradient-rose bg · Focus-mode match cards
   Gold-glow names · Resonans-indicator bars
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

interface MatchData {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  location?: string;
  resonanceScore?: number;
}

// Demo data — kan erstattes med API-kall
const demoMatches: MatchData[] = [
  { id: "1", name: "Emma", age: 28, location: "Oslo", resonanceScore: 92 },
  { id: "2", name: "Sofia", age: 26, location: "Bergen", resonanceScore: 87 },
  { id: "3", name: "Astrid", age: 30, location: "Trondheim", resonanceScore: 84 },
  { id: "4", name: "Ingrid", age: 27, location: "Stavanger", resonanceScore: 79 },
  { id: "5", name: "Freya", age: 29, location: "Tromsø", resonanceScore: 75 },
  { id: "6", name: "Line", age: 25, location: "Oslo", resonanceScore: 71 },
];

/* Resonans bar component */
function ResonansBar({ score }: { score: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-ts-bg-surface/60 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-ts-gold to-ts-gold-light transition-all duration-1000"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export default function MatchPage() {
  const [matches] = useState<MatchData[]>(demoMatches);

  return (
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary relative overflow-hidden">
      {/* UI 4.2: calm-gradient-rose subtle bg */}
      <div className="absolute inset-0 calm-gradient-rose opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-ts-bg-primary/60 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-section py-section relative z-10">
        {/* SectionHero — UI 4.2: display-xl + gold-glow-text */}
        <div className="text-center space-y-lg mb-4xl">
          <FadeIn>
            <span className="text-ts-gold uppercase tracking-[0.25em] text-xs font-semibold">
              Matcher
            </span>
          </FadeIn>
          <FadeIn>
            <h1 className="ts-display-xl text-gold-glow-text">
              Dine potensielle forbindelser
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="text-text-muted max-w-xl mx-auto">
              Basert på resonans, verdier og preferanser
            </p>
          </FadeIn>
        </div>

        {/* Match Grid — UI 4.2: focus-mode · 2 cols · ts-glass-strong cards */}
        {matches.length === 0 ? (
          <FadeIn>
            <div className="ts-glass-strong rounded-[var(--ts-radius-3xl)] p-2xl flex flex-col items-center justify-center text-center space-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-ts-gold-soft opacity-20 pointer-events-none" />
              <div className="relative z-10 space-lg text-center">
                <svg className="w-16 h-16 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-text-subtle text-sm mt-4">Ingen matcher ennå</p>
                <p className="text-text-subtle/70 text-xs mt-2">Fullfør profilen din for å oppdage nye mennesker</p>
                <button
                  className="mt-6 inline-flex items-center justify-center rounded-[var(--ts-radius-md)] bg-ts-gold text-ts-bg-primary font-medium px-lg py-md hover:bg-ts-gold-light transition-all duration-[var(--ts-transition-fast)]"
                >
                  Fullfør profilen
                </button>
              </div>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2xl">
            {matches.map((match, i) => (
              <FadeIn key={match.id} duration={300} delay={i * 80}>
                {/* Match card — UI 4.2: calm-gradient-rose + gold name + resonance */}
                <div
                  className="ts-glass-strong rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-lg transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm cursor-pointer group relative overflow-hidden"
                  onClick={() => console.log("Accept match:", match.id)}
                >
                  {/* Subtle rose gradient bg */}
                  <div className="absolute inset-0 calm-gradient-rose opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-[var(--ts-transition-normal)]" />

                  <div className="relative z-10 space-lg">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-lg">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-ts-bg-surface ring-2 ring-ts-gold/20 relative flex-shrink-0">
                        <div className="absolute inset-0 gold-gold-sm rounded-full" />
                        {match.avatar ? (
                          <img src={match.avatar} alt={match.name} className="w-full h-full object-cover relative z-10" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ts-gold text-2xl font-light relative z-10">
                            {match.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-xs">
                        <h3 className="ts-font-heading-m text-text-primary group-hover:text-ts-gold transition-colors duration-[var(--ts-transition-fast)]">
                          {match.name}
                        </h3>
                        <p className="text-text-muted text-sm">{match.age} år</p>
                      </div>
                    </div>

                    {/* Location */}
                    {match.location && (
                      <p className="text-text-muted text-sm flex items-center gap-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {match.location}
                      </p>
                    )}

                    {/* Resonans-indikator */}
                    {match.resonanceScore && (
                      <div className="space-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-subtle">Resonans</span>
                          <span className="text-ts-gold font-medium">{match.resonanceScore}%</span>
                        </div>
                        <ResonansBar score={match.resonanceScore} />
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-sm">
                      <span className="text-ts-gold/60 group-hover:text-ts-gold text-sm font-medium transition-colors duration-[var(--ts-transition-fast)]">
                        Start reisen →
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
