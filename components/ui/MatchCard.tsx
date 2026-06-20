/* ═══════════════════════════════════════════
   ToSom Premium — MatchCard Component
   Glassmorphism match card with hover-lift + gold accent
   ═══════════════════════════════════════════ */

"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { FadeInUp } from "@/components/ui/FadeIn";

interface MatchCardProps {
  avatar?: string;
  name: string;
  age: number;
  location?: string;
  resonanceScore?: number;
  onAccept?: () => void;
  onPass?: () => void;
  index?: number;
}

export const MatchCard = ({
  avatar,
  name,
  age,
  location,
  resonanceScore,
  onAccept,
  onPass,
  index = 0,
}: MatchCardProps) => {
  return (
    <FadeInUp duration={400} delay={index * 80}>
      <Card
        variant="glass"
        className="group relative w-full cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--ts-gold)]/40 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]"
      >
        {/* Avatar + Info */}
        <div className="flex flex-col items-center gap-4 p-6 pb-0">
          <Avatar
            src={avatar}
            size="xl"
            className="border-2 border-white/10 group-hover:border-[var(--ts-gold)]/40 transition-all duration-300"
          />
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">
              {name}
              <span className="ml-1 text-base text-white/60">{age}</span>
            </h3>
            {location && (
              <p className="mt-0.5 text-sm text-white/40">{location}</p>
            )}
          </div>
        </div>

        {/* Resonans Score */}
        {resonanceScore !== undefined && (
          <div className="flex justify-center px-6 pt-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-[var(--ts-gold)]/15 text-[var(--ts-gold)] border border-[var(--ts-gold)]/20"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {resonanceScore}% resonans
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="mx-6 mt-4 h-px bg-white/8" />

        {/* Buttons */}
        <div className="flex gap-2 p-4 pt-3">
          {onAccept && (
            <Button variant="primary" className="flex-1" onClick={onAccept}>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Resonner
            </Button>
          )}
          {onPass && (
            <Button onClick={onPass} className="flex-1">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Pass
            </Button>
          )}
        </div>
      </Card>
    </FadeInUp>
  );
};

export default MatchCard;