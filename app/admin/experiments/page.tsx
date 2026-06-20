/* ═══════════════════════════════════════════
   ToSom — Admin Experimentation Panel
   Viser feature flags, AI usage, timeline/memory stats
   ═══════════════════════════════════════════ */

"use client";

import { useState, useEffect } from "react";

interface ExperimentData {
  flags: Record<string, boolean>;
  aiUsage: {
    matchInsights: number;
    icebreakers: number;
    profileRewrite: number;
    chatSuggestions: number;
    journeyGuidance: number;
  };
  timelineEvents: number;
  memoriesUploaded: number;
  memoriesByType: Record<string, number>;
  socialGraphInteractions: number;
  digestEmailsSent: number;
  milestonesUnlocked: number;
}

/* ---------------------------------------------------------- */
/*  Flag definitions                                          */
/* ---------------------------------------------------------- */

const FLAGS = [
  "enableAiMatchInsights",
  "enableChatTypingIndicator",
  "enableJourneyV2",
  "enableAdminExperiments",
  "enableRelationshipTimeline",
  "enableSharedMemories",
  "enableMilestones",
  "enableSocialGraph",
  "enableWeeklyDigest",
] as const;

const FLAG_LABELS: Record<string, string> = {
  enableAiMatchInsights: "AI Match Insights",
  enableChatTypingIndicator: "Chat Typing Indicator",
  enableJourneyV2: "Journey V2",
  enableAdminExperiments: "Admin Eksperimenter",
  enableRelationshipTimeline: "Relationship Timeline",
  enableSharedMemories: "Shared Memories",
  enableMilestones: "Milestones",
  enableSocialGraph: "Social Graph",
  enableWeeklyDigest: "Weekly Digest",
};

/* ---------------------------------------------------------- */
/*  Dashboard component                                       */
/* ---------------------------------------------------------- */

export default function ExperimentsDashboard() {
  const [data, setData] = useState<ExperimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/observability/metrics");
      if (res.ok) {
        const metrics = await res.json();
        setData({
          flags: FLAGS.reduce<Record<string, boolean>>((acc, flag) => {
            acc[flag] = true; // Demo — will read from config
            return acc;
          }, {}),
          aiUsage: metrics.aiUsage || {
            matchInsights: 0,
            icebreakers: 0,
            profileRewrite: 0,
            chatSuggestions: 0,
            journeyGuidance: 0,
          },
          timelineEvents: metrics.timelineEvents || 0,
          memoriesUploaded: metrics.memoriesUploaded || 0,
          memoriesByType: metrics.memoriesByType || {},
          socialGraphInteractions: metrics.socialGraphInteractions || 0,
          digestEmailsSent: metrics.digestEmailsSent || 0,
          milestonesUnlocked: metrics.milestonesUnlocked || 0,
        });
      }
    } catch {
      /* Silently fail — show demo data */
      setData(getDemoData());
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-white/40">Laster...</div>;
  if (!data) return <div className="p-6 text-white/40">Ingen data.</div>;

  const activeFlags = FLAGS.filter((f) => data.flags[f]);
  const allFlags = FLAGS.filter((f) => filter === "all" || (!data.flags[f] && filter === "inactive"));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Eksperimenter</h1>
        <button
          onClick={fetchData}
          className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)] transition-colors"
        >
          Oppdater
        </button>
      </div>

      {/* Feature Flags */}
      <div
        className="p-4 rounded-xl"
        style={{ background: "rgba(255, 255, 255, 0.04)" }}
      >
        <h3 className="text-sm font-medium text-white/80 mb-3">Feature Flags</h3>
        <div className="space-y-2">
          {FLAGS.map((flag) => (
            <FlagToggle
              key={flag}
              flag={flag}
              enabled={data.flags[flag]}
              onToggle={() => {
                // Placeholder — will call API to toggle
              }}
            />
          ))}
        </div>
      </div>

      {/* AI Usage */}
      <div
        className="p-4 rounded-xl"
        style={{ background: "rgba(212, 175, 55, 0.08)" }}
      >
        <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3">AI Funksjonsbruk</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(data.aiUsage).map(([key, count]) => (
            <div key={key} className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-lg font-semibold text-white">{count}</div>
              <div className="text-xs text-white/50 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Timeline Events"
          value={data.timelineEvents}
          icon="📅"
        />
        <StatCard
          label="Minner Lastet Opp"
          value={data.memoriesUploaded}
          icon="📸"
        />
        <StatCard
          label="Milestones Låst Opp"
          value={data.milestonesUnlocked}
          icon="🏆"
        />
      </div>

      {/* Social Graph + Digest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl text-center"
          style={{ background: "rgba(255, 255, 255, 0.03)" }}
        >
          <div className="text-2xl font-semibold text-white">{data.socialGraphInteractions}</div>
          <div className="text-xs text-white/50 mt-1">Social Graph Interaksjoner</div>
        </div>
        <div
          className="p-4 rounded-xl text-center"
          style={{ background: "rgba(255, 255, 255, 0.03)" }}
        >
          <div className="text-2xl font-semibold text-white">{data.digestEmailsSent}</div>
          <div className="text-xs text-white/50 mt-1">Digest E-poster Sendt</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  FlagToggle helper                                         */
/* ---------------------------------------------------------- */

function FlagToggle({
  flag,
  enabled,
  onToggle,
}: {
  flag: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: enabled ? "rgba(212, 175, 55, 0.08)" : "rgba(255, 255, 255, 0.02)" }}>
      <span className="text-sm text-white/80">{FLAG_LABELS[flag] || flag}</span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-[var(--ts-gold)]" : "bg-white/20"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  StatCard helper                                           */
/* ---------------------------------------------------------- */

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ background: "rgba(255, 255, 255, 0.04)" }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  Demo data                                                 */
/* ---------------------------------------------------------- */

function getDemoData(): ExperimentData {
  return {
    flags: FLAGS.reduce((acc, flag) => {
      acc[flag] = true;
      return acc;
    }, {} as Record<string, boolean>),
    aiUsage: {
      matchInsights: 234,
      icebreakers: 156,
      profileRewrite: 89,
      chatSuggestions: 312,
      journeyGuidance: 67,
    },
    timelineEvents: 45,
    memoriesUploaded: 78,
    memoriesByType: { image: 52, text: 26 },
    socialGraphInteractions: 234,
    digestEmailsSent: 12,
    milestonesUnlocked: 15,
  };
}
