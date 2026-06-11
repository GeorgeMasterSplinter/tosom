"use client";

import { useRouter } from "next/navigation";

/* ------ Komponent ------ */

export default function DashboardView() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950/80 backdrop-blur-sm py-4 z-10 border-b border-white/10 -mx-4 px-4">
          <div>
            <h1 className="text-3xl font-light text-white">
              Velkommen tilbake
            </h1>
            <p className="text-gray-400 mt-1">Her er reisen deres</p>
          </div>
        </div>

        {/* Din match */}
        <section>
          <h2 className="text-lg font-medium text-white">Din match</h2>
          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 shadow-md shadow-black/20 space-y-4">
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
            <button
              onClick={() => router.push("/profile/1")}
              className="rounded-xl bg-white/10 border border-white/10 text-gray-200 px-4 py-3 hover:bg-white/20 transition"
            >
              Se profil
            </button>
          </div>
        </section>

        {/* Samtale */}
        <section>
          <h2 className="text-lg font-medium text-white">Samtale</h2>
          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 shadow-md shadow-black/20 space-y-4">
            <div className="space-y-2">
              <p className="text-white font-medium text-sm">{match.navn}</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {convo.sisteMelding}
              </p>
              <span className="text-gray-500 text-xs">
                {convo.tid}
              </span>
            </div>
            <button
              onClick={() => router.push("/conversation/mock")}
              className="rounded-xl bg-white text-gray-900 font-medium px-4 py-3 hover:bg-gray-200 transition"
            >
              Fortsett samtale
            </button>
          </div>
        </section>

        {/* Reisen deres */}
        <section>
          <h2 className="text-lg font-medium text-white">Reisen deres</h2>
          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 shadow-md shadow-black/20 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {journey.dag}
              </p>
              <h3 className="text-xl font-light text-white">
                {journey.tittel}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm mt-2">
                {journey.beskrivelse}
              </p>
            </div>
            <button
              onClick={() => router.push("/journey")}
              className="rounded-xl bg-white text-gray-900 font-medium px-4 py-3 hover:bg-gray-200 transition"
            >
              Fortsett reisen
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
