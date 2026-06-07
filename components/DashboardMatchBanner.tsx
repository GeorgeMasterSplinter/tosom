"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

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
      <div className="bg-gradient-to-r from-[#1E2A38] to-[#2A3A4A] border border-[#CBAA7A]/20 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold leading-tight text-white mb-2">
          Du har ingen aktive matcher
        </h2>
        <p className="text-neutral-400 mb-4 leading-relaxed">
          Finn din neste match og start en ny relasjon
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/find-match">
            <Button variant="primary">Finn match</Button>
          </Link>
          <Link href="/match/history">
            <Button variant="secondary">Se historikk</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { name, image } = data.partner || {};
  const displayName = name || "no name";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-[#CBAA7A]/20 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#CBAA7A]/40 bg-[#1A1A1A]/5">
          {image ? (
            <Image
              src={image}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#4A4A4A] text-2xl font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-tight text-[#1A1A1A]">
            Du har en ny match med {displayName}!
          </h2>
        </div>

        {/* CTA */}
        <button
          onClick={() => data.conversationId && router.push(`/chat/${data.conversationId}`)}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#CBAA7A] text-[#1A1A1A] text-sm font-medium leading-relaxed hover:bg-[#CBAA7A]/90 transition border border-[#CBAA7A]"
        >
          Gå til chat
        </button>
      </div>
    </div>
  );
}
