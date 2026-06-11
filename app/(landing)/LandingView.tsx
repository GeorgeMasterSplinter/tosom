"use client";

import { useRouter } from "next/navigation";

export default function LandingView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto py-20 px-6 space-y-20">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-light text-white leading-tight">
            ToSom — en reise for to mennesker som vil hverandre godt
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Ingen swiping. Ingen jag. Ingen støy. Bare to mennesker som møtes, i sitt eget tempo.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-8 inline-block rounded-xl bg-white text-gray-900 font-medium px-6 py-4 hover:bg-gray-200 transition"
          >
            Start reisen
          </button>
        </div>

        {/* Privat profil */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <h2 className="text-xl font-light text-white">Bygg din egen historie</h2>
          <p className="text-gray-300 leading-relaxed">
            Du lager en privat profil som viser hvem du er — ikke hvem du tror du må være.
          </p>
        </section>

        {/* Guidet matching */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <h2 className="text-xl font-light text-white">Vi hjelper deg å vise hvem du er</h2>
          <p className="text-gray-300 leading-relaxed">
            Forskningbasert veiledning hjelper deg å lage en profil som gir ekte kompatibilitet.
          </p>
        </section>

        {/* En reise for to */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <h2 className="text-xl font-light text-white">Når dere matcher, starter reisen</h2>
          <p className="text-gray-300 leading-relaxed">
            En varm, rolig og guidet reise som bygger nærhet, forståelse og trygghet.
          </p>
        </section>

        {/* Under utvikling */}
        <section className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
          <h2 className="text-lg font-light text-white">Under utvikling</h2>
          <p className="text-gray-300 leading-relaxed">
            ToSom er under aktiv utvikling.
            Vi bygger en rolig, varm og moderne plattform for ekte relasjoner.
            Design, funksjoner og opplevelser forbedres fortløpende mens vi gjør oss klare for lansering.
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 ToSom. Alle rettigheter forbeholdt.
          </p>
        </section>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm py-10">
          © 2026 ToSom — bygget for ekte relasjoner
        </p>
      </div>
    </div>
  );
}
