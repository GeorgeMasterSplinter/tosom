/* ═══════════════════════════════════════════
   ToSom Premium — Dashboard Page (Redesigned)
   SectionHero + DashboardHeader + StreakDisplay + QuickActionGrid + NotificationFeed
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/ui/Section";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { NotificationFeed, NotificationItem } from "@/components/dashboard/NotificationFeed";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResonanceMeter } from "@/components/ui/ResonanceMeter";
import { JourneyMap, JourneyStep } from "@/components/journey/JourneyMap";
import { JourneyCard } from "@/components/journey/JourneyCard";
import { FadeIn, FadeInUp } from "@/components/ui/FadeIn";

/* ------ Data types ------ */

interface MatchProfile {
  id: string;
  name: string;
  age?: number | null;
  bio?: string | null;
  imageUrl?: string | null;
  interests?: string[];
  location?: string;
  resonanceScore?: number;
}

interface ConvoInfo {
  partnerName: string;
  lastMessage: string;
  time: string;
}

interface JourneyInfo {
  day: number;
  totalDays: number;
  phase: string;
  tittel: string;
  beskrivelse: string;
}

type MatchStatus = "no_match" | "pending" | "matched";

/* ------ Main Page ------ */

export default function DashboardPage() {
  const router = useRouter();

  /* State */
  const [loading, setLoading] = useState(true);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>("no_match");
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const [conversation, setConversation] = useState<ConvoInfo | null>(null);
  const [journeyInfo, setJourneyInfo] = useState<JourneyInfo | null>(null);
  const [streak, setStreak] = useState(0);
  const [userName] = useState("Bruker");

  /* Demo notifications */
  const [notifications] = useState<NotificationItem[]>([
    { id: "1", title: "Ny match!", description: "Du og Emma har funnet resonans", time: "2 min siden", important: true, type: "match" },
    { id: "2", title: "Ny melding", description: "Emma: Hei! Hvordan har du det?", time: "5 min siden", type: "message" },
    { id: "3", title: "Dagens refleksjon", description: "Dag 3: Hva er noe du sjeldent deler?", time: "1 time siden", type: "info" },
  ]);

  /* Demo journey steps */
  const [journeySteps] = useState<JourneyStep[]>([
    { id: "1", title: "Introduksjon", description: "Oppdag om hverandre", status: "done", icon: "🤝" },
    { id: "2", title: "Trygghet", description: "Bygg grunnlag for tillit", status: "done", icon: "🛡" },
    { id: "3", title: "Åpne deg", description: "Del tanker og følelser", status: "active", icon: "🔓" },
    { id: "4", title: "Djupare samtalar", description: "Utforsk felles verdier", status: "locked" },
    { id: "5", title: "Sårbarheit", description: "Være autentisk sammen", status: "locked" },
  ]);

  /* Fetch data */
  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          if (json.match) setMatchProfile(json.match);
          if (json.conversation) setConversation(json.conversation);
          if (json.journey) setJourneyInfo(json.journey);
        }
      } catch {
        /* Silently fail */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboard();

    /* Fetch match status */
    fetch("/api/matching")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.status) setMatchStatus(json.status);
      })
      .catch(() => {});

    /* Fetch streak */
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.journey) {
          setStreak(json.journey.day || 0);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--ts-gold)]/30 border-t-[var(--ts-gold)] animate-spin" />
          <p className="text-white/30 text-sm">Laster dashboard...</p>
        </div>
      </div>
    );
  }

  /* Demo match data */
  const demoMatch = matchProfile || {
    id: "demo",
    name: "Emma",
    age: 28,
    bio: "Elsker natur og dype samtaler.",
    imageUrl: undefined,
    resonanceScore: 92,
    location: "Oslo",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ts-bg-primary)] to-[#111827] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* SectionHero */}
        <FadeInUp duration={500}>
          <SectionHeader
            badge="Dashboard"
            title="Ditt rom"
            subtitle="Alt du trenger for reisen deres"
          />
        </FadeInUp>

        {/* DashboardHeader */}
        <FadeInUp duration={500} delay={100}>
          <div className="flex justify-center mb-10">
            <DashboardHeader name={userName} />
          </div>
        </FadeInUp>

        {/* StreakDisplay */}
        <FadeInUp duration={500} delay={200}>
          <div className="flex justify-center mb-8">
            <StreakDisplay days={streak || 3} />
          </div>
        </FadeInUp>

        {/* Match Section */}
        {matchStatus === "matched" && demoMatch && (
          <FadeInUp duration={500} delay={300}>
            <div className="mb-8">
              <Card variant="glass" className="p-6">
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--ts-gold)]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    {demoMatch.imageUrl ? (
                      <img src={demoMatch.imageUrl} alt={demoMatch.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--ts-gold)]/10 text-[var(--ts-gold)] text-2xl font-light">
                        {demoMatch.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                      {demoMatch.name}
                      {demoMatch.age && <span className="ml-2 text-base text-white/60">{demoMatch.age}</span>}
                    </h3>
                    {demoMatch.location && (
                      <p className="text-xs text-white/30 mt-0.5">{demoMatch.location}</p>
                    )}
                  </div>

                  {/* ResonanceMeter */}
                  {demoMatch.resonanceScore !== undefined && (
                    <ResonanceMeter score={demoMatch.resonanceScore} label="Resonans" size="sm" />
                  )}

                  {/* Bio */}
                  {demoMatch.bio && (
                    <p className="text-sm text-white/40 text-center max-w-sm">{demoMatch.bio}</p>
                  )}

                  {/* Button */}
                  <Button variant="primary" onClick={() => router.push(`/profile/${demoMatch.id}`)} className="mt-2">
                    Se profil
                  </Button>
                </div>
              </Card>
            </div>
          </FadeInUp>
        )}

        {/* QuickActionGrid */}
        <FadeInUp duration={500} delay={400}>
          <div className="mb-8">
            <QuickActionGrid />
          </div>
        </FadeInUp>

        {/* Conversation */}
        {conversation && (
          <FadeInUp duration={500} delay={500}>
            <div className="mb-8">
              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--ts-gold)]/10 border border-[var(--ts-gold)]/20 flex items-center justify-center text-[var(--ts-gold)] text-sm font-medium">
                    {conversation.partnerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{conversation.partnerName}</p>
                    <p className="text-xs text-white/30 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="primary" onClick={() => router.push(`/chat`)} className="w-full">
                    Fortsett samtale
                  </Button>
                </div>
              </Card>
            </div>
          </FadeInUp>
        )}

        {/* Journey + Notifications Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Journey */}
          <FadeInUp duration={500} delay={300}>
            <Card variant="glass" className="p-6">
              <h3 className="text-sm font-medium text-white/60 mb-4">Din reise</h3>
              <JourneyMap
                steps={journeySteps}
                onSelectStep={() => router.push("/journey")}
              />
              <div className="mt-4">
                <Button variant="secondary" onClick={() => router.push("/journey")} className="w-full">
                  Fortsett reisen
                </Button>
              </div>
            </Card>
          </FadeInUp>

          {/* Notifications */}
          <FadeInUp duration={500} delay={400}>
            <NotificationFeed notifications={notifications} />
          </FadeInUp>
        </div>

        {/* No match yet */}
        {matchStatus === "no_match" && (
          <FadeInUp duration={500} delay={500}>
            <Card variant="glass" className="p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-white/10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-white/30 text-sm mb-4">Ingen match ennå</p>
              <Button variant="primary" onClick={() => router.push("/match")}>
                Finn match
              </Button>
            </Card>
          </FadeInUp>
        )}
      </div>
    </div>
  );
}