"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import Skeleton from "@/components/ui/Skeleton";
import { subscribe, emitJourneyUpdated } from "@/lib/journeyEvents";

const { H1, H2, BodyMd, BodySm } = Typography;

/* ------ Data-types ------ */

interface MatchInfo {
  id: string;
  name: string;
  age?: number | null;
  bio?: string | null;
  score?: number | null;
}

interface ConvoInfo {
  partnerName: string;
  lastMessage: string;
  time: string | Date;
  conversationId: string;
}

interface JourneyInfo {
  day: number;
  totalDays: number;
  phase: string;
  tittel: string;
  beskrivelse: string;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
}

interface JourneyData {
  conversationId: string;
  steps: JourneyStep[];
  currentStep: number;
  current: JourneyStep;
  updatedAt: string;
}

type MatchStatusType = "no_match" | "pending" | "matched";

interface DashboardData {
  match: MatchInfo | null;
  conversation: ConvoInfo | null;
  journey: JourneyInfo | null;
}

interface MatchStatusResponse {
  status: MatchStatusType;
  matchId: string | null;
  conversationId: string | null;
  updatedAt: string;
}

interface MatchProfile {
  id: string;
  name: string;
  age?: number | null;
  bio?: string | null;
  imageUrl?: string | null;
  interests?: string[];
}

/* ------ JourneySummary Component ------ */

function JourneySummary({
  journey,
  conversationId,
  onRefresh,
}: {
  journey: JourneyData;
  conversationId: string;
  onRefresh: () => void;
}) {
  const progressPercent = ((journey.currentStep + 1) / journey.steps.length) * 100;

  return (
    <FadeIn>
      <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
        <H2 className="text-xl font-semibold text-gold">Reisa dykkar</H2>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step info */}
        <BodyMd className="text-white/80">
          Steg {journey.currentStep + 1} av {journey.steps.length}: {journey.current.title}
        </BodyMd>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {journey.steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= journey.currentStep ? "bg-gold" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <PremiumButton variant="secondary" onClick={onRefresh}>
            Oppdater
          </PremiumButton>
        </div>

        <PremiumButton
          variant="primary"
          onClick={() => (window.location.href = `/conversation/${conversationId}`)}
        >
          Fortsett reisa
        </PremiumButton>
      </div>
    </FadeIn>
  );
}

/* ------ Skeleton-kort ------ */

function SkeletonCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
      <H2 className="text-white">{title}</H2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ------ Spinner for pending state ------ */

function Spinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

/* ------ Visning ------ */

export default function DashboardView() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Matching state */
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>("no_match");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  /* Match profile state */
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const [matchProfileLoading, setMatchProfileLoading] = useState(false);
  const [matchProfileError, setMatchProfileError] = useState<string | null>(null);

  /* Journey state */
  const [journey, setJourney] = useState<JourneyData | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [journeyError, setJourneyError] = useState<string | null>(null);

  /* Welcome modal state */
  const [showWelcome, setShowWelcome] = useState(false);

  /* Check onboarding status */
  useEffect(() => {
    try {
      const onboarded = localStorage.getItem("tosom_onboarded");
      if (!onboarded) {
        setShowWelcome(true);
      }
    } catch { /* localStorage not available */ }
  }, []);

  /* Fetch dashboard data */
  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard");
        if (!res.ok) {
          if (res.status === 401) throw new Error("Du er ikkje innlogga");
          throw new Error("Kunne ikkje hente data");
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Fetch matching status */
  useEffect(() => {
    let cancelled = false;

    async function fetchMatchingStatus() {
      try {
        const res = await fetch("/api/matching");
        if (!res.ok) return;
        const json: MatchStatusResponse = await res.json();
        if (!cancelled) {
          setMatchStatus(json.status);
          setMatchId(json.matchId);
          setConversationId(json.conversationId);
        }
      } catch {
        // Silently fail — dummy-api
      }
    }

    fetchMatchingStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Fetch match profile when matched */
  useEffect(() => {
    if (matchStatus !== "matched" || !matchId) return;

    let cancelled = false;
    setMatchProfileLoading(true);
    setMatchProfileError(null);

    async function fetchMatchProfile() {
      try {
        const res = await fetch(`/api/profile/${matchId}`);
        if (!res.ok) throw new Error("Kunne ikkje hente match-profil");
        const json: MatchProfile = await res.json();
        if (!cancelled) setMatchProfile(json);
      } catch (err: unknown) {
        if (!cancelled) setMatchProfileError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setMatchProfileLoading(false);
      }
    }

    fetchMatchProfile();

    return () => {
      cancelled = true;
    };
  }, [matchStatus, matchId]);

  /* Fetch journey data */
  useEffect(() => {
    let cancelled = false;

    async function fetchJourney() {
      try {
        setJourneyLoading(true);
        setJourneyError(null);
        if (!conversationId) {
          if (!cancelled) setJourneyLoading(false);
          return;
        }
        const res = await fetch(`/api/journey/${conversationId}`);
        if (!res.ok) throw new Error("Kunne ikkje hente journey");
        const json: JourneyData = await res.json();
        if (!cancelled) setJourney(json);
      } catch (err: unknown) {
        if (!cancelled) setJourneyError(err instanceof Error ? err.message : "Ukjent feil");
      } finally {
        if (!cancelled) setJourneyLoading(false);
      }
    }

    fetchJourney();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  /* Journey polling via event bus */
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      if (conversationId) {
        fetch(`/api/journey/${conversationId}`)
          .then((res) => res.json())
          .then((json: JourneyData) => setJourney(json))
          .catch(() => setJourneyError("Kunne ikkje oppdatere journey"));
      }
    });

    return () => unsubscribe();
  }, [conversationId]);

  /* Trigger matching */
  const handleMatching = async () => {
    setMatchingLoading(true);
    setMatchStatus("pending");
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Kunne ikkje starte matching");
      const json = await res.json();
      setMatchStatus(json.status || "pending");
    } catch {
      setMatchStatus("no_match");
    } finally {
      setMatchingLoading(false);
    }
  };

  /* Loading — skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Section className="space-y-16 py-12">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton width="w-48" height="h-8" rounded="rounded-md" />
            <Skeleton width="w-32" height="h-4" rounded="rounded-md" />
          </div>

          {/* Match skeleton */}
          <SkeletonCard title="Din match">
            <div className="flex items-start gap-4">
              <Skeleton width="w-16" height="h-16" rounded="rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton width="w-32" height="h-5" rounded="rounded-md" />
                <Skeleton width="w-48" height="h-4" rounded="rounded-md" />
              </div>
            </div>
            <Skeleton width="w-24" height="h-12" rounded="rounded-xl" />
          </SkeletonCard>

          {/* Samtale skeleton */}
          <SkeletonCard title="Samtale">
            <div className="space-y-3">
              <Skeleton width="w-24" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-32" height="h-4" rounded="rounded-md" />
            </div>
            <Skeleton width="w-40" height="h-12" rounded="rounded-xl" />
          </SkeletonCard>

          {/* Reise skeleton */}
          <SkeletonCard title="Reisen deres">
            <div className="space-y-3">
              <Skeleton width="w-28" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-40" height="h-6" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
            </div>
            <Skeleton width="w-36" height="h-12" rounded="rounded-xl" />
          </SkeletonCard>
        </Section>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <BodyMd className="text-red-400">{error}</BodyMd>
          <PremiumButton variant="secondary" onClick={() => window.location.reload()}>
            Prøv igjen
          </PremiumButton>
        </div>
      </div>
    );
  }

  /* Ingenting å vise */
  if (!data || (!data.match && !data.conversation && !data.journey)) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <BodyMd className="text-gray-400">Ingen data å vise enno.</BodyMd>
          <PremiumButton variant="primary" onClick={() => router.push("/login")}>
            Kom i gang
          </PremiumButton>
        </div>
      </div>
    );
  }

  /* Dashboard */
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16 py-12">
        {/* Header */}
        <FadeIn>
          <div className="space-y-2">
            <H1 className="text-white">Velkommen tilbake</H1>
            <BodyMd className="text-gray-400">Her er reisen deres</BodyMd>
          </div>
        </FadeIn>

        {/* Matching status */}
        {matchStatus === "no_match" && (
          <FadeIn>
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 text-center">
              <H2 className="text-white">Ingen match enno</H2>
              <BodyMd className="text-gray-400">Trykk under for å starte matching.</BodyMd>
              <PremiumButton
                variant="primary"
                onClick={handleMatching}
                className="mx-auto"
              >
                {matchingLoading ? "Startar…" : "Finn match"}
              </PremiumButton>
            </div>
          </FadeIn>
        )}

        {matchStatus === "pending" && (
          <FadeIn>
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 text-center">
              <H2 className="text-white">Vi finn ein match til deg…</H2>
              <BodyMd className="text-gray-400">Dette kan take litt tid.</BodyMd>
              <Spinner />
            </div>
          </FadeIn>
        )}

        {matchStatus === "matched" && (
          <FadeIn>
            <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              <div className="text-center space-y-4">
                <H2 className="text-white">Du har fått ein match! 🎉</H2>
                <BodyMd className="text-gray-400">Sjekk profilen din for å starte samtalen.</BodyMd>
              </div>

              {/* Match profile loading */}
              {matchProfileLoading && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-800 ring-2 ring-gold/20 animate-pulse" />
                  </div>
                  <div className="space-y-3 text-center">
                    <Skeleton width="w-40" height="h-8" rounded="rounded-md" />
                    <Skeleton width="w-20" height="h-4" rounded="rounded-md" />
                    <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
                    <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
                    <div className="flex justify-center gap-2 pt-4">
                      <Skeleton width="w-20" height="h-8" rounded="rounded-full" />
                      <Skeleton width="w-24" height="h-8" rounded="rounded-full" />
                      <Skeleton width="w-16" height="h-8" rounded="rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Match profile error */}
              {matchProfileError && (
                <div className="bg-white/5 border border-red-400/30 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 text-center space-y-4">
                  <BodyMd className="text-red-400">Kunne ikkje hente match-profil</BodyMd>
                  <PremiumButton
                    variant="secondary"
                    onClick={() => setMatchProfileError(null)}
                    className="mx-auto"
                  >
                    Prøv igjen
                  </PremiumButton>
                </div>
              )}

              {/* Match profile card */}
              {matchProfile && !matchProfileError && (
                <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-800 ring-2 ring-gold/30">
                      {matchProfile.imageUrl ? (
                        <img
                          src={matchProfile.imageUrl}
                          alt={matchProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold text-4xl font-light">
                          {matchProfile.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <H2 className="text-white">{matchProfile.name}</H2>
                      {matchProfile.age && (
                        <BodySm className="text-gold">{matchProfile.age} år</BodySm>
                      )}
                    </div>

                    {matchProfile.bio && (
                      <BodyMd className="text-gray-300 leading-relaxed max-w-md mx-auto">
                        {matchProfile.bio}
                      </BodyMd>
                    )}

                    {matchProfile.interests && matchProfile.interests.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {matchProfile.interests.slice(0, 5).map((interest: string) => (
                          <span
                            key={interest}
                            className="inline-block rounded-full px-3 py-1 bg-gold/10 text-gold border border-gold/20 backdrop-blur-sm text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}

                    <PremiumButton
                      variant="primary"
                      onClick={() => router.push(`/profile/${matchProfile.id}`)}
                      className="mx-auto"
                    >
                      Sjå profil
                    </PremiumButton>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* Din match */}
        {data.match && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Din match</H2>
              <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-gray-800 ring-2 ring-gold/20 flex items-center justify-center text-gray-400 text-lg font-light">
                    {data.match.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">
                      {data.match.name}, {data.match.age}
                    </p>
                    {data.match.bio && (
                      <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                        {data.match.bio}
                      </p>
                    )}
                  </div>
                </div>
                <PremiumButton
                  variant="secondary"
                  onClick={() => { const m = data.match!; router.push(`/profile/${m.id}`); }}
                >
                  Se profil
                </PremiumButton>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Samtale */}
        {data.conversation && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Samtale</H2>
              <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="space-y-2">
                  <p className="text-gold font-medium text-sm">{data.conversation.partnerName}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {data.conversation.lastMessage}
                  </p>
                  <BodySm className="mt-2">
                    {new Date(data.conversation.time as string).toLocaleDateString("nb-NO", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </BodySm>
                </div>
                <PremiumButton
                  variant="primary"
                  onClick={() => { const c = data.conversation!; router.push(`/conversation/${c.conversationId}`); }}
                >
                  Fortsett samtale
                </PremiumButton>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Journey Summary */}
        {journeyLoading ? (
          <FadeIn>
            <div className="bg-white/5 border border-gold/20 rounded-2xl p-6 space-y-4">
              <Skeleton width="w-40" height="h-6" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-2" rounded="rounded-full" />
              <Skeleton width="w-3/4" height="h-4" rounded="rounded-md" />
              <Skeleton width="w-48" height="h-10" rounded="rounded-xl" />
            </div>
          </FadeIn>
        ) : journeyError ? (
          <FadeIn>
            <div className="bg-white/5 border border-red-400/30 rounded-2xl p-6 text-center space-y-4">
              <BodyMd className="text-red-400">{journeyError}</BodyMd>
              <PremiumButton variant="secondary" onClick={() => setJourneyError(null)}>
                Prøv igjen
              </PremiumButton>
            </div>
          </FadeIn>
        ) : journey && conversationId ? (
          <JourneySummary
            journey={journey}
            conversationId={conversationId}
            onRefresh={() => {
              fetch(`/api/journey/${conversationId}`)
                .then((res) => res.json())
                .then((json: JourneyData) => setJourney(json))
                .catch(() => setJourneyError("Kunne ikkje oppdatere journey"));
            }}
          />
        ) : null}

        {/* Reisen deres */}
        {data.journey && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Reisen deres</H2>
              <div className="bg-white/5 border border-gold/20 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6 transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="space-y-2">
                  <BodySm className="text-gold">
                    Dag {data.journey.day} av {data.journey.totalDays}
                  </BodySm>
                  <H2 className="text-white text-2xl font-light">{data.journey.tittel}</H2>
                  <BodyMd className="text-gray-300 leading-relaxed">
                    {data.journey.beskrivelse}
                  </BodyMd>
                </div>
                <PremiumButton
                  variant="primary"
                  onClick={() => router.push("/journey")}
                >
                  Fortsett reisen
                </PremiumButton>
              </div>
            </div>
          </FadeIn>
        )}
      </Section>
    </div>
  );
}