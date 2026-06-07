"use client";

import { useEffect, useState } from "react";

export default function MatchPopup() {
  const [visible, setVisible] = useState(false);
  const [match, setMatch] = useState<any | null>(null);

  async function check() {
    const res = await fetch("/api/match/new-status");
    const data = await res.json();

    if (data.newMatch) {
      setMatch(data);
      setVisible(true);

      // Auto-hide etter 6 sekunder
      setTimeout(() => setVisible(false), 6000);

      // Marker som sett
      fetch("/api/match/mark-seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: data.matchId })
      });
    }
  }

  useEffect(() => {
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible || !match) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white border border-neutral-200 shadow-xl rounded-2xl px-6 py-4 text-center animate-fade-in">
        <div className="text-neutral-900 font-medium text-lg">
          Du har fått en match
        </div>
        <div className="text-neutral-600 text-sm mt-1">
          {match.partner.name}, {match.partner.age}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeInOut 6s ease forwards;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
