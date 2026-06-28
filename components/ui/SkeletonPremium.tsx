// ⚠️  EXPERIMENTAL — Premium feature not yet launched. Do not use in production.
// TODO: Flytt til egen branch eller fjern. Eksperimentell kode — Fase 1 marking.
/* ═══════════════════════════════════════════
// TODO: Flytte til egen branch eller fjerne. Eksperimentell kode — Fase 1 marking.
   ToSom Premium — Skeleton Components
   GPU-composited shimmer (opacity only)
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════ */

"use client";

import React, { useEffect, useState } from "react";

/* ── Base Skeleton ── */

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

function SkeletonInner({ className = "", shimmer = true }: SkeletonProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent | any) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    if (!mq.addEventListener) mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.("change", handler);
      mq.removeListener?.(handler);
    };
  }, []);

  return (
    <div
      className={`skeleton ${!reducedMotion && shimmer ? "animate-shimmer" : ""} ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Laster innhold"
      style={{ background: "rgba(255,255,255,0.04)", borderRadius: "inherit", willChange: !reducedMotion && shimmer ? "opacity" : undefined }}
    />
  );
}

SkeletonInner.displayName = "Skeleton";

export const Skeleton = React.memo(SkeletonInner);

/* ── DashboardHeader Skeleton ── */

export const DashboardHeaderSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-4 animate-shimmer">
    <div
      className="w-16 h-16 rounded-full bg-white/[0.04] overflow-hidden"
      style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
      role="status"
      aria-label="Avatar"
    />
    <div className="flex flex-col items-center gap-2">
      <div className="h-6 w-40 rounded-md bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div className="h-4 w-32 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 80ms" }} />
    </div>
  </div>
);

/* ── MatchCard Skeleton ── */

export const MatchCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 animate-shimmer">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-xl bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div className="flex-1 flex flex-col gap-3">
        <div className="h-5 w-32 rounded bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
        <div className="h-4 w-48 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 150ms" }} />
        <div className="h-4 w-full rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 200ms" }} />
      </div>
    </div>
    <div className="mt-4 h-10 w-32 rounded-xl bg-white/[0.04] ml-auto" style={{ animation: "shimmer 1.5s ease-in-out infinite 300ms" }} />
  </div>
);

/* ── ChatList Skeleton ── */

export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3 animate-shimmer">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex items-center gap-4" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 100}ms` }}>
        <div className="w-12 h-12 rounded-full bg-white/[0.04] flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-24 rounded bg-white/[0.04]" />
          <div className="h-3 w-48 rounded bg-white/[0.03]" />
        </div>
        <div className="h-3 w-12 rounded bg-white/[0.03]" />
      </div>
    ))}
  </div>
);

/* ── ChatWindow Skeleton ── */

export const ChatWindowSkeleton: React.FC = () => (
  <div className="glass-card p-6 flex flex-col gap-4 animate-shimmer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-28 rounded bg-white/[0.04]" />
        <div className="h-3 w-20 rounded bg-white/[0.03]" />
      </div>
    </div>
    <div className="flex flex-col gap-3 flex-1">
      <div className="self-start max-w-xs">
        <div className="h-4 w-full rounded-lg bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
        <div className="h-4 w-3/4 rounded-lg bg-white/[0.03] mt-1" style={{ animation: "shimmer 1.5s ease-in-out infinite 150ms" }} />
      </div>
      <div className="self-end max-w-xs">
        <div className="h-4 w-full rounded-lg bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 200ms" }} />
        <div className="h-4 w-2/3 rounded-lg bg-white/[0.03] mt-1" style={{ animation: "shimmer 1.5s ease-in-out infinite 250ms" }} />
      </div>
    </div>
    <div className="h-12 rounded-xl bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 300ms" }} />
  </div>
);

/* ── JourneyCard Skeleton ── */

export const JourneyCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 animate-shimmer">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex-shrink-0" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-5 w-40 rounded bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
        <div className="h-4 w-full rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 150ms" }} />
        <div className="h-4 w-3/4 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 200ms" }} />
      </div>
    </div>
    <div className="mt-4 h-10 w-36 rounded-xl bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 300ms" }} />
  </div>
);

/* ── StreakDisplay Skeleton ── */

export const StreakDisplaySkeleton: React.FC = () => (
  <div className="glass-card p-6 flex flex-col items-center gap-3 animate-shimmer">
    <div className="w-10 h-10 rounded-full bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
    <div className="flex flex-col items-center gap-1">
      <div className="h-8 w-16 rounded bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
      <div className="h-4 w-32 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 150ms" }} />
    </div>
  </div>
);

/* ── QuickActionGrid Skeleton ── */

export const QuickActionGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-shimmer">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex flex-col items-center gap-3" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 80}ms` }}>
        <div className="w-6 h-6 rounded bg-white/[0.04]" />
        <div className="h-4 w-16 rounded bg-white/[0.03]" />
      </div>
    ))}
  </div>
);

/* ── NotificationFeed Skeleton ── */

export const NotificationFeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="glass-card p-6 animate-shimmer">
    <div className="h-4 w-20 rounded bg-white/[0.04] mb-4" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 100}ms` }}>
          <div className="w-4 h-4 rounded bg-white/[0.04] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-2/3 rounded bg-white/[0.03]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── ResonanceMeter Skeleton ── */

export const ResonanceMeterSkeleton: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeMap = { sm: "w-20 h-20", md: "w-28 h-28", lg: "w-36 h-36" };
  return (
    <div className="flex flex-col items-center gap-2 animate-shimmer">
      <div className={`${sizeMap[size]} rounded-full bg-white/[0.04]`} style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      <div className="h-4 w-20 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
    </div>
  );
};

/* ── JourneyMap Skeleton ── */

export const JourneyMapSkeleton: React.FC<{ steps?: number }> = ({ steps = 5 }) => (
  <div className="glass-card p-6 animate-shimmer">
    <div className="h-4 w-20 rounded bg-white/[0.04] mb-4" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
    <div className="space-y-4">
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="flex items-center gap-3" style={{ animation: `shimmer 1.5s ease-in-out infinite ${i * 80}ms` }}>
          <div className="w-8 h-8 rounded-full bg-white/[0.04] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-4 w-32 rounded bg-white/[0.04]" />
            <div className="h-3 w-48 rounded bg-white/[0.03]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Export as default ── */

export const SkeletonCard: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="glass-card p-6 animate-shimmer">
    {title && (
      <div className="h-5 w-32 rounded bg-white/[0.04] mb-4" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
    )}
    {children || (
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-white/[0.04]" style={{ animation: "shimmer 1.5s ease-in-out infinite 100ms" }} />
        <div className="h-4 w-3/4 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 150ms" }} />
        <div className="h-4 w-1/2 rounded bg-white/[0.03]" style={{ animation: "shimmer 1.5s ease-in-out infinite 200ms" }} />
      </div>
    )}
  </div>
);// ⚠️  EXPERIMENTAL — Premium feature not yet launched. Do not use in production.
