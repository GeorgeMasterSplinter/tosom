"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import Skeleton from "@/components/ui/Skeleton";

const { H1, H2, BodyMd, BodySm } = Typography;

/* ------ Data-types ------ */

interface MatchProfile {
  id: string;
  name: string;
  age?: number | null;
  bio?: string | null;
  imageUrl?: string | null;
  interests?: string[];
  images?: Array<{ id: string; url: string }>;
}

/* ------ Props ------ */

interface MatchProfileViewProps {
  matchId: string;
}

/* ------ Visning ------ */

export default function MatchProfileView({ matchId }: MatchProfileViewProps) {
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Fetch match profile */
  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/profile/${matchId}`);
        if (!res.ok) throw new Error("Kunne ikke hente match-profil");
        const json: MatchProfile = await res.json();
        if (!cancelled) setProfile(json);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  /* Loading — skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Section className="space-y-16 py-12">
          <div className="space-y-2">
            <Skeleton width="w-32" height="h-8" rounded="rounded-md" />
            <Skeleton width="w-48" height="h-4" rounded="rounded-md" />
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-6">
              <Skeleton width="w-32" height="w-32" rounded="rounded-full" className="mx-auto" />
              <div className="space-y-2">
                <Skeleton width="w-40" height="h-8" rounded="rounded-md" />
                <Skeleton width="w-20" height="h-4" rounded="rounded-md" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
              <Skeleton width="w-24" height="h-6" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              <Skeleton width="w-28" height="h-6" rounded="rounded-md" />
              <div className="flex flex-wrap gap-2">
                <Skeleton width="w-20" height="h-8" rounded="rounded-full" />
                <Skeleton width="w-24" height="h-8" rounded="rounded-full" />
                <Skeleton width="w-16" height="h-8" rounded="rounded-full" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              <Skeleton width="w-24" height="h-6" rounded="rounded-md" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton width="w-full" height="h-48" rounded="rounded-xl" className="aspect-[4/5]" />
                <Skeleton width="w-full" height="h-48" rounded="rounded-xl" className="aspect-[4/5]" />
                <Skeleton width="w-full" height="h-48" rounded="rounded-xl" className="aspect-[4/5]" />
              </div>
            </div>

            <div className="flex justify-center">
              <Skeleton width="w-48" height="h-12" rounded="rounded-xl" />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <BodyMd className="text-red-400">{error}</BodyMd>
          <PremiumButton variant="secondary" onClick={() => window.location.reload()}>
            Prøv igjen
          </PremiumButton>
        </div>
      </div>
    );
  }

  /* Ingenting å vise */
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <BodyMd className="text-gray-400">Ingen match-profil å vise.</BodyMd>
        </div>
      </div>
    );
  }

  /* Match profil */
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16 py-12">
        {/* Header */}
        <FadeIn>
          <div className="space-y-2">
            <H1 className="text-white">Match-profil</H1>
            <BodyMd className="text-gray-400">Utforsk din match</BodyMd>
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
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-4xl font-light">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <H2 className="text-white">{profile.name}</H2>
                {profile.age && (
                  <BodySm className="text-gold">{profile.age} år</BodySm>
                )}
              </div>
            </div>

            {/* GlassPanel: Om meg */}
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 transition-all duration-300 ease-out hover:scale-[1.02]">
              <H2 className="text-white">Om meg</H2>
              {profile.bio ? (
                <BodyMd className="text-gray-300 leading-relaxed">{profile.bio}</BodyMd>
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
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              {profile.interests && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="inline-block rounded-full px-3 py-1 bg-gold/10 text-gold border border-gold/20 backdrop-blur-sm"
                    >
                      {interest}
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
        {profile.images && profile.images.length > 0 && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Bilder</H2>
              <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.images.map((img: { id: string; url: string }) => (
                    <div
                      key={img.id}
                      className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-[4/5] ring-1 ring-gold/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <img
                        src={img.url}
                        alt="Match-bilde"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Handlinger */}
        <FadeIn>
          <div className="flex justify-center">
            <PremiumButton
              variant="primary"
              className="transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              Start samtale
            </PremiumButton>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
