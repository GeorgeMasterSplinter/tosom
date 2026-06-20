"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import Skeleton from "@/components/ui/Skeleton";

const { H1, H2, BodyMd, BodySm } = Typography;

/* ------ Profile skeleton for parent loading state ------ */

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16 py-12">
        {/* Header */}
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-2">
            <Skeleton width="w-32" height="h-8" rounded="md" />
            <Skeleton width="w-48" height="h-4" rounded="md" />
          </div>
          <Skeleton width="w-32" height="h-10" rounded="xl" />
        </div>

        {/* Profilbilde + info */}
        <div className="space-y-6">
          <div className="text-center space-y-6">
            <Skeleton width="w-32" height="w-32" rounded="full" className="mx-auto" />
            <div className="space-y-2">
              <Skeleton width="w-40" height="h-8" rounded="md" />
              <Skeleton width="w-20" height="h-4" rounded="md" />
              <Skeleton width="w-24" height="h-4" rounded="md" />
            </div>
          </div>

          {/* Om meg */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
            <Skeleton width="w-24" height="h-6" rounded="md" />
            <Skeleton width="w-full" height="h-4" rounded="md" />
            <Skeleton width="w-3/4" height="h-4" rounded="md" />
          </div>

          {/* Interesser */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
            <Skeleton width="w-28" height="h-6" rounded="md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton width="w-20" height="h-8" rounded="full" />
              <Skeleton width="w-24" height="h-8" rounded="full" />
              <Skeleton width="w-16" height="h-8" rounded="full" />
              <Skeleton width="w-22" height="h-8" rounded="full" />
            </div>
          </div>

          {/* Bilder */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
            <Skeleton width="w-24" height="h-6" rounded="md" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
            </div>
          </div>

          {/* Handlinger */}
          <div className="flex gap-4">
            <Skeleton width="w-full" height="h-12" rounded="xl" />
            <Skeleton width="w-full" height="h-12" rounded="xl" />
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ------ Data-types ------ */

interface ProfileData {
  id?: string;
  name?: string;
  age?: number | null;
  location?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  hobbyTags?: string[];
  musicTags?: string[];
  images?: Array<{ id: string; url: string }>;
}

/* ------ Visning ------ */

export default function ProfileView({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  const alleInteresser = [
    ...(profile.hobbyTags ?? []),
    ...(profile.musicTags ?? []),
  ];

  const canEdit = profile.id !== undefined;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16 py-12">
        {/* Header */}
        <FadeIn>
          <div className="flex justify-between items-start gap-6">
            <div className="space-y-2">
              <H1 className="text-white">Profil</H1>
              <BodyMd className="text-gold">Utforsk denne brukeren</BodyMd>
            </div>
            {canEdit && (
              <PremiumButton
                variant="secondary"
                onClick={() => router.push(`/profile/edit?id=${profile.id}`)}
              >
                Rediger profil
              </PremiumButton>
            )}
          </div>
        </FadeIn>

        {/* Oversikt */}
        <FadeIn>
          <div className="space-y-6">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-800 ring-2 ring-gold/30">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name ?? "Profil"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-4xl font-light">
                    {(profile.name?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <H2 className="text-white">{profile.name ?? "Ukjent"}</H2>
                {profile.age && (
                  <BodySm className="text-gold">{profile.age} år</BodySm>
                )}
                {profile.location && (
                  <BodySm className="text-gray-500">{profile.location}</BodySm>
                )}
              </div>
            </div>

            {/* GlassPanel: Om meg */}
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 transition-all duration-300 ease-out hover:scale-[1.02]">
              <H2 className="text-white">Om meg</H2>
              {profile.bio ? (
                <BodyMd className="text-gray-300 leading-relaxed">
                  {profile.bio}
                </BodyMd>
              ) : (
                <BodyMd className="text-gray-500">Ingen beskrivelse ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Interesser */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Interesser</H2>
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6 transition-all duration-300 ease-out hover:scale-[1.02]">
              {alleInteresser.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {alleInteresser.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full px-3 py-1 bg-gold/10 text-gold border border-gold/20 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <BodyMd className="text-gray-500">Ingen interesser lagt inn ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Bilder */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Bilder</H2>
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6 transition-all duration-300 ease-out hover:scale-[1.02]">
              {profile.images && profile.images.length > 1 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.images.slice(1).map((img: { id: string; url: string }) => (
                    <div
                      key={img.id}
                      className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-[4/5] ring-1 ring-gold/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <img
                        src={img.url}
                        alt="Profilbilde"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <BodyMd className="text-gray-500">Ingen bilder ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Handlinger */}
        <FadeIn>
          <div className="flex gap-4">
            <PremiumButton
              variant="primary"
              onClick={async () => {
                setIsMatching(true);
                setHasMatched(true);
                try {
                  await fetch("/api/match", {
                    method: "POST",
                    body: JSON.stringify({ targetUserId: profile.id }),
                  });
                } catch {
                  setHasMatched(false);
                }
                setIsMatching(false);
              }}
              className="flex-1 transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              {hasMatched ? "Matchet" : isMatching ? "Søker…" : "Match"}
            </PremiumButton>

            <PremiumButton
              variant="secondary"
              className="flex-1 transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              Send melding
            </PremiumButton>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
