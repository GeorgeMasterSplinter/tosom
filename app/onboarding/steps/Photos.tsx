"use client";

export default function Photos({
  svar,
  oppdaterSvar,
}: {
  svar: Record<string, any>;
  oppdaterSvar: (felt: string, verdi: any) => void;
}) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/20 space-y-4">
      <h2 className="text-xl font-light text-white">Bilder (valgfritt)</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Du trenger ikke vise alt. Bare det som føles riktig.
      </p>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Profilbilde</label>
        <input
          type="text"
          value={svar.profilBilde ?? ""}
          onChange={(e) => oppdaterSvar("profilBilde", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Link til profilbilde"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Bilde 2</label>
        <input
          type="text"
          value={svar.bilde2 ?? ""}
          onChange={(e) => oppdaterSvar("bilde2", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Link til bilde"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Bilde 3</label>
        <input
          type="text"
          value={svar.bilde3 ?? ""}
          onChange={(e) => oppdaterSvar("bilde3", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Link til bilde"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Bilde 4</label>
        <input
          type="text"
          value={svar.bilde4 ?? ""}
          onChange={(e) => oppdaterSvar("bilde4", e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Link til bilde"
        />
      </div>
    </div>
  );
}
