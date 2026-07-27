/* ═══════════════════════════════════════════
   ToSom Premium — DashboardHeader Component
   Welcome section with avatar, greeting, subtitle
   ═══════════════════════════════════════════ */

"use client";

import { Avatar } from "@/components/ui/Avatar";
import { FadeIn } from "@/components/ui/FadeIn";

interface DashboardHeaderProps {
  name: string;
  avatar?: string;
  className?: string;
}

export const DashboardHeader = ({ name, avatar, className = "" }: DashboardHeaderProps) => {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "God morgen";
    if (hour < 17) return "God formiddag";
    if (hour < 21) return "God kveld";
    return "God natt";
  })();

  return (
    <FadeIn duration={500}>
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <Avatar
          src={avatar}
          size="lg"
          className="border-2 border-[var(--ts-gold)]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        />
        <div className="text-center">
          <h2 className="text-title-l font-semibold text-white">
            {greeting}, {name.split(" ")[0]}
          </h2>
          <p className="text-body text-white/40 mt-1">Din relasjon. Dine steg. Ditt fokus.</p>
          <div className="mt-3 w-12 h-0.5 mx-auto rounded-full bg-gradient-to-r from-transparent via-[var(--ts-gold)] to-transparent" />
        </div>
      </div>
    </FadeIn>
  );
};

export default DashboardHeader;