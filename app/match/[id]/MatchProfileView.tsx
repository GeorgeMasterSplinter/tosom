/* ═══════════════════════════════════════════
   ToSom Premium — Match Profile View (Redesigned)
   Full match profile page with premium Nordic Gold UI
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/Section";
import { ResonanceMeter } from "@/components/ui/ResonanceMeter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

interface MatchProfile {
  id: string;
  name: string;
  age?: number | null;
  bio?: string | null;
  imageUrl?: string | null;
  interests?: string[];
  resonanceScore?: number;
  location?: string;
}

interface MatchProfileViewProps {
  matchId: string;
}

export default function MatchProfileView({ matchId }: MatchProfileViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return () => { cancelled = true; };
  }, [matchId]);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--ts-gold)]/30 border-t-[var(--ts-gold)] animate-spin" />
          <p className="text-white/30 text-sm">Laster profil...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <svg className="w-16 h-16 mx-auto text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400/80 text-sm">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Prøv igjen
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-white/30 text-sm">Ingen match-profil å vise.</p>
          <Button variant="primary" onClick={() => router.push("/match")}>
            Tilbake til matcher
          </Button>
        </div>
      </div>
    );
  }

  /* Match profile */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* SectionHero */}
        <FadeIn duration={500}>
          <SectionHeader
            badge="Match"
            title="Om denne personen"
            subtitle="Utforsk og finn felles resonans"
          />
        </FadeIn>

        {/* Profile Card */}
        <FadeIn duration={500} delay={100}>
          <Card variant="glass" className="p-8">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--ts-gold)]/40 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--ts-gold)]/10 text-[var(--ts-gold)] text-3xl font-light">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name + Age */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">
                  {profile.name}
                </h2>
                {profile.age && (
                  <p className="text-sm text-[var(--ts-gold)] mt-0.5">{profile.age} år</p>
                )}
                {profile.location && (
                  <p className="text-xs text-white/30 mt-0.5">{profile.location}</p>
                )}
              </div>
            </div>

            {/* ResonanceMeter */}
            {profile.resonanceScore !== undefined && (
              <div className="flex justify-center mb-6">
                <ResonanceMeter
                  score={profile.resonanceScore}
                  label="Resonans med deg"
                  size="md"
                />
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/8 my-6" />

            {/* Om meg */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-2">Om meg</h3>
              {profile.bio ? (
                <p className="text-sm text-white/50 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm text-white/30 italic">Ingen beskrivelse ennå.</p>
              )}
            </div>

            {/* Interesser */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mb-2">
                <h3 className="text-sm font-medium text-white/60 mb-2">Interesser</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--ts-gold)]/10 text-[var(--ts-gold)] border border-[var(--ts-gold)]/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Bilder */}
        <FadeIn duration={500} delay={200}>
          {profile.imageUrl && (
            <Card variant="glass" className="p-6 mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">Bilder</h3>
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/8">
                <img
                  src={profile.imageUrl}
                  alt={`${profile.name} sitt bilde`}
                  className="w-full object-cover"
                />
              </div>
            </Card>
          )}
        </FadeIn>

        {/* Handlinger */}
        <FadeIn duration={500} delay={300}>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => router.push(`/chat?match=${matchId}`)} className="flex-1">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start samtale
            </Button>
            <Button variant="secondary" onClick={() => router.push("/match")} className="flex-1">
              Tilbake
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}