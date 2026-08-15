import { useEffect, useState } from "react";
import MatchBreakdownItem from "@/components/MatchBreakdownItem";
import MatchBreakdownSkeleton from "@/components/MatchBreakdownSkeleton";
import GlassCard from "@/components/ui/cards/GlassCard";
import FadeIn from "@/components/ui/FadeIn";
import {
  toResonanceLevel,
  resonanceLabel,
} from "@/lib/matching/resonanceLevel";

interface MatchBreakdownResponse {
  totalScore: number;
  breakdown: {
    base: number;
    resonance: number;
    semantic: number;
    intimacy: number;
    future: number;
  };
}

export default function MatchBreakdown({ targetUserId, className = "" }) {
  const [data, setData] = useState<MatchBreakdownResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/match/breakdown?targetUserId=${targetUserId}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch match breakdown");
        }

        setData(result as MatchBreakdownResponse);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching match breakdown:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [targetUserId]);

  if (loading) {
    return <MatchBreakdownSkeleton />;
  }

  if (error || !data) {
    return (
      <GlassCard className={className}>
        <p className="text-[var(--color-muted)]">Kunne ikke laste match-informasjon.</p>
      </GlassCard>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 55) return "text-[var(--color-gold)]";
    return "text-red-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-[var(--color-gold)]";
    return "bg-red-400";
  };

  // B1.5: resonansNIVÅ som ord. scorePct driver kun farge/bue-visning og vises
  // ALDRI som et tall for brukeren (I-12).
  const scorePct = data.totalScore;
  const levelLabel = resonanceLabel(toResonanceLevel(scorePct));

  return (
    <FadeIn>
      <GlassCard className={`flex flex-col gap-[var(--space-md)] ${className}`}>
        <h2 className="text-2xl font-semibold text-[var(--color-text)] tracking-tight">
          Match-beregning
        </h2>

        {/* Resonansnivå — B1.5: brukeren ser ORD, aldri tall (I-12) */}
        <div className="flex flex-col gap-[var(--space-sm)]">
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-muted)]">Resonans</span>
            <span className={`text-2xl font-bold ${getScoreColor(scorePct)}`}>
              {levelLabel}
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getBarColor(scorePct)} transition-all duration-1000 ease-out`}
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="flex flex-col gap-[var(--space-md)]">
          <MatchBreakdownItem label="Base kompatibilitet" value={data.breakdown.base} max={100} />
          <MatchBreakdownItem label="Emosjonell resonans" value={data.breakdown.resonance} max={100} />
          <MatchBreakdownItem label="Semantisk dybde" value={data.breakdown.semantic} max={100} />
          <MatchBreakdownItem label="Intimitet" value={data.breakdown.intimacy} max={100} />
          <MatchBreakdownItem label="Fremtidsønsker" value={data.breakdown.future} max={100} />
        </div>
      </GlassCard>
    </FadeIn>
  );
}