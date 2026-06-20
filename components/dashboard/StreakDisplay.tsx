/* ═══════════════════════════════════════════
   ToSom Premium — StreakDisplay Component
   Days streak counter with gold flame icon
   ═══════════════════════════════════════════ */

"use client";

import { Card } from "@/components/ui/Card";
import { FadeInUp } from "@/components/ui/FadeIn";

interface StreakDisplayProps {
  days: number;
  className?: string;
}

export const StreakDisplay = ({ days, className = "" }: StreakDisplayProps) => {
  return (
    <FadeInUp duration={500} delay={100}>
      <Card
        variant="glass"
        className={`group relative overflow-hidden cursor-default ${className}`}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-[var(--ts-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex flex-col items-center gap-3 py-4">
          {/* Flame icon */}
          <div className="relative">
            <svg
              className="w-10 h-10 text-[var(--ts-gold)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c0 0-6 6-6 11 0 4.42 3.58 8 8 8s8-3.58 8-8c0-5-6-11-6-11zm0 18c-3.31 0-6-2.69-6-6 0-2.15 1.53-4.8 4-7.28V18z" />
              <path d="M12 16c-2.21 0-4-1.79-4-4 0-1.5.8-2.8 2-3.5v7.5c.6.3 1.3.5 2 .5s1.4-.2 2-.5v-4c.2-.1.4-.2.5-.4.3.6.5 1.3.5 2 0 2.21-1.79 4-4 4z" />
            </svg>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-[var(--ts-gold)]/30 blur-lg opacity-50" />
          </div>

          {/* Number */}
          <div className="text-center">
            <span className="text-4xl font-bold text-white">{days}</span>
            <p className="text-sm text-white/40 mt-0.5">dagers reise-streak</p>
          </div>
        </div>
      </Card>
    </FadeInUp>
  );
};

export default StreakDisplay;