/* ═══════════════════════════════════════════
   ToSom Premium — ResonanceMeter Component
   Circular progress ring with gold gradient
   UI 4.6: React.memo + reduced-motion + useMemo + GPU
   ═══════════════════════════════════════════ */

"use client";

import React, { useEffect, useState, useMemo } from "react";

interface ResonanceMeterProps {
  score: number; // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { circle: 80, text: "text-xl", stroke: 6 },
  md: { circle: 120, text: "text-3xl", stroke: 8 },
  lg: { circle: 160, text: "text-4xl", stroke: 10 },
};

function ResonanceMeterInner({
  score,
  label = "Resonans",
  size = "md",
  className = "",
}: ResonanceMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const s = sizeMap[size];
  const radius = (s.circle - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

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

  const offset = useMemo(
    () => circumference - (animatedScore / 100) * circumference,
    [circumference, animatedScore]
  );

  const colors = useMemo(() => {
    if (animatedScore >= 80) return { from: "#D4AF37", to: "#E8C766" };
    if (animatedScore >= 50) return { from: "#D4AF37", to: "#C19A2F" };
    return { from: "#C19A2F", to: "#A08020" };
  }, [animatedScore]);

  const gradientId = useMemo(() => `goldGradient-${animatedScore}`, [animatedScore]);

  useEffect(() => {
    setAnimatedScore(0);
    const timer = setTimeout(
      () => setAnimatedScore(Math.min(100, Math.max(0, score))),
      reducedMotion ? 0 : 100
    );
    return () => clearTimeout(timer);
  }, [score, reducedMotion]);

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: s.circle, height: s.circle }}>
        <svg
          width={s.circle}
          height={s.circle}
          viewBox={`0 0 ${s.circle} ${s.circle}`}
          className="-rotate-90"
        >
          <circle
            cx={s.circle / 2}
            cy={s.circle / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={s.stroke}
          />
          <circle
            cx={s.circle / 2}
            cy={s.circle / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={!reducedMotion ? { transition: "stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1)" } : undefined}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold text-white ${s.text}`}>
            {animatedScore}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm text-white/40 font-medium">{label}</span>
      )}
    </div>
  );
}

ResonanceMeterInner.displayName = "ResonanceMeter";

export const ResonanceMeter = React.memo(ResonanceMeterInner);
export default ResonanceMeter;