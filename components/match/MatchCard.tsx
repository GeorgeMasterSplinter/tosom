/**
 * ToSom — DetailMatchCard (full match-visning med breakdown)
 * 
 * Brukes på /match/[id] detaljsider for å vise KOMPLETT match-info:
 * - MatchBreakdown (poengfordeling per kategori)
 * - PremiumButton action
 * - GlassCard layout med full resonans-eksplanasjon
 * 
 * 🔑 Forskjell fra components/MatchCard.tsx:
 * - Den i root (QuickMatchCard) er KORT — kun ScoreRing + navn/alder
 * - Denne her (DetailMatchCard) er FULL — alle breakdown-data og action-knapp
 */

"use client";

import MatchBreakdown from "./MatchBreakdown";
import GlassCard from "@/components/ui/cards/GlassCard";
import PremiumButton from "@/components/ui/system/ToSomButton";

export default function MatchCard({
  name,
  age,
  score,
  explanation,
  blocks,
}: {
  name: string;
  age: number;
  score: number;
  explanation: string;
  blocks: {
    basic: number;
    lifestyle: number;
    interests: number;
    location: number;
    needs: number;
    boundaries: number;
    intentions: number;
  };
}) {
  return (
    <GlassCard className="flex flex-col gap-[var(--space-md)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
          {name}, {age}
        </h3>

        <div className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
          {score} / 100
        </div>
      </div>

      {/* Explanation */}
      <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
        {explanation}
      </p>

      {/* Score highlight */}
      <div className="inline-flex items-center gap-1 text-[var(--color-gold)] font-medium text-sm">
        <span>Matchscore:</span>
        <span className="text-lg font-semibold">{score}%</span>
      </div>

      {/* Breakdown */}
      <MatchBreakdown blocks={blocks} />

      {/* Action */}
      <PremiumButton variant="gold" className="w-full">
        Start samtale →
      </PremiumButton>
    </GlassCard>
  );
}