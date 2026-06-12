"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

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

interface DashboardData {
  match: MatchInfo | null;
  conversation: ConvoInfo | null;
  journey: JourneyInfo | null;
}

/* ------ Visning ------ */

export default function DashboardView() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <BodyMd className="text-gray-400">Laster...</BodyMd>
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

        {/* Din match */}
        {data.match && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Din match</H2>
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-gray-800 ring-1 ring-white/10 flex items-center justify-center text-gray-400 text-lg font-light">
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
                  onClick={() => router.push(`/profile/${data.match.id}`)}
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
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
                <div className="space-y-2">
                  <p className="text-white font-medium text-sm">{data.conversation.partnerName}</p>
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
                  onClick={() => router.push(`/conversation/${data.conversation.conversationId}`)}
                >
                  Fortsett samtale
                </PremiumButton>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Reisen deres */}
        {data.journey && (
          <FadeIn>
            <div className="space-y-4">
              <H2 className="text-white">Reisen deres</H2>
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
                <div className="space-y-2">
                  <BodySm className="text-gray-500">
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
