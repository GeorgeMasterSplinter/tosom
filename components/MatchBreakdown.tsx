import { useEffect, useState } from "react";
import MatchBreakdownItem from "@/components/MatchBreakdownItem";
import MatchBreakdownSkeleton from "@/components/MatchBreakdownSkeleton";

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
  const [error, setError] = useState(null);

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
        setError(err.message);
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
      <div className={`bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-6 ${className}`}>
        <p className="text-neutral-400">Kunne ikke laste match-informasjon.</p>
      </div>
    );
  }

  const getQualityColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 55) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityBarColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-6 ${className}`}>
      <h2 className="text-xl font-light mb-6 tracking-wide">Match-beregning</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-neutral-300">Total score</span>
          <span className={`text-2xl font-bold ${getQualityColor(data!.totalScore)}`}>
            {data!.totalScore}%
          </span>
        </div>
        
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getQualityBarColor(data!.totalScore)}`}
            style={{ width: `${data!.totalScore}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <MatchBreakdownItem 
          label="Base compatibility" 
          value={data!.breakdown.base} 
          max={100}
        />
        <MatchBreakdownItem 
          label="Emotional resonance" 
          value={data!.breakdown.resonance} 
          max={100}
        />
        <MatchBreakdownItem 
          label="Semantic depth" 
          value={data!.breakdown.semantic} 
          max={100}
        />
        <MatchBreakdownItem 
          label="Intimitet" 
          value={data!.breakdown.intimacy} 
          max={100}
        />
        <MatchBreakdownItem 
          label="Fremtidsønsker" 
          value={data!.breakdown.future} 
          max={100}
        />
      </div>
    </div>
  );
}