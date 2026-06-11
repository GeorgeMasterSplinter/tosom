"use client";

export default function Future({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Fremtid og ønsker</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Du trenger ikke ha alt klart. Bare del det som betyr noe for deg.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hvor ser du deg selv om 5 år?</label>
        <textarea
          value={svar.femAar ?? ""}
          onChange={(e) => oppdaterSvar("femAar", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. i et trygt forhold, med arbeid jeg trives med"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva håper du å finne i en partner?</label>
        <textarea
          value={svar.partnerSoek ?? ""}
          onChange={(e) => oppdaterSvar("partnerSoek", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. en som er ærlig og vil bygge noe sammen"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva håper du å bygge sammen?</label>
        <textarea
          value={svar.byggeSammen ?? ""}
          onChange={(e) => oppdaterSvar("byggeSammen", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. en hverdag med ro, humor og næring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva er dine drømmer?</label>
        <textarea
          value={svar.drommer ?? ""}
          onChange={(e) => oppdaterSvar("drommer", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. å reise sammen, ha et hjem med mye liv"
        />
      </div>
    </div>
  );
}
