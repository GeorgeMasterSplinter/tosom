/* ═══════════════════════════════════════════
   ToSom Premium — Match Page
   SectionHero + Grid with MatchCard components
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { MatchCard } from "@/components/ui/MatchCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

export default function MatchPage() {
  const [matches] = useState<MatchData[]>(demoMatches);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* SectionHero */}
        <SectionHeader
          badge="Matcher"
          title="Dine potensielle forbindelser"
          subtitle="Basert på resonans, verdier og preferanser"
        />

        {/* Match Grid */}
        {matches.length === 0 ? (
          <Card variant="glass" className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 opacity-20">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">Ingen matcher ennå</p>
            <p className="text-white/20 text-xs mt-1">Fullfør profilen din for å oppdage nye mennesker</p>
            <Button variant="primary" className="mt-6">
              Fullfør profilen
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, i) => (
              <FadeIn key={match.id} duration={300} delay={i * 60}>
                <MatchCard
                  avatar={match.avatar}
                  name={match.name}
                  age={match.age}
                  location={match.location}
                  resonanceScore={match.resonanceScore}
                  onAccept={() => console.log("Accept match:", match.id)}
                  onPass={() => console.log("Pass match:", match.id)}
                  index={i}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}