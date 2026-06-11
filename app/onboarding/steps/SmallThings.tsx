"use client";

export default function SmallThings({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Dine små ting</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Det er ofte de små tingene som gjør livet stort.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva gjør deg glad?</label>
        <textarea
          value={svar.gjorDegGlad ?? ""}
          onChange={(e) => oppdaterSvar("gjorDegGlad", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. kaffe i stillhet, lange turer"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva gjør deg rolig?</label>
        <textarea
          value={svar.gjorDegRolig ?? ""}
          onChange={(e) => oppdaterSvar("gjorDegRolig", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. musikk, natur, å snakke med en venn"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva gjør deg trygg?</label>
        <textarea
          value={svar.gjorDegTrygg ?? ""}
          onChange={(e) => oppdaterSvar("gjorDegTrygg", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. rutiner, kjente mennesker, en fast hverdag"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva liker du å gjøre alene?</label>
        <textarea
          value={svar.alene ?? ""}
          onChange={(e) => oppdaterSvar("alene", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. spille, lese, bake"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hva liker du å gjøre sammen med noen?</label>
        <textarea
          value={svar.sammen ?? ""}
          onChange={(e) => oppdaterSvar("sammen", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 h-24 resize-none leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="f.eks. film og pledd, matlaging, gå på kino"
        />
      </div>
    </div>
  );
}
