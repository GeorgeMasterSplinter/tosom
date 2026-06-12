"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

const { H1, H2, BodyMd, BodySm } = Typography;

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

export default function ProfileView({ profile }: { profile: ProfileData }) {
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  const alleInteresser = [
    ...(profile.hobbyTags ?? []),
    ...(profile.musicTags ?? []),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16 py-12">
        {/* Header */}
        <FadeIn>
          <div className="space-y-2">
            <H1 className="text-white">Profil</H1>
            <BodyMd className="text-gray-400">Utforsk denne brukaren</BodyMd>
          </div>
        </FadeIn>

        {/* Oversikt */}
        <FadeIn>
          <div className="space-y-6">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-800 ring-1 ring-white/10">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name ?? "Profil"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-light">
                    {(profile.name?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <H2 className="text-white">{profile.name ?? "Ukjent"}</H2>
                {profile.age && (
                  <BodySm className="text-gray-400">{profile.age} år</BodySm>
                )}
                {profile.location && (
                  <BodySm className="text-gray-500">{profile.location}</BodySm>
                )}
              </div>
            </div>

            {/* GlassPanel */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
              <H2 className="text-white">Om meg</H2>
              {profile.bio ? (
                <BodyMd className="text-gray-300 leading-relaxed">
                  {profile.bio}
                </BodyMd>
              ) : (
                <BodyMd className="text-gray-500">Ingen beskrivelse enno.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Interesser */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Interesser</H2>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              {alleInteresser.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {alleInteresser.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full px-3 py-1 bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <BodyMd className="text-gray-500">Ingen interesser lagt inn enno.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Bilder */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Bilder</H2>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              {profile.images && profile.images.length > 1 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.images.slice(1).map((img: { id: string; url: string }) => (
                    <div
                      key={img.id}
                      className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-[4/5]"
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
                <BodyMd className="text-gray-500">Ingen bilder enno.</BodyMd>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Handlingar */}
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
              className="flex-1"
            >
              {hasMatched ? "Matcha" : isMatching ? "Matcher…" : "Match"}
            </PremiumButton>

            <PremiumButton
              variant="secondary"
              className="flex-1"
            >
              Send melding
            </PremiumButton>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
