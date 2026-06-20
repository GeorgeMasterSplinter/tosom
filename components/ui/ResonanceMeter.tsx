/* ═══════════════════════════════════════════
   ToSom Premium — ResonanceMeter Component
   Circular progress ring with gold gradient
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";

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

export const ResonanceMeter = ({
  score,
  label = "Resonans",
  size = "md",
  className = "",
}: ResonanceMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const s = sizeMap[size];
  const radius = (s.circle - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(Math.min(100, Math.max(0, score))), 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Color based on score
  const getColor = (s: number) => {
    if (s >= 80) return { from: "#D4AF37", to: "#E8C766" }; // Gold
    if (s >= 50) return { from: "#D4AF37", to: "#C19A2F" }; // Mid gold
    return { from: "#C19A2F", to: "#A08020" }; // Darker gold
  };

  const colors = getColor(animatedScore);

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      {/* SVG Circular Progress */}
      <div className="relative" style={{ width: s.circle, height: s.circle }}>
        <svg
          width={s.circle}
          height={s.circle}
          viewBox={`0 0 ${s.circle} ${s.circle}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={s.circle / 2}
            cy={s.circle / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={s.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={s.circle / 2}
            cy={s.circle / 2}
            r={radius}
            fill="none"
            stroke={`url(#goldGradient-${animatedScore})`}
            strokeWidth={s.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-[600ms] ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id={`goldGradient-${animatedScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold text-white ${s.text}`}>
            {animatedScore}%
          </span>
        </div>
      </div>
      {/* Label */}
      {label && (
        <span className="text-sm text-white/40 font-medium">{label}</span>
      )}
    </div>
  );
};

export default ResonanceMeter;