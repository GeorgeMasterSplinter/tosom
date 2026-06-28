"use client";

import { useEffect, useState } from "react";
import GlassPanel from "@/components/ui/panels/GlassPanel";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

export default function MatchPopup() {
  const [visible, setVisible] = useState(false);
  const [match, setMatch] = useState<any | null>(null);

  async function check() {
    const res = await fetch("/api/match/new-status");
    const data = await res.json();

    if (data.newMatch) {
      setMatch(data);
      setVisible(true);

      setTimeout(() => setVisible(false), 6000);

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
      <FadeIn>
        <GlassPanel className="flex flex-col items-center gap-[var(--space-sm)] text-center">
          {/* Celebration icon */}
          <div className="text-3xl">🎉</div>

          <div className="text-[var(--color-text)] font-semibold text-lg tracking-tight">
            Du har fått en match
          </div>

          <div className="text-[var(--color-gold)] font-medium text-sm">
            {match.partner.name}, {match.partner.age}
          </div>

          <PremiumButton variant="primary" className="text-xs px-5 py-2">
            Se match →
          </PremiumButton>
        </GlassPanel>
      </FadeIn>
    </div>
  );
}