"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
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
      <Card className="gap-[var(--space-md)]">
           <H2 className="text-[var(--color-gold)] text-xl font-semibold">Din reise</H2>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-[var(--radius-full)] overflow-hidden bg-[var(--color-card)]">
          <div
            className="h-full bg-[var(--color-gold)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step info */}
        <BodyMd className="text-[var(--color-text)]/80">
           Steg {journey.currentStep + 1} av {journey.steps.length}: {journey.current.title}
        </BodyMd>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {journey.steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-[var(--radius-full)] ${
                  i <= journey.currentStep ? "bg-[var(--color-gold)]" : "bg-[var(--color-card)]"
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
          Fortsett reisen
        </PremiumButton>
      </Card>
    </FadeIn>
  );
}

/* ------ Skeleton-kort ------ */

function SkeletonCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-[var(--space-lg)]">
      <H2 className="text-[var(--color-text)]">{title}</H2>
      <div className="gap-[var(--space-sm)]">{children}</div>
    </Card>
  );
}

/* ------ Spinner for pending state ------ */

function Spinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div
        className="w-8 h-8 border-2 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-[var(--radius-full)] animate-spin"
        style={{ borderRightColor: "transparent" }}
      />
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
          if (res.status === 401) throw new Error("Du er ikke logget inn");
          throw new Error("Kunne ikke hente data");
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
        if (!res.ok) throw new Error("Kunne ikke hente match-profil");
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
        if (!res.ok) throw new Error("Kunne ikke hente journey");
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
          .catch(() => setJourneyError("Kunne ikke oppdatere journey"));
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
      if (!res.ok) throw new Error("Kunne ikke starte matching");
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
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Section className="gap-[var(--space-xl)] py-[var(--space-xl)]">
          {/* Header */}
          <div className="gap-[var(--space-xs)]">
            <Skeleton width="w-48" height="h-8" rounded="md" />
            <Skeleton width="w-32" height="h-4" rounded="md" />
          </div>

          {/* Match skeleton */}
          <SkeletonCard title="Din match">
            <div className="flex items-start gap-4">
              <Skeleton width="w-16" height="h-16" rounded="xl" />
              <div className="flex-1 gap-[var(--space-sm)]">
                <Skeleton width="w-32" height="h-5" rounded="md" />
                <Skeleton width="w-48" height="h-4" rounded="md" />
              </div>
            </div>
            <Skeleton width="w-24" height="h-12" rounded="xl" />
          </SkeletonCard>

          {/* Samtale skeleton */}
          <SkeletonCard title="Samtale">
            <div className="gap-[var(--space-sm)]">
              <Skeleton width="w-24" height="h-4" rounded="md" />
              <Skeleton width="w-full" height="h-4" rounded="md" />
              <Skeleton width="w-32" height="h-4" rounded="md" />
            </div>
            <Skeleton width="w-40" height="h-12" rounded="xl" />
          </SkeletonCard>

          {/* Reise skeleton */}
          <SkeletonCard title="Reisen deres">
            <div className="gap-[var(--space-sm)]">
              <Skeleton width="w-28" height="h-4" rounded="md" />
              <Skeleton width="w-40" height="h-6" rounded="md" />
              <Skeleton width="w-full" height="h-4" rounded="md" />
              <Skeleton width="w-3/4" height="h-4" rounded="md" />
            </div>
            <Skeleton width="w-36" height="h-12" rounded="xl" />
          </SkeletonCard>
        </Section>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
        <div className="text-center gap-[var(--space-sm)]">
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
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
        <div className="text-center gap-[var(--space-sm)]">
          <BodyMd className="text-[var(--color-muted)]">Ingen data tilgjengelig ennå.</BodyMd>
          <PremiumButton variant="primary" onClick={() => router.push("/login")}>
            Kom i gang
          </PremiumButton>
        </div>
      </div>
    );
  }

  /* Dashboard */
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Section className="gap-[var(--space-xl)] py-[var(--space-xl)]">
        {/* Header */}
        <FadeIn>
          <div className="gap-[var(--space-xs)]">
            <H1 className="text-[var(--color-text)]">Velkommen tilbake</H1>
            <BodyMd className="text-[var(--color-muted)]">Her er reisen din</BodyMd>
          </div>
        </FadeIn>

        {/* Matching status */}
        {matchStatus === "no_match" && (
          <FadeIn>
            <Card className="gap-[var(--space-sm)] text-center">
               <H2 className="text-[var(--color-text)]">Ingen match ennå</H2>
              <BodyMd className="text-[var(--color-muted)]">Trykk under for å starte matching.</BodyMd>
              <PremiumButton
                variant="primary"
                onClick={handleMatching}
                className="mx-auto"
              >
                {matchingLoading ? "Søker…" : "Finn match"}
              </PremiumButton>
            </Card>
          </FadeIn>
        )}

        {matchStatus === "pending" && (
          <FadeIn>
            <Card className="gap-[var(--space-sm)] text-center">
               <H2 className="text-[var(--color-text)]">Vi finner en match til deg…</H2>
               <BodyMd className="text-[var(--color-muted)]">Dette kan ta litt tid.</BodyMd>
              <Spinner />
            </Card>
          </FadeIn>
        )}

        {matchStatus === "matched" && (
          <FadeIn>
            <Card className="gap-[var(--space-md)]">
              <div className="text-center gap-[var(--space-sm)]">
                <H2 className="text-[var(--color-text)]">Du har fått en match! 🎉</H2>
                <BodyMd className="text-[var(--color-muted)]">Se på profilen for å starte samtalen.</BodyMd>
              </div>

              {/* Match profile loading */}
              {matchProfileLoading && (
                <Card className="gap-[var(--space-sm)]">
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 rounded-[var(--radius-full)] bg-[var(--color-card)] ring-2 ring-[var(--color-gold)]/20 animate-pulse" />
                  </div>
                  <div className="gap-[var(--space-xs)] text-center">
                    <Skeleton width="w-40" height="h-8" rounded="md" />
                    <Skeleton width="w-20" height="h-4" rounded="md" />
                    <Skeleton width="w-3/4" height="h-4" rounded="md" />
                    <Skeleton width="w-3/4" height="h-4" rounded="md" />
                    <div className="flex justify-center gap-2 pt-4">
                      <Skeleton width="w-20" height="h-8" rounded="full" />
                      <Skeleton width="w-24" height="h-8" rounded="full" />
                      <Skeleton width="w-16" height="h-8" rounded="full" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Match profile error */}
              {matchProfileError && (
                <Card className="gap-[var(--space-sm)] text-center">
                   <BodyMd className="text-red-400">Kunne ikke hente match-profil</BodyMd>
                  <PremiumButton
                    variant="secondary"
                    onClick={() => setMatchProfileError(null)}
                    className="mx-auto"
                  >
                    Prøv igjen
                  </PremiumButton>
                </Card>
              )}

              {/* Match profile card */}
              {matchProfile && !matchProfileError && (
                <Card className="gap-[var(--space-md)]">
                  <div className="text-center gap-[var(--space-sm)]">
                    <div className="w-32 h-32 mx-auto rounded-[var(--radius-full)] overflow-hidden bg-[var(--color-card)] ring-2 ring-[var(--color-gold)]/30">
                      {matchProfile.imageUrl ? (
                        <img
                          src={matchProfile.imageUrl}
                          alt={matchProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-gold)] text-4xl font-light">
                          {matchProfile.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="gap-[var(--space-xs)]">
                      <H2 className="text-[var(--color-text)]">{matchProfile.name}</H2>
                      {matchProfile.age && (
                        <BodySm className="text-[var(--color-gold)]">{matchProfile.age} år</BodySm>
                      )}
                    </div>

                    {matchProfile.bio && (
                      <BodyMd className="text-[var(--color-text)] leading-relaxed max-w-md mx-auto">
                        {matchProfile.bio}
                      </BodyMd>
                    )}

                    {matchProfile.interests && matchProfile.interests.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {matchProfile.interests.slice(0, 5).map((interest: string) => (
                          <span
                            key={interest}
                            className="inline-block rounded-[var(--radius-full)] px-3 py-1 bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20 backdrop-blur-sm text-sm"
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
                      Se profil
                    </PremiumButton>
                  </div>
                </Card>
              )}
            </Card>
          </FadeIn>
        )}

        {/* Din match */}
        {data.match && (
          <FadeIn>
            <div className="gap-[var(--space-sm)]">
              <H2 className="text-[var(--color-text)]">Din match</H2>
              <Card className="gap-[var(--space-sm)] transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-[var(--radius-lg)] bg-[var(--color-card)] ring-2 ring-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-muted)] text-lg font-light">
                    {data.match.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--color-text)] font-medium">
                      {data.match.name}, {data.match.age}
                    </p>
                    {data.match.bio && (
                      <p className="text-[var(--color-muted)] text-sm mt-1 leading-relaxed">
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
              </Card>
            </div>
          </FadeIn>
        )}

        {/* Samtale */}
        {data.conversation && (
          <FadeIn>
            <div className="gap-[var(--space-sm)]">
              <H2 className="text-[var(--color-text)]">Samtale</H2>
              <Card className="gap-[var(--space-sm)] transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="gap-[var(--space-xs)]">
                  <p className="text-[var(--color-gold)] font-medium text-sm">{data.conversation.partnerName}</p>
                  <p className="text-[var(--color-text)] text-sm leading-relaxed">
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
              </Card>
            </div>
          </FadeIn>
        )}

        {/* Journey Summary */}
        {journeyLoading ? (
          <FadeIn>
            <Card className="gap-[var(--space-sm)]">
              <Skeleton width="w-40" height="h-6" rounded="md" />
              <Skeleton width="w-full" height="h-2" rounded="full" />
              <Skeleton width="w-3/4" height="h-4" rounded="md" />
              <Skeleton width="w-48" height="h-10" rounded="xl" />
            </Card>
          </FadeIn>
        ) : journeyError ? (
          <FadeIn>
            <Card className="gap-[var(--space-sm)] text-center">
              <BodyMd className="text-red-400">{journeyError}</BodyMd>
              <PremiumButton variant="secondary" onClick={() => setJourneyError(null)}>
                Prøv igjen
              </PremiumButton>
            </Card>
          </FadeIn>
        ) : journey && conversationId ? (
          <JourneySummary
            journey={journey}
            conversationId={conversationId}
            onRefresh={() => {
              fetch(`/api/journey/${conversationId}`)
                .then((res) => res.json())
                .then((json: JourneyData) => setJourney(json))
                .catch(() => setJourneyError("Kunne ikke oppdatere journey"));
            }}
          />
        ) : null}

        {/* Reisen deres */}
        {data.journey && (
          <FadeIn>
            <div className="gap-[var(--space-sm)]">
               <H2 className="text-[var(--color-text)]">Reisen din</H2>
              <Card className="gap-[var(--space-md)] transition-all duration-300 ease-out hover:scale-[1.02]">
                <div className="gap-[var(--space-xs)]">
                  <BodySm className="text-[var(--color-gold)]">
                    Dag {data.journey.day} av {data.journey.totalDays}
                  </BodySm>
                  <H2 className="text-[var(--color-text)] text-2xl font-light">{data.journey.tittel}</H2>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    {data.journey.beskrivelse}
                  </BodyMd>
                </div>
                <PremiumButton
                  variant="primary"
                  onClick={() => router.push("/journey")}
                >
                  Fortsett reisen
                </PremiumButton>
              </Card>
            </div>
          </FadeIn>
        )}
      </Section>
    </div>
  );
}
