"use client";

import { useRouter } from "next/navigation";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

const { H1, H2, BodyMd } = Typography;

export default function LandingView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6 py-24 md:py-32">
          <FadeIn>
            <div className="space-y-6">
              <H1 className="text-white">ToSom — en reise for to</H1>
              <BodyMd className="text-gray-400 text-lg max-w-xl mx-auto">
                En varm, moderne og guidet plattform for ekte relasjoner.
              </BodyMd>
              <PremiumButton variant="primary" onClick={() => router.push("/login")}>
                Start reisen
              </PremiumButton>
            </div>
          </FadeIn>
        </div>

        {/* Privat profil */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <H2 className="text-white">Bygg din egen historie</H2>
          <BodyMd className="text-gray-300 leading-relaxed">
            Du lager en privat profil som viser hvem du er — ikke hvem du tror du må være.
          </BodyMd>
        </div>

        {/* Guidet matching */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <H2 className="text-white">Vi hjelper deg å vise hvem du er</H2>
          <BodyMd className="text-gray-300 leading-relaxed">
            Forskningbasert veiledning hjelper deg å lage en profil som gir ekte kompatibilitet.
          </BodyMd>
        </div>

        {/* En reise for to */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <H2 className="text-white">Når dere matcher, starter reisen</H2>
          <BodyMd className="text-gray-300 leading-relaxed">
            En varm, rolig og guidet reise som bygger nærhet, forståelse og trygghet.
          </BodyMd>
        </div>

        {/* Under utvikling */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <H2 className="text-white">Under utvikling</H2>
          <BodyMd className="text-gray-300 leading-relaxed">
            ToSom er under aktiv utvikling.
            Vi bygger en rolig, varm og moderne plattform for ekte relasjoner.
            Design, funksjoner og opplevelser forbedres fortløpende mens vi gjør oss klare for lansering.
          </BodyMd>
          <p className="text-gray-500 text-sm">
            © 2025 ToSom. Alle rettigheter forbeholdt.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm py-10">
          © 2026 ToSom — bygget for ekte relasjoner
        </p>
      </Section>
    </div>
  );
}
