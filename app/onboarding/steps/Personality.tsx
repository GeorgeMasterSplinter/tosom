"use client";

export default function Personality({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Personlighet</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Vær deg selv. Ikke CV-versjonen av deg.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvordan vil en venn beskrive deg?</label>
        <textarea
          value={svar.venskapsbeskrivelse ?? ""}
          onChange={(e) => oppdaterSvar("vennskapsbeskrivelse", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. rolig, trygg, litt nerdete"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvordan reagerer du når du er stresset?</label>
        <textarea
          value={svar.stressReaksjon ?? ""}
          onChange={(e) => oppdaterSvar("stressReaksjon", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. trenger tid alene, så kommer jeg tilbake"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvordan viser du omsorg?</label>
        <textarea
          value={svar.omsoerg ?? ""}
          onChange={(e) => oppdaterSvar("omsoerg", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. gjennom å lytte og være til stede"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvordan liker du å bli møtt?</label>
        <textarea
          value={svar.ønsketMoete ?? ""}
          onChange={(e) => oppdaterSvar("ønsketMoete", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. med ærlighet og tålmodighet"
        />
      </div>
    </div>
  );
}
