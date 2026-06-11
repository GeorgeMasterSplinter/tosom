"use client";

export default function Values({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Verdier og emosjonelle behov</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Dette er ikke for å imponere. Dette er for å bli forstått.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva er viktig for deg i et forhold?</label>
        <textarea
          value={svar.verdi ?? ""}
          onChange={(e) => oppdaterSvar("verdi", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. ærlighet og ro"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva gjør deg trygg?</label>
        <textarea
          value={svar.trygghet ?? ""}
          onChange={(e) => oppdaterSvar("trygghet", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. å vite at vi snakker sammen"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva gjør deg utrygg?</label>
        <textarea
          value={svar.utrygghet ?? ""}
          onChange={(e) => oppdaterSvar("utrygghet", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. når ting blir urolige"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvordan liker du å løse konflikter?</label>
        <textarea
          value={svar.konflikt ?? ""}
          onChange={(e) => oppdaterSvar("konflikt", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. jeg trenger tid til tenke, så kommer jeg tilbake"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva betyr kjærlighet for deg?</label>
        <textarea
          value={svar.kjaerlighet ?? ""}
          onChange={(e) => oppdaterSvar("kjaerlighet", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. å bli sett og forstått"
        />
      </div>
    </div>
  );
}
