/* ═══════════════════════════════════════════
   ToSom — Weekly Digest
   Ukentlig oppsummering av relasjonsfremskritt
   ═══════════════════════════════════════════ */

"use client";

import { useState, useEffect } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface DigestData {
  period: string;
  messageCount: number;
  previousMessageCount: number;
  journeyStepsCompleted: number;
  previousJourneySteps: number;
  memoriesCreated: number;
  previousMemories: number;
  resonanceStart: number;
  resonanceEnd: number;
  newMilestones: Array<{ id: string; title: string }>;
  topTopics: string[];
  suggestedNextStep: { title: string; description: string };
}

interface WeeklyDigestProps {
  conversationId: string;
  variant?: "banner" | "card" | "full";
  onDismiss?: () => void;
}

export function WeeklyDigest({
  conversationId,
  variant = "card",
  onDismiss,
}: WeeklyDigestProps) {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);

  const hasAccess = isFlagEnabled("enableWeeklyDigest");

  useEffect(() => {
    if (!hasAccess) return;
    fetchDigest();
  }, [hasAccess, conversationId]);

  async function fetchDigest() {
    try {
      const res = await fetch(`/api/relationship/digest?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setDigest(data);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess) return null;
  if (loading) return <div className="text-white/40 text-sm py-4">Laster ukeoppsummering...</div>;
  if (!digest) return null;

  if (variant === "banner") {
    return <DigestBanner digest={digest} onDismiss={onDismiss} />;
  }
  if (variant === "full") {
    return <DigestFull digest={digest} />;
  }
  return <DigestCompact digest={digest} />;
}

/* ---------------------------------------------------------- */
/*  DigestBanner (compact header banner)                      */
/* ---------------------------------------------------------- */

function DigestBanner({ digest, onDismiss }: { digest: DigestData; onDismiss?: () => void }) {
  const resonanceChange = digest.resonanceEnd - digest.resonanceStart;

  return (
    <div
      className="p-4 rounded-xl flex items-center justify-between"
      style={{ background: "rgba(212, 175, 55, 0.08)" }}
    >
      <div>
        <p className="text-sm font-medium text-[var(--ts-gold)]">{digest.period}</p>
        <p className="text-xs text-white/60">
          {digest.messageCount} meldinger · {resonanceChange >= 0 ? "+" : ""}
          {resonanceChange} resonans
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white/60 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  DigestCompact (summary card)                              */
/* ---------------------------------------------------------- */

function DigestCompact({ digest }: { digest: DigestData }) {
  const resonanceChange = digest.resonanceEnd - digest.resonanceStart;
  const msgChange = digest.messageCount - digest.previousMessageCount;
  const msgPct = digest.previousMessageCount
    ? Math.round(((digest.messageCount - digest.previousMessageCount) / digest.previousMessageCount) * 100)
    : 0;

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: "rgba(255, 255, 255, 0.04)" }}
    >
      <h4 className="text-sm font-medium text-white mb-3">{digest.period} — Oppsummering</h4>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <MetricTile
          label="Meldinger"
          value={`${digest.messageCount}`}
          change={`${msgChange >= 0 ? "+" : ""}${msgPct}%`}
          positive={msgChange >= 0}
        />
        <MetricTile
          label="Resonans"
          value={`${digest.resonanceEnd}`}
          change={`${resonanceChange >= 0 ? "+" : ""}${resonanceChange}`}
          positive={resonanceChange >= 0}
        />
        <MetricTile
          label="Journey steg"
          value={`${digest.journeyStepsCompleted}`}
          change={`+${digest.journeyStepsCompleted - digest.previousJourneySteps}`}
          positive={true}
        />
        <MetricTile
          label="Minner"
          value={`${digest.memoriesCreated}`}
          change={`+${digest.memoriesCreated - digest.previousMemories}`}
          positive={true}
        />
      </div>

      {digest.newMilestones.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-white/40 mb-1">Nye milepæler:</p>
          <div className="flex flex-wrap gap-1">
            {digest.newMilestones.map((m) => (
              <span
                key={m.id}
                className="px-2 py-1 rounded text-xs"
                style={{ background: "rgba(212, 175, 55, 0.15)" }}
              >
                🏆 {m.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
        <p className="text-xs text-white/40 mb-0.5">Foreslått neste steg:</p>
        <p className="text-sm text-white/80">{digest.suggestedNextStep.title}</p>
        <p className="text-xs text-white/50">{digest.suggestedNextStep.description}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  DigestFull (detailed view)                                */
/* ---------------------------------------------------------- */

function DigestFull({ digest }: { digest: DigestData }) {
  const resonanceChange = digest.resonanceEnd - digest.resonanceStart;
  const msgChange = digest.messageCount - digest.previousMessageCount;
  const msgPct = digest.previousMessageCount
    ? Math.round(((digest.messageCount - digest.previousMessageCount) / digest.previousMessageCount) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <DigestCompact digest={digest} />

      {/* Top Topics */}
      {digest.topTopics.length > 0 && (
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(255, 255, 255, 0.03)" }}
        >
          <p className="text-xs text-white/40 mb-2">Topp emner denne uken:</p>
          <div className="flex flex-wrap gap-2">
            {digest.topTopics.map((topic, i) => (
              <span
                key={topic}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: `rgba(212, 175, 55, ${0.1 + (1 - i / digest.topTopics.length) * 0.2})`,
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Progress toward milestones */}
      <div
        className="p-4 rounded-xl"
        style={{ background: "rgba(255, 255, 255, 0.03)" }}
      >
        <p className="text-xs text-white/40 mb-2">Veien mot neste milepæl:</p>
        <div className="space-y-2">
          <ProgressItem label="1 måned sammen" progress={45} />
          <ProgressItem label="Første felles reise" progress={30} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  MetricTile helper                                         */
/* ---------------------------------------------------------- */

function MetricTile({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="text-center p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.03)" }}>
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
      <p className={`text-xs ${positive ? "text-green-400" : "text-red-400"}`}>{change}</p>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  ProgressItem helper                                       */
/* ---------------------------------------------------------- */

function ProgressItem({ label, progress }: { label: string; progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-0.5">
        <span className="text-white/60">{label}</span>
        <span className="text-white/40">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #D4AF37, #E8C766)",
          }}
        />
      </div>
    </div>
  );
}

export default WeeklyDigest;