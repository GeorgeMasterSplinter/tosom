import { useEffect, useState } from "react";
import MatchHistoryItem from "./MatchHistoryItem";
import MatchHistorySkeleton from "./MatchHistorySkeleton";
import MatchHistoryEmpty from "./MatchHistoryEmpty";

export default function MatchHistoryList({ userId, className = "" }) {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/match/history?userId=${userId}`);
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch match history");
        }
        
        setHistory(result);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching match history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [userId]);

  if (loading) {
    return <MatchHistorySkeleton />;
  }

  if (error || !history) {
    return (
      <div className={`bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-6 ${className}`}>
        <p className="text-neutral-400">Kunne ikke laste match-historikk.</p>
      </div>
    );
  }

   if (Array.isArray(history) && (history as any[]).length === 0) {
    return <MatchHistoryEmpty />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {history.map((item) => (
        <MatchHistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}