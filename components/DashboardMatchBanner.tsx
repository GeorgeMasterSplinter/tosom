"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import GlassPanel from "@/components/ui/GlassPanel";
import PremiumButton from "@/components/ui/PremiumButton";
import FadeIn from "@/components/ui/FadeIn";

type MatchData = {
  active: boolean;
  partner: {
    id: string;
    name?: string;
    image?: string;
  };
  conversationId?: string;
};

export default function DashboardMatchBanner({
  data,
}: {
  data: MatchData | null;
}) {
  const router = useRouter();

  if (!data?.active) {
    return (
      <GlassPanel className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-2xl font-semibold text-[var(--color-text)] tracking-tight leading-tight">
          Du har ingen aktive matcher
        </h2>
        <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
          Finn din neste match og start en ny relasjon
        </p>
        <div className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <Link href="/find-match" className="flex-1">
            <PremiumButton variant="primary" className="w-full">Finn match</PremiumButton>
          </Link>
          <Link href="/match/history" className="flex-1">
            <PremiumButton variant="secondary" className="w-full">Se historikk</PremiumButton>
          </Link>
        </div>
      </GlassPanel>
    );
  }

  const { name, image } = data.partner || {};
  const displayName = name || "ukjent";

  return (
    <FadeIn>
      <GlassPanel className="flex flex-col items-center gap-[var(--space-md)] text-center">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-gold)]/40 bg-gradient-to-br from-[var(--color-gold)]/20 to-transparent">
          {image ? (
            <Image
              src={image}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-gold)] text-3xl font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-[var(--space-xs)]">
          <h2 className="text-2xl font-semibold text-[var(--color-text)] tracking-tight leading-tight">
            Du har en ny match med {displayName}!
          </h2>
        </div>

        {/* CTA */}
        <PremiumButton
          variant="primary"
          className="w-full sm:w-auto px-8"
          onClick={() => data.conversationId && router.push(`/chat/${data.conversationId}`)}
        >
          Gå til chat →
        </PremiumButton>
      </GlassPanel>
    </FadeIn>
  );
}