/* ═══════════════════════════════════════════
   ToSom — Milestone Card
   Viser enkelt relasjons-milepæl
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface Milestone {
  id: string;
  conversationId: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onUnlock?: (milestone: Milestone) => void;
}

export function MilestoneCard({ milestone, onUnlock }: MilestoneCardProps) {
  const [unlocked, setUnlocked] = useState(milestone.unlocked);
  const hasAccess = isFlagEnabled("enableMilestones");

  if (!hasAccess) return null;

  async function unlock() {
    const res = await fetch("/api/relationship/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: milestone.conversationId,
        type: milestone.type,
      }),
    });
    if (res.ok) {
      setUnlocked(true);
      onUnlock?.(milestone);
    }
  }

  return (
    <div
      className="p-4 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: unlocked
          ? "rgba(212, 175, 55, 0.1)"
          : "rgba(255, 255, 255, 0.03)",
        border: `1px solid ${
          unlocked
            ? "rgba(212, 175, 55, 0.3)"
            : "rgba(255, 255, 255, 0.06)"
        }`,
        opacity: unlocked ? 1 : 0.5,
      }}
      onClick={() => !unlocked && unlock()}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{unlocked ? milestone.icon : "🔒"}</span>
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${unlocked ? "text-white" : "text-white/40"}`}>
            {milestone.title}
          </h4>
          <p className={`text-xs ${unlocked ? "text-white/60" : "text-white/30"}`}>
            {milestone.description}
          </p>
          {unlocked && milestone.unlockedAt && (
            <p className="text-xs text-[var(--ts-gold)] mt-1">
              Låst opp {new Date(milestone.unlockedAt).toLocaleDateString("no-NO")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MilestoneCard;