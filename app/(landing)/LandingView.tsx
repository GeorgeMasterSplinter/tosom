"use client";

import { useRouter } from "next/navigation";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";

const { H1, H2, BodyMd } = Typography;

export default function LandingView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Section className="space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6">
          <H1 className="text-white leading-tight">
            ToSom — en reise for to mennesker som vil hverandre godt
          </H1>
          <BodyMd className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Ingen swiping. Ingen jag. Ingen støy. Bare to mennesker som møtes, i sitt eget tempo.
          </BodyMd>
          <button
            onClick={() => router.push("/login")}
            className="mt-8 inline-block rounded-xl bg-white text-gray-900 font-medium px-6 py-4 hover:bg-gray-200 transition"
          >
            Start reisen
          </button>
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
