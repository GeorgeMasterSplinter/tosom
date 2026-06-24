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
          throw new Error("Vi gir oss ikke – vi leter videre.");
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Kan du prøve igjen?");
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
        if (!res.ok) throw new Error("Vi gir oss ikke – vi leter videre.");
        const json: MatchProfile = await res.json();
        if (!cancelled) setMatchProfile(json);
      } catch (err: unknown) {
        if (!cancelled) setMatchProfileError(err instanceof Error ? err.message : "Kan du prøve igjen?");
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
        if (!res.ok) throw new Error("Vi gir oss ikke – vi leter videre.");
        const json: JourneyData = await res.json();
        if (!cancelled) setJourney(json);
      } catch (err: unknown) {
        if (!cancelled) setJourneyError(err instanceof Error ? err.message : "Kan du prøve igjen?");
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
          .catch(() => setJourneyError("Kan du prøve igjen?"));
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
      if (!res.ok) throw new Error("Vi gir oss ikke – vi leter videre.");
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
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary">
         <Section className="gap-2xl py-6xl">
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
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex items-center justify-center">
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
       <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex items-center justify-center">
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
     <div className="min-h-screen bg-ts-bg-primary text-ts-primary">
       <Section className="gap-2xl py-6xl">
         {/* Header — UI 4.2: display-m + gold glow */}
         <FadeIn>
           <div className="space-y-md">
             <h1 className="ts-display-m text-gold-glow-text font-semibold">
               Velkommen tilbake
             </h1>
             <BodyMd className="text-text-muted">Her er reisen din</BodyMd>
           </div>
         </FadeIn>

         {/* Matching status */}
         {matchStatus === "no_match" && (
           <FadeIn>
             <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg text-center space-y-lg">
               <h2 className="ts-font-heading-2xl text-text-primary">Ingen match ennå</h2>
               <BodyMd className="text-text-muted">Trykk under for å starte matching.</BodyMd>
               <PremiumButton
                 variant="primary"
                 onClick={handleMatching}
                 className="mx-auto gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
               >
                 {matchingLoading ? "Søker…" : "Finn match"}
               </PremiumButton>
             </div>
           </FadeIn>
         )}

         {matchStatus === "pending" && (
            <FadeIn>
              <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg text-center space-y-lg">
                <h2 className="ts-font-heading-2xl text-text-primary">Vi finner en match til deg…</h2>
                <BodyMd className="text-text-muted">Dette kan ta litt tid.</BodyMd>
               <Spinner />
             </div>
           </FadeIn>
        )}

         {matchStatus === "matched" && (
           <FadeIn>
             <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg space-y-lg">
               <div className="text-center space-y-md">
                 <h2 className="ts-font-heading-2xl text-text-primary">Du har fått en match! 🎉</h2>
                 <BodyMd className="text-text-muted">Se på profilen for å starte samtalen.</BodyMd>
               </div>

               {/* Match profile loading */}
               {matchProfileLoading && (
                 <div className="rounded-[var(--ts-radius-xl)] bg-ts-glass-bg/50 p-lg space-y-md">
                   <div className="flex items-center justify-center">
                     <div className="w-32 h-32 rounded-full bg-ts-glass-bg ring-1 ring-ts-gold/20 animate-pulse" />
                  </div>
                   <div className="space-y-xs text-center">
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
                </div>
              )}

                {/* Match profile error */}
                {matchProfileError && (
                  <div className="rounded-[var(--ts-radius-xl)] bg-ts-glass-bg/50 p-lg text-center space-y-md">
                    <BodyMd className="text-ts-error">Kunne ikke hente match-profil</BodyMd>
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
                 <div className="rounded-[var(--ts-radius-xl)] bg-ts-glass-bg-strong/80 p-xl space-y-lg">
                   <div className="text-center space-y-md">
                     <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-ts-bg-surface ring-2 border-ts-gold/30 relative">
                       <div className="absolute inset-0 gold-glow-sm rounded-full" />
                       {matchProfile.imageUrl ? (
                         <img src={matchProfile.imageUrl} alt={matchProfile.name} className="w-full h-full object-cover relative z-10" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-ts-gold text-4xl font-light relative z-10">
                           {matchProfile.name.charAt(0).toUpperCase()}
                         </div>
                       )}
                     </div>

                     <div className="space-y-xs">
                       <h2 className="ts-font-heading-xl text-text-primary">{matchProfile.name}</h2>
                       {matchProfile.age && (
                         <BodySm className="text-ts-gold">{matchProfile.age} år</BodySm>
                       )}
                     </div>

                     {matchProfile.bio && (
                       <BodyMd className="text-text-secondary leading-relaxed max-w-md mx-auto">
                         {matchProfile.bio}
                       </BodyMd>
                     )}

                     {matchProfile.interests && matchProfile.interests.length > 0 && (
                       <div className="flex flex-wrap justify-center gap-2">
                         {matchProfile.interests.slice(0, 5).map((interest: string) => (
                           <span
                             key={interest}
                             className="inline-block rounded-full px-3 py-1 bg-ts-gold-soft text-ts-gold border border-ts-gold/20 text-sm"
                           >
                             {interest}
                           </span>
                         ))}
                       </div>
                     )}

                     <PremiumButton
                       variant="primary"
                       onClick={() => router.push(`/profile/${matchProfile.id}`)}
                       className="mx-auto gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
                     >
                       Se profil
                     </PremiumButton>
                   </div>
                 </div>
               )}
             </div>
           </FadeIn>
         )}

         {/* Din match — UI 4.2: ts-glass + gold-border-glow */}
         {data.match && (
           <FadeIn>
             <div className="space-y-md">
               <h2 className="ts-font-heading-2xl text-text-primary">Din match</h2>
               <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
                 <div className="flex items-start gap-4">
                   <div className="w-16 h-16 shrink-0 rounded-[var(--ts-radius-lg)] bg-ts-bg-surface ring-1 ring-ts-gold/20 flex items-center justify-center text-ts-gold text-lg font-light">
                     {data.match.name.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-text-primary font-medium">
                       {data.match.name}, {data.match.age}
                     </p>
                     {data.match.bio && (
                       <p className="text-text-muted text-sm mt-1 leading-relaxed">
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

         {/* Samtale — UI 4.2: ts-glass + calm-gradient-blue subtle bg */}
         {data.conversation && (
           <FadeIn>
             <div className="space-y-md">
               <h2 className="ts-font-heading-2xl text-text-primary">Samtale</h2>
               <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm relative overflow-hidden">
                 <div className="absolute inset-0 calm-gradient-blue opacity-30 pointer-events-none" />
                 <div className="relative z-10 space-y-xs">
                   <p className="text-ts-gold font-medium text-sm">{data.conversation.partnerName}</p>
                   <p className="text-text-primary text-sm leading-relaxed">
                     {data.conversation.lastMessage}
                   </p>
                   <BodySm className="mt-2 text-text-muted">
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
                   className="gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
                 >
                   Fortsett samtale
                 </PremiumButton>
               </div>
             </div>
           </FadeIn>
         )}

         {/* Journey Summary — UI 4.2: ts-glass-strong + gold progress bar */}
         {journeyLoading ? (
           <FadeIn>
             <div className="rounded-[var(--ts-radius-2xl)] bg-ts-glass-bg/80 p-xl space-y-md">
               <Skeleton width="w-40" height="h-6" rounded="md" />
               <Skeleton width="w-full" height="h-2" rounded="full" />
               <Skeleton width="w-3/4" height="h-4" rounded="md" />
               <Skeleton width="w-48" height="h-10" rounded="xl" />
             </div>
           </FadeIn>
         ) : journeyError ? (
           <FadeIn>
             <div className="rounded-[var(--ts-radius-2xl)] bg-ts-glass-bg/80 p-xl text-center space-y-md">
               <BodyMd className="text-ts-error">{journeyError}</BodyMd>
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
                .catch(() => setJourneyError("Kunne ikke oppdatere journey"));
             }}
           />
         ) : null}

         {/* Reisen deres — UI 4.2: ts-glass + calm-gradient-gold subtle bg */}
         {data.journey && (
           <FadeIn>
             <div className="space-y-md">
               <h2 className="ts-font-heading-2xl text-text-primary">Reisen din</h2>
               <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg space-y-lg transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-md relative overflow-hidden">
                 <div className="absolute inset-0 calm-gradient-gold opacity-20 pointer-events-none" />
                 <div className="relative z-10 space-y-xs">
                   <BodySm className="text-ts-gold">
                     Dag {data.journey.day} av {data.journey.totalDays}
                   </BodySm>
                   <h2 className="ts-font-heading-xl text-text-primary font-light">{data.journey.tittel}</h2>
                   <BodyMd className="text-text-secondary leading-relaxed">
                     {data.journey.beskrivelse}
                   </BodyMd>
                 </div>
                 <PremiumButton
                   variant="primary"
                   onClick={() => router.push("/journey")}
                   className="gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
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
