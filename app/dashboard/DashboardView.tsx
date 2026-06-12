"use client";

import { useRouter } from "next/navigation";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

const { H1, H2, BodyMd } = Typography;

/* ------ Data ------ */

const match = {
  navn: "Elin",
  alder: 28,
  bio: "Friluftsmenneske med kjærlighet til musikk og gode samtaler om livet.",
};

const convo = {
  sisteMelding: "Ja, det høres kjekk ut!",
  tid: "for 2 timer siden",
};

const journey = {
  dag: "Dag 12 av 35",
  tittel: "Del erfaringer",
  beskrivelse:
    "Del med matchen din en personlig erfaring som har formet deg. Det skaper nærhet og trygghet.",
};

/* ------ Visning ------ */

export default function DashboardView() {
  const router = useRouter();

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
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Din match</H2>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-xl bg-gray-800 ring-1 ring-white/10 flex items-center justify-center text-gray-400 text-lg font-light">
                  {match.navn[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">
                    {match.navn}, {match.alder}
                  </p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    {match.bio}
                  </p>
                </div>
              </div>
              <PremiumButton
                variant="secondary"
                onClick={() => router.push("/profile/1")}
              >
                Se profil
              </PremiumButton>
            </div>
          </div>
        </FadeIn>

        {/* Samtale */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Samtale</H2>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
              <div className="space-y-2">
                <p className="text-white font-medium text-sm">{match.navn}</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {convo.sisteMelding}
                </p>
                <span className="text-gray-500 text-xs">{convo.tid}</span>
              </div>
              <PremiumButton
                variant="primary"
                onClick={() => router.push("/conversation/mock")}
              >
                Fortsett samtale
              </PremiumButton>
            </div>
          </div>
        </FadeIn>

        {/* Reisen deres */}
        <FadeIn>
          <div className="space-y-4">
            <H2 className="text-white">Reisen deres</H2>
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">{journey.dag}</p>
                <H2 className="text-white text-2xl font-light">
                  {journey.tittel}
                </H2>
                <BodyMd className="text-gray-300 leading-relaxed">
                  {journey.beskrivelse}
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
      </Section>
    </div>
  );
}
