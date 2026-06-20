/* ═══════════════════════════════════════════
   ToSom Premium — Skeleton Loading Components
   GPU-composited shimmer (opacity only, no layout)
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════ */

"use client";

import React, { useEffect, useState } from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

function SkeletonInner({
  className = "",
  width = "100%",
  height = "16px",
  rounded = "rounded-md",
}: SkeletonProps) {
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
      className={`${reducedMotion ? "" : "animate-shimmer "} ${rounded} ${className}`}
      style={{ width, height, willChange: reducedMotion ? undefined : "opacity" }}
      role="status"
      aria-hidden="true"
    />
  );
}

SkeletonInner.displayName = "Skeleton";

export const Skeleton = React.memo(SkeletonInner);

/* ═══════════════════════════════════════════
   Text skeleton — for heading/body text
   ═══════════════════════════════════════════ */

interface SkeletonTextProps {
  variant?: "sm" | "md" | "lg" | "xl";
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  variant = "md",
  lines = 1,
  className = "",
}) => {
  const heights: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "22px",
  };

  const items = Array.from({ length: lines }, (_, i) => (
    <Skeleton
      key={i}
      width={i === lines - 1 ? "75%" : "100%"}
      height={heights[variant]}
      rounded="rounded-sm"
      className={i === 0 ? className : ""}
    />
  ));

  return <div className="flex flex-col gap-2">{items}</div>;
};

/* ═══════════════════════════════════════════
   Circle skeleton — for avatar placeholders
   ═══════════════════════════════════════════ */

interface SkeletonCircleProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = "md",
  className = "",
}) => {
  const sizes: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "32px",
    md: "40px",
    lg: "48px",
    xl: "64px",
  };

  return (
    <Skeleton
      width={sizes[size]}
      height={sizes[size]}
      rounded="rounded-full"
      className={className}
    />
  );
};

/* ═══════════════════════════════════════════
   Card skeleton — for loading cards
   ═══════════════════════════════════════════ */

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCardInner: React.FC<SkeletonCardProps> = ({ className = "" }) => (
  <div
    className={`animate-shimmer space-y-4 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}
    role="status"
    aria-hidden="true"
  >
    <Skeleton width="48px" height="48px" rounded="rounded-full" />
    <SkeletonText variant="lg" lines={1} />
    <SkeletonText variant="sm" lines={2} />
  </div>
);

SkeletonCardInner.displayName = "SkeletonCard";

export const SkeletonCard = React.memo(SkeletonCardInner);

/* ═══════════════════════════════════════════
   Default export
   ═══════════════════════════════════════════ */

export default Skeleton;