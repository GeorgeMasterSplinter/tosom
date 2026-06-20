/* ═══════════════════════════════════════════
   ToSom Premium — JourneyCard Component
   Glass card med title, description, CTA
   ═══════════════════════════════════════════ */

"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeIn";

interface JourneyCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  icon?: string;
  className?: string;
}

export const JourneyCard = ({
  title,
  description,
  ctaLabel = "Fortsett",
  ctaOnClick,
  icon,
  className = "",
}: JourneyCardProps) => {
  return (
    <FadeInUp duration={400}>
      <Card
        variant="glass"
        className={`group relative w-full overflow-hidden ${className}`}
      >
        {/* Gold accent top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--ts-gold)]/60 via-[var(--ts-gold)] to-[var(--ts-gold)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start gap-4 p-6">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--ts-gold)]/10 border border-[var(--ts-gold)]/20 flex items-center justify-center text-lg">
              {icon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* CTA */}
        {ctaOnClick && (
          <div className="px-6 pb-6 pt-2">
            <Button variant="primary" onClick={ctaOnClick} className="w-full sm:w-auto">
              {ctaLabel}
            </Button>
          </div>
        )}
      </Card>
    </FadeInUp>
  );
};

export default JourneyCard;