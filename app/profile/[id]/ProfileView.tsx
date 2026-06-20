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
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary">
      <Section className="space-y-2xl py-2xl">
        {/* Header */}
        <div className="flex justify-between items-start gap-2xl">
          <div className="space-y-md">
            <Skeleton width="w-32" height="h-8" rounded="md" />
            <Skeleton width="w-48" height="h-4" rounded="md" />
          </div>
          <Skeleton width="w-32" height="h-10" rounded="xl" />
        </div>

        {/* Profilbilde + info */}
        <div className="space-y-2xl">
          <div className="text-center space-y-2xl">
            <Skeleton width="w-32" height="w-32" rounded="full" className="mx-auto" />
            <div className="space-y-md">
              <Skeleton width="w-40" height="h-8" rounded="md" />
              <Skeleton width="w-20" height="h-4" rounded="md" />
              <Skeleton width="w-24" height="h-4" rounded="md" />
            </div>
          </div>

          {/* Om meg */}
          <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg">
            <Skeleton width="w-24" height="h-6" rounded="md" />
            <Skeleton width="w-full" height="h-4" rounded="md" />
            <Skeleton width="w-3/4" height="h-4" rounded="md" />
          </div>

          {/* Interesser */}
          <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-xl">
            <Skeleton width="w-28" height="h-6" rounded="md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton width="w-20" height="h-8" rounded="full" />
              <Skeleton width="w-24" height="h-8" rounded="full" />
              <Skeleton width="w-16" height="h-8" rounded="full" />
              <Skeleton width="w-22" height="h-8" rounded="full" />
            </div>
          </div>

          {/* Bilder */}
          <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-xl">
            <Skeleton width="w-24" height="h-6" rounded="md" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-lg">
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
              <Skeleton width="w-full" height="h-48" rounded="xl" className="aspect-[4/5]" />
            </div>
          </div>

          {/* Handlinger */}
          <div className="flex gap-lg">
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
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary relative overflow-hidden">
      {/* UI 4.2: calm-gradient-violet subtle bg */}
      <div className="absolute inset-0 calm-gradient-violet opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-ts-bg-primary/60 pointer-events-none" />

      <Section className="space-y-2xl py-2xl relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="flex justify-between items-start gap-2xl">
            <div className="space-y-md">
              <H1 className="text-text-primary">Profil</H1>
              <BodyMd className="text-ts-gold">Utforsk denne brukeren</BodyMd>
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
          <div className="space-y-2xl">
            <div className="text-center space-y-2xl">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-ts-bg-surface ring-2 ring-ts-gold/30 relative">
                <div className="absolute inset-0 gold-glow-md rounded-full" />
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name ?? "Profil"}
                    className="w-full h-full object-cover relative z-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ts-gold text-4xl font-light relative z-10">
                    {(profile.name?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-md">
                <H2 className="text-text-primary">{profile.name ?? "Ukjent"}</H2>
                {profile.age && (
                  <BodySm className="text-ts-gold">{profile.age} år</BodySm>
                )}
                {profile.location && (
                  <BodySm className="text-text-muted">{profile.location}</BodySm>
                )}
              </div>
            </div>

            {/* Om meg — UI 4.2: ts-glass-strong + gold-border on hover */}
            <div className="ts-glass-strong rounded-[var(--ts-radius-xl)] p-xl shadow-lg space-y-lg transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <H2 className="text-text-primary">Om meg</H2>
              {profile.bio ? (
                <BodyMd className="text-text-secondary leading-relaxed">
                  {profile.bio}
                </BodyMd>
              ) : (
                <BodyMd className="text-text-muted">Ingen beskrivelse ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Interesser */}
        <FadeIn>
          <div className="space-y-lg">
            <H2 className="text-text-primary">Interesser</H2>
            <div className="ts-glass-strong rounded-[var(--ts-radius-xl)] p-xl shadow-lg space-y-xl transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              {alleInteresser.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {alleInteresser.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full px-3 py-1 bg-ts-gold-soft text-ts-gold border border-ts-gold/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <BodyMd className="text-text-muted">Ingen interesser lagt inn ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Bilder */}
        <FadeIn>
          <div className="space-y-lg">
            <H2 className="text-text-primary">Bilder</H2>
            <div className="ts-glass-strong rounded-[var(--ts-radius-xl)] p-xl shadow-lg space-y-xl transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              {profile.images && profile.images.length > 1 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-lg">
                  {profile.images.slice(1).map((img: { id: string; url: string }) => (
                    <div
                      key={img.id}
                      className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-[4/5] ring-1 ring-ts-gold/20 transition-all duration-300 hover:scale-[1.02] hover:gold-glow-sm"
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
                <BodyMd className="text-text-muted">Ingen bilder ennå.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Handlinger */}
        <FadeIn>
          <div className="flex gap-lg">
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
              className="flex-1 gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
            >
              {hasMatched ? "Matchet" : isMatching ? "Søker…" : "Match"}
            </PremiumButton>

            <PremiumButton
              variant="secondary"
              className="flex-1 gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
            >
              Send melding
            </PremiumButton>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
